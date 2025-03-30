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
} from "react-native";
import { WebView } from "react-native-webview";
import * as WebBrowser from "expo-web-browser";
import Constants from "expo-constants";
import { useFocusEffect } from "expo-router";
import { URLS, URL_PATTERNS } from "@/constants/URLs";

// 개발 환경에서 디버깅을 위한 로그 활성화
const DEBUG = __DEV__;

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [webViewUrl, setWebViewUrl] = useState<string>(URLS.WEB_APP);
  const webViewRef = useRef<WebView>(null);

  // 컴포넌트 마운트 시 로그 출력
  useEffect(() => {
    if (DEBUG) {
      console.log("웹뷰 컴포넌트 마운트됨");
      console.log("로드할 URL:", webViewUrl);
    }

    // 웹뷰 URL이 유효한지 확인
    if (!webViewUrl.startsWith("http")) {
      setError("유효하지 않은 URL입니다: " + webViewUrl);
    }
  }, []);

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

    // 외부에서 열어야 하는 URL인지 확인
    const isExternalURL = URL_PATTERNS.EXTERNAL.some((pattern) =>
      url.startsWith(pattern)
    );

    if (isExternalURL) {
      WebBrowser.openBrowserAsync(url);
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
