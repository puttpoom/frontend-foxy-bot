export default function Container({ children }) {
  return (
    <div className="p-4 grid gap-2">
      {children}
      <div>Footer</div>
    </div>
  );
}
