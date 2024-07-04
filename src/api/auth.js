import axios from "axios";

export const login = (credential) => axios.post("/api/auth/login", credential);
