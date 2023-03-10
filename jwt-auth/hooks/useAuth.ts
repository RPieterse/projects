import http from "@root/utils/http";

export interface IAuthCallback {
  (error: string | null, data: any): void;
}

export interface IAuthCredentials {
  email: string;
  password: string;
}
export default function useAuth() {
  const login = async (credentials: IAuthCredentials, cb: IAuthCallback) => {
    try {
      const res = await http({
        method: "POST",
        url: "/api/auth/local",
        data: credentials,
      });
      cb(null, JSON.stringify(res.data));
    } catch (error: any) {
      cb(error.response.data.error, null);
    }
  };

  const register = async (credentials: IAuthCredentials, cb: IAuthCallback) => {
    try {
      const res = await http({
        method: "PUT",
        url: "/api/auth/local/register",
        data: credentials,
      });
      cb(null, JSON.stringify(res.data));
    } catch (error: any) {
      cb(error.response.data.error, null);
    }
  };

  const logout = async (cb: IAuthCallback) => {
    //login logic
    try {
      const res = await http({
        method: "DELETE",
        url: "/api/auth/logout",
      });
      cb(null, res.data);
    } catch (error: any) {
      cb(error.response.data.error, null);
    }
  };

  return {
    login,
    register,
    logout,
  };
}
