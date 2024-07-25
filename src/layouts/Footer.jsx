import { Bot } from "lucide-react";

export default function Footer() {
  const PROJECT_NAME = import.meta.env.VITE_PROJECT_NAME;
  return (
    <p
      className="flex gap-1 w-full text-gray-300 text-center items-center justify-center cursor-pointer "
      onClick={() => window.open(`${import.meta.env.VITE_PROJECT_URL}`)}
    >
      <Bot size={16} />
      x.com/{PROJECT_NAME}
    </p>
  );
}
