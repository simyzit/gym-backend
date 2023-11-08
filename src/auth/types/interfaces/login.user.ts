export interface LoginUser {
  accessToken: string;
  refreshToken: string;
  user: {
    email: string;
    name: string;
    surname: string;
    avatarURL: string;
    role: string;
    days: number;
  };
}
