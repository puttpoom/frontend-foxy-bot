function styleButton(type) {
  switch (type) {
    case "primary":
      return "bg-blue-700 text-white";
    case "secondary":
      return "bg-gray-700 text-white";
    case "danger":
      return "bg-red-700 text-white";
    case "success":
      return "bg-green-700 text-white";
    case "warning":
      return "bg-yellow-700 text-white";
    case "info":
      return "bg-blue-700 text-white";
    case "dark":
      return "bg-black text-white";
    case "light":
      return "bg-white text-black";
    case "white":
      return "bg-white text-black";
    case "orange":
      return "bg-orange-500 text-white";
    default:
      return "bg-blue-700 text-white";
  }
}

export default function MainButton({
  children,
  onClick,
  type,
  isRunning = false,
}) {
  return (
    <div>
      <button
        onClick={onClick}
        disabled={isRunning}
        className={`${styleButton(
          type
        )} p-2 w-full font-bold rounded-md hover:bg-opacity-80 focus:outline-none ${
          isRunning ? "cursor-not-allowed" : "cursor-pointer"
        }`}
      >
        {children}
      </button>
    </div>
  );
}
