import type { ApiParams, ApiResponse } from '../types/api';

import axios from 'axios';
import { getCookie } from 'cookies-next';

import { COOKIES } from '@/constants/cookies-key';

const apiInstance = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

apiInstance.interceptors.request.use((config) => {
  const accessToken = getCookie(COOKIES.ACCESS_TOKEN);

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

export const API_ROUTES = {
  CREATE_CHAT: (params: ApiParams.CREATE_CHAT) =>
    apiInstance.get<ApiResponse.CREATE_CHAT>('/chat/create', {
      params,
    }),
};
