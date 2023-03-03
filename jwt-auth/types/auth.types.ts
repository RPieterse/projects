export interface IAuthCallback {
  (error: string | null, data: any): void;
}

export interface IAuthCredentials {
  email: string;
  password: string;
}
