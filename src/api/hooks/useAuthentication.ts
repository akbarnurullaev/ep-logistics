import {api} from "../config.ts";
import {useMutation} from "@tanstack/react-query";
import {useNavigate} from "react-router-dom";
import {useAuth} from "../../providers/AuthContext.tsx";

export type User = {
    "id": number,
    "username": string,
    "first_name": string,
    "last_name": string,
    "full_name": string,
    "date_joined": string
}

export type AuthInput = {
    "username": string;
    "password": string;
}

export type AuthResponse = {
    "token": string;
    "user": User
}

const authenticateDescription = async (authData: AuthInput) => {
  const { data } = await api.post("/api-token-auth/", authData);
  return data;
};

export const useAuthentication = () => {
  const auth = useAuth();
  const navigate = useNavigate();

  return useMutation<AuthResponse, Error, AuthInput>(authenticateDescription, {
    onSuccess: (data) => {
      if (data.token) {
        auth?.setAuthToken(data.token);
        auth?.setUser(data.user);
        navigate("/");
      }
    }
  });
};
