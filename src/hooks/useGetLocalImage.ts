import imageCompression from 'browser-image-compression';
import { useState } from 'react';

interface LocalImageOptions {
  maxSizeMB?: number;
  size?: number; // 1:1 크기
}

export const useGetLocalImage = ({
  maxSizeMB = 1,
  size = 96,
}: LocalImageOptions = {}) => {
  const [isLoading, setIsLoading] = useState(false);

  const getImage = async (file: File) => {
    setIsLoading(true);

    // 이미지 로드
    const loadImage = (file: File): Promise<HTMLImageElement> => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        const objectUrl = URL.createObjectURL(file);

        img.onload = () => {
          URL.revokeObjectURL(objectUrl); // 성공시 정리
          resolve(img);
        };

        img.onerror = () => {
          URL.revokeObjectURL(objectUrl); // 실패시에도 정리
          reject(new Error('이미지 로드 실패'));
        };

        img.src = objectUrl;
      });
    };

    // 1:1 비율로 크롭
    const cropToSquare = (img: HTMLImageElement) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d')!;

      // 정사각형 크기 계산 (짧은 변 기준)
      const cropSize = Math.min(img.width, img.height);

      // 중앙 기준으로 크롭 위치 계산
      const startX = (img.width - cropSize) / 2;
      const startY = (img.height - cropSize) / 2;

      // 캔버스 크기 설정
      canvas.width = size;
      canvas.height = size;

      // 이미지 크롭 및 리사이징
      ctx.drawImage(img, startX, startY, cropSize, cropSize, 0, 0, size, size);

      return new Promise<Blob>((resolve) => {
        canvas.toBlob((blob) => resolve(blob!), 'image/jpeg', 0.9);
      });
    };

    try {
      const img = await loadImage(file);
      const croppedBlob = await cropToSquare(img);

      // 추가 압축
      const compressedFile = await imageCompression(
        new File([croppedBlob], file.name, { type: 'image/jpeg' }),
        {
          maxSizeMB,
          maxWidthOrHeight: size,
          useWebWorker: true,
        },
      );

      return compressedFile;
    } catch (error) {
      console.error('이미지 처리 실패:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return { getImage, isLoading };
};
