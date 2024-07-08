import AuthContextProvider from "./contexts/AuthContext";
import Router from "./routes";

export default function App() {
  return (
    <>
      <AuthContextProvider>
        <Router />
      </AuthContextProvider>
    </>
  );
}
