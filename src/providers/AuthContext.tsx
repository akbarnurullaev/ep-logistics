import {createContext, useContext} from "react";
import useLocalStorage from "use-local-storage";
import {Children} from "../types.ts";
import {User} from "../api/hooks/useAuthentication.ts";
import Auth from "../pages/Auth.tsx";

export type AuthContextValue = {
  token: string;
  user: User | undefined;
  logout: () => void;
  setAuthToken: (token: string) => void;
  setUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider = ({ children }: Children) => {
  const [token, setToken] = useLocalStorage("token", "");
  const [user, setUser] = useLocalStorage<User | undefined>("user", undefined);

  const setAuthToken = (token: string) => {
    console.log(token);
    setToken(token);
  };

  const handleLogout = () => {
    setToken("");
  };

  const authRequired = !token;
  const value: AuthContextValue = {
    token,
    user,
    setAuthToken,
    setUser,
    logout: handleLogout,
  };

  return (
    <AuthContext.Provider value={value}>
      {authRequired ? <Auth/> : children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
