import useAuth from "../hooks/use-auth";

export default function UserPage() {
  const { authUser } = useAuth();
  return (
    <div>
      <p>{authUser.user.email}</p>
      <p>{authUser.user.uuid}</p>
    </div>
  );
}
