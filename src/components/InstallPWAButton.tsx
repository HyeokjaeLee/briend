'use client';

import { useEffect, useState } from 'react';
import { FiDownload } from 'react-icons/fi';

import { Button } from '@/components';
import { cn } from '@/utils';

interface InstallPWAButtonProps {
  className?: string;
  text?: string;
}

/**
 * PWA 설치 버튼 컴포넌트
 * 각 플랫폼별로 다르게 작동하는 설치 기능 제공:
 * - 안드로이드/데스크톱: beforeinstallprompt 이벤트 사용
 * - iOS: 설치 가이드 표시
 */
export const InstallPWAButton = ({
  className,
  text = '앱 설치하기',
}: InstallPWAButtonProps) => {
  // beforeinstallprompt 이벤트 저장용
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  // 설치 가능 여부
  const [isInstallable, setIsInstallable] = useState(false);
  // iOS 디바이스 체크
  const [isIOS, setIsIOS] = useState(false);
  // 설치 가이드 표시 여부
  const [showGuide, setShowGuide] = useState(false);
  // 이미 설치된 상태인지 확인
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // 이미 설치되었는지 확인
    if (
      window.matchMedia('(display-mode: standalone)').matches ||
      // iOS Safari에서 standalone 모드 확인
      (window.navigator as any).standalone === true
    ) {
      setIsInstalled(true);

      return;
    }

    // iOS 디바이스 감지
    const isIOSDevice =
      /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    setIsIOS(isIOSDevice);

    // beforeinstallprompt 이벤트 감지 (안드로이드, 윈도우, 맥)
    const handleBeforeInstallPrompt = (e: Event) => {
      // 브라우저 기본 설치 UI 방지
      e.preventDefault();
      // 이벤트 저장
      setDeferredPrompt(e);
      // 설치 가능 상태로 설정
      setIsInstallable(true);
    };

    // 앱 설치 후 이벤트 감지
    const handleAppInstalled = () => {
      setIsInstallable(false);
      setDeferredPrompt(null);
      setIsInstalled(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener(
        'beforeinstallprompt',
        handleBeforeInstallPrompt,
      );
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  // 설치 프롬프트 실행 함수
  const handleInstallClick = async () => {
    if (isIOS) {
      // iOS에서는 설치 가이드 표시
      setShowGuide(true);

      return;
    }

    if (deferredPrompt) {
      // 설치 프롬프트 표시
      deferredPrompt.prompt();

      // 사용자 선택 결과 대기
      const { outcome } = await deferredPrompt.userChoice;

      // 사용자 응답 후 deferredPrompt 초기화
      setDeferredPrompt(null);

      if (outcome === 'accepted') {
        console.info('사용자가 PWA 설치를 수락했습니다.');
      } else {
        console.info('사용자가 PWA 설치를 거부했습니다.');
        // 나중에 다시 설치할 수 있도록 버튼 유지
        setIsInstallable(true);
      }
    }
  };

  // 이미 설치되었으면 버튼 표시 안함
  if (isInstalled) {
    return null;
  }

  // iOS 설치 가이드
  if (isIOS && showGuide) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
        <div className="max-w-md rounded-lg bg-white p-6 shadow-lg">
          <h3 className="mb-4 text-xl font-bold">iOS에 앱 설치하기</h3>
          <ol className="mb-6 list-decimal pl-5">
            <li className="mb-2">
              Safari 브라우저의 &apos;공유&apos; 버튼을 탭하세요
            </li>
            <li className="mb-2">
              &apos;홈 화면에 추가&apos; 옵션을 선택하세요
            </li>
            <li className="mb-2">&apos;추가&apos;를 탭하세요</li>
          </ol>
          <div className="flex justify-center">
            <Button onClick={() => setShowGuide(false)}>닫기</Button>
          </div>
        </div>
      </div>
    );
  }

  // 설치 불가능하고 iOS가 아니면 버튼 숨김
  if (!isInstallable && !isIOS) {
    return null;
  }

  return (
    <Button
      onClick={handleInstallClick}
      className={cn('flex items-center gap-2', className)}
    >
      <FiDownload className="h-5 w-5" />
      {text}
    </Button>
  );
};
