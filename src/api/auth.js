import axios from "../config/axios";

export const login = (data) => axios.post("/api/auth/login", data);

export const logout = () => axios.get("/api/auth/logout");

export const getAuthUser = () => axios.get("/api/auth/me");

export const getUserSubcription = (token) => axios.get("/api/subcription");

export const updateUserFingerprint = (data) =>
  axios.patch("/api/auth/update", data);

export const getAllpackages = () => axios.get("/api/package");

export const userBuyPackage = (data) =>
  axios.post("/api/subcription/buy", data);
