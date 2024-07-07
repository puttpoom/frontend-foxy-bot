import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

import AuthContextProvider from "./contexts/AuthContext";

ReactDOM.createRoot(document.body).render(
  <AuthContextProvider>
    <App />
  </AuthContextProvider>
);
