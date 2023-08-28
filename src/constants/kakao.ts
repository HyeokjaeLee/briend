const REDIRECT_URI = 'http://localhost:3000/auth';
const REST_API_KEY = '96893f0731b3f411310897411ec6e15f';

export const SIGNIN_URL = `https://kauth.kakao.com/oauth/authorize?client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}&response_type=code`;
