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
      return "bg-yellow-500 text-white";
    case "info":
      return "bg-blue-700 text-white";
    case "dark":
      return "bg-black text-white";
    case "light":
      return "bg-gray-100 text-black";
    case "white":
      return "bg-white text-black";
    case "orange":
      return "bg-orange-500 text-white";
    case "none":
      return "bg-none text-black";
    default:
      return "bg-blue-700 text-white";
  }
}

export default function MainButton({
  children,
  onClick,
  type,
  isRunning = false,
  addClass,
}) {
  return (
    <div>
      <button
        onClick={onClick}
        disabled={isRunning}
        className={`${styleButton(
          type
        )} ${addClass} p-2.5 w-full font-bold rounded-md hover:bg-opacity-80 focus:outline-none ${
          isRunning ? "cursor-not-allowed" : "cursor-pointer"
        }`}
      >
        {children}
      </button>
    </div>
  );
}
