import { useEffect, useReducer, useState } from 'react';

type BlobAction = { type: 'CREATE'; payload: Blob } | { type: 'REVOKE' };

const imageBlobUrlReducer = (state: string | undefined, action: BlobAction) => {
  switch (action.type) {
    case 'CREATE':
      if (state) URL.revokeObjectURL(state);

      return URL.createObjectURL(action.payload);
    case 'REVOKE':
      if (state) URL.revokeObjectURL(state);

      return undefined;
  }
};

export const useImageBlobUrl = (image?: Blob) => {
  const reducer = useReducer(imageBlobUrlReducer, undefined);
  const [blob, setBlob] = useState<Blob | undefined>(image);

  const [, dispatch] = reducer;

  useEffect(() => {
    return () => dispatch({ type: 'REVOKE' });
  }, [dispatch]);

  useEffect(() => {
    if (!image) return dispatch({ type: 'REVOKE' });

    dispatch({ type: 'CREATE', payload: image });
  }, [dispatch, image]);

  return reducer;
};
