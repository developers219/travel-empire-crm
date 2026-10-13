import { request } from "./http.js";

export const login = (email, password) =>
  request("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

export const getMe = () => request("/auth/me");
