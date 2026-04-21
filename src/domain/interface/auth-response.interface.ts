export interface AuthResponse {
  access_token: string;
  token_type: 'Bearer';
  expires_in: string;
  user: {
    id: string;
    name: string;
    email: string;
    created_at: Date;
    updated_at: Date;
  };
}
