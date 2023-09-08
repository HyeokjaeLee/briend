export interface KakaoAccessTokenResponse {
  access_token: string;
  expires_in: number;
  id_token: string;
  refresh_token: string;
  refresh_token_expires_in: number;
  scope: string;
  token_type: string;
}

export interface KaKaoUserResponse {
  connected_at: string;
  id: number;
  kakao_account: {
    profile: {
      nickname?: string;
      thumbnail_image_url?: string;
      profile_image_url?: string;
      is_default_image: boolean;
    };
    profile_image_needs_agreement: boolean;
    profile_nickname_needs_agreement: boolean;
  };
}
