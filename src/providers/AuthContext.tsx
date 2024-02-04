import {createContext, useContext} from "react";
import useLocalStorage from "use-local-storage";
import {Children} from "../types.ts";
import {User} from "../api/hooks/useAuthentication.ts";
import Auth from "../pages/Auth.tsx";
import {useMedia} from "use-media";
import {CreateOrderMobile} from "../pages/CreateOrderMobile.tsx";

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
  const isMobile = useMedia("(max-width: 767px)");

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

  if (isMobile) {
    return <CreateOrderMobile/>;
  }

  return (
    <AuthContext.Provider value={value}>
      {authRequired ? <Auth/> : children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
