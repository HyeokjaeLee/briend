import React, { useState, useRef, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  ActivityIndicator,
  Platform,
  BackHandler,
  Alert,
  SafeAreaView,
  Linking,
} from "react-native";
import { WebView } from "react-native-webview";
import * as WebBrowser from "expo-web-browser";
import { useFocusEffect } from "expo-router";
import { URLS, URL_PATTERNS, APP_SCHEME } from "../constants/URLs";
import { AppState } from "../stores/AppStateStore";

// 개발 환경에서 디버깅을 위한 로그 활성화
const DEBUG = __DEV__;

export default function WebViewContainer() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [webViewUrl, setWebViewUrl] = useState<string>(URLS.WEB_APP);
  const webViewRef = useRef<WebView>(null);
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);

  // 앱 상태 관리
  const { setIsWebViewLoaded } = AppState.useAppReadyState();

  // 컴포넌트 마운트 시 로그 출력 및 앱스킴 리스너 설정
  useEffect(() => {
    if (DEBUG) {
      console.log("웹뷰 컴포넌트 마운트됨");
      console.log("로드할 URL:", webViewUrl);
    }

    // 웹뷰 URL이 유효한지 확인
    if (!webViewUrl.startsWith("http")) {
      setError("유효하지 않은 URL입니다: " + webViewUrl);
    }

    // 앱스킴 URI 처리를 위한 이벤트 리스너 설정
    const handleDeepLink = (event: { url: string }) => {
      handleAppSchemeUrl(event.url);
    };

    // 앱이 실행 중일 때 열린 URL 처리
    Linking.addEventListener("url", handleDeepLink);

    // 앱이 종료된 상태에서 열린 URL 처리
    Linking.getInitialURL().then((url) => {
      if (url) {
        handleAppSchemeUrl(url);
      }
    });

    return () => {
      // 이벤트 리스너 제거
      // Linking.removeEventListener("url", handleDeepLink); // 구버전 API
      // Note: React Native 0.65부터는 removeEventListener가 필요없음
    };
  }, []);

  // 앱스킴 URL 처리 함수
  const handleAppSchemeUrl = (url: string) => {
    if (url && url.startsWith(`${APP_SCHEME}://`)) {
      if (DEBUG) {
        console.log("앱스킴 URL 감지:", url);
      }

      // auth 파라미터 처리
      if (url.includes("auth")) {
        const urlObj = new URL(url);
        const token = urlObj.searchParams.get("token");
        const refreshToken = urlObj.searchParams.get("refreshToken");

        if (token) {
          setAuthToken(token);
          if (DEBUG) {
            console.log("인증 토큰 설정:", token);
          }
        }

        if (refreshToken) {
          setRefreshToken(refreshToken);
          if (DEBUG) {
            console.log("리프레시 토큰 설정:", refreshToken);
          }
        }

        // 로그인 성공 처리 (여기서는 메인 화면으로 이동)
        setWebViewUrl(URLS.WEB_APP);
        Alert.alert("로그인 성공", "인증이 완료되었습니다.");
      }
    }
  };

  // 안드로이드에서 뒤로가기 버튼 처리
  useFocusEffect(
    React.useCallback(() => {
      if (Platform.OS === "android") {
        const backAction = () => {
          if (webViewRef.current) {
            webViewRef.current.goBack();
            return true; // 기본 뒤로가기 동작 방지
          }
          return false;
        };

        const backHandler = BackHandler.addEventListener(
          "hardwareBackPress",
          backAction
        );
        return () => backHandler.remove();
      }
    }, [])
  );

  // 외부 링크를 처리하는 함수
  const handleExternalLinks = (request: any) => {
    const { url } = request;

    if (DEBUG) {
      console.log("웹뷰 요청 URL:", url);
    }

    // 앱 스킴 URL인지 확인
    const isAppSchemeURL = URL_PATTERNS.APP_SCHEME.some((pattern) =>
      url.startsWith(pattern)
    );

    if (isAppSchemeURL) {
      handleAppSchemeUrl(url);
      return false; // 웹뷰에서 URL 로드 방지
    }

    // 외부에서 열어야 하는 URL인지 확인
    const isExternalURL = URL_PATTERNS.EXTERNAL.some((pattern) =>
      url.startsWith(pattern)
    );

    if (isExternalURL) {
      // 인증 관련 URL은 authSession으로 열어 모달 형태로 표시
      WebBrowser.openAuthSessionAsync(url, `${APP_SCHEME}://auth`, {
        showInRecents: true,
        readerMode: false,
        // iOS에서 SafariViewController가 모달 스타일로 표시되도록 설정
        presentationStyle: WebBrowser.WebBrowserPresentationStyle.FORM_SHEET,
      });
      return false; // 웹뷰에서 URL 로드 방지
    }

    // 기본적으로 웹뷰 내에서 URL 로드 허용
    return true;
  };

  // 웹뷰 로드 실패 시 다시 시도하기 위한 함수
  const handleRetry = () => {
    setError(null);
    setIsLoading(true);
    if (webViewRef.current) {
      webViewRef.current.reload();
    }
  };

  // 네트워크 오류 시 배포 URL로 전환
  const switchToDeployedUrl = () => {
    setWebViewUrl("https://briend.vercel.app");
    setError(null);
    setIsLoading(true);
  };

  // 웹뷰에 주입할 JavaScript (토큰 정보 저장)
  const getInjectedJavaScript = () => {
    if (authToken && refreshToken) {
      return `
        (function() {
          try {
            localStorage.setItem('auth_token', '${authToken}');
            localStorage.setItem('refresh_token', '${refreshToken}');
            console.log('앱에서 토큰 정보가 저장되었습니다.');
          } catch (e) {
            console.error('토큰 저장 중 오류 발생:', e);
          }
        })();
        true;
      `;
    }
    return "";
  };

  return (
    <SafeAreaView style={styles.container}>
      {isLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
          <Text style={styles.loadingText}>Briend 웹 로딩중...</Text>
          <Text style={styles.loadingDetail}>{webViewUrl}</Text>
        </View>
      )}

      {error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>오류가 발생했습니다</Text>
          <Text style={styles.errorMessage}>{error}</Text>
          <Text style={styles.errorDetail}>URL: {webViewUrl}</Text>
          <View style={styles.buttonContainer}>
            <Text style={styles.button} onPress={handleRetry}>
              다시 시도
            </Text>
            {__DEV__ && (
              <Text style={styles.button} onPress={switchToDeployedUrl}>
                배포 URL로 전환
              </Text>
            )}
          </View>
        </View>
      ) : (
        <WebView
          ref={webViewRef}
          source={{ uri: webViewUrl }}
          style={styles.webview}
          onLoadStart={() => {
            setIsLoading(true);
            if (DEBUG) console.log("웹뷰 로딩 시작:", webViewUrl);
          }}
          onLoadEnd={() => {
            setIsLoading(false);
            // 웹뷰 로딩 완료 시 앱 상태 업데이트
            setIsWebViewLoaded(true);
            if (DEBUG) console.log("웹뷰 로딩 완료");
          }}
          onError={(syntheticEvent) => {
            const { nativeEvent } = syntheticEvent;
            const errorMessage =
              nativeEvent.description || "로딩에 실패했습니다";
            setError(errorMessage);
            setIsLoading(false);
            if (DEBUG) console.error("웹뷰 오류:", errorMessage);
          }}
          // 웹뷰와 웹앱 간 통신을 위한 설정
          javaScriptEnabled={true}
          domStorageEnabled={true}
          startInLoadingState={true}
          allowsBackForwardNavigationGestures={true}
          mediaPlaybackRequiresUserAction={false}
          allowsInlineMediaPlayback={true}
          onShouldStartLoadWithRequest={handleExternalLinks}
          injectedJavaScript={getInjectedJavaScript()}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  webview: {
    flex: 1,
  },
  loadingContainer: {
    position: "absolute",
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff",
    zIndex: 1,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
  },
  loadingDetail: {
    marginTop: 5,
    fontSize: 12,
    color: "#666",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  errorMessage: {
    fontSize: 14,
    textAlign: "center",
    color: "red",
    marginBottom: 10,
  },
  errorDetail: {
    fontSize: 12,
    color: "#666",
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
  },
  button: {
    fontSize: 16,
    color: "#2196F3",
    padding: 10,
    marginHorizontal: 10,
    backgroundColor: "#f0f0f0",
    borderRadius: 5,
  },
});
