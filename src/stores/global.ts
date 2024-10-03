import { createWithEqualityFn as create } from 'zustand/traditional';

import type { LANGUAGE } from '@/constants/language';
interface CreateChattingInfo {
  index: number;
  language: LANGUAGE;
}

interface GlobalStore {
  createChattingInfo?: CreateChattingInfo;
  setCreateChattingInfo: (createChattingInfo: CreateChattingInfo) => void;
}
