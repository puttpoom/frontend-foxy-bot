import axios from "axios";

export const login = (credential) =>
  axios.post("http://localhost:3000/api/auth/login", credential);
