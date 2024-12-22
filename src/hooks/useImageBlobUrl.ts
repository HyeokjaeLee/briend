import { useEffect, useReducer } from 'react';

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

export const useImageBlobUrl = () => {
  const reducer = useReducer(imageBlobUrlReducer, undefined);

  const [, dispatch] = reducer;

  useEffect(() => () => dispatch({ type: 'REVOKE' }), [dispatch]);

  return reducer;
};
