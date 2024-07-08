import useAuth from "../hooks/use-auth";

export default function Navbar() {
  const { authUser, fingerprint, initialLoading } = useAuth();
  console.log(authUser, "Navbar");
  if (initialLoading) {
    return <div>Loading...</div>;
  }
  return (
    <div className="flex justify-between gap-2">
      <p>{fingerprint ? fingerprint : null}</p>
      <p>{authUser.email ? authUser.email : "Email"}</p>
    </div>
  );
}
