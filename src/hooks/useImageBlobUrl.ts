import { useCallback, useEffect, useState } from 'react';

export const useImageBlobUrl = () => {
  const [imageBlobUrl, setImageBlobUrl] = useState<string>();

  useEffect(
    () => () => {
      if (imageBlobUrl) URL.revokeObjectURL(imageBlobUrl);
    },
    [imageBlobUrl],
  );

  const createBlobUrl = useCallback((blob: Blob) => {
    const blobUrl = URL.createObjectURL(blob);
    setImageBlobUrl(blobUrl);

    return blobUrl;
  }, []);

  return { createBlobUrl, imageBlobUrl };
};
