import useAuth from "../hooks/use-auth";

export default function Navbar() {
  const { authUser } = useAuth();
  console.log("Navbar", authUser);
  return (
    <div className="flex justify-between gap-2">
      <p></p>
      <p>{authUser?.user.email}</p>
    </div>
  );
}
