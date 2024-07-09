import axios from "../config/axios";

export const login = (data) => axios.post("/api/auth/login", data);

export const logout = () => axios.get("/api/auth/logout");

export const getAuthUser = () => axios.get("/api/auth/me");

export const updateUserFingerprint = (data) =>
  axios.patch("/api/auth/update", data);
