import { request } from "./http.js";

export const getExecutives = () => request("/users/executives");
