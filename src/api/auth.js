import axios from "../config/axios";

export const login = (credential) => axios.post("/api/auth/login", credential);

export const getAuthUser = () => axios.get("/api/auth/me");
