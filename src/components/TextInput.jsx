export default function TextInput({
  type = "text",
  placeholder,
  label,
  value,
  onChange,
  className,
  ...rest
}) {
  return (
    <div className="flex flex-col w-full">
      {label}
      <input
        {...rest}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="p-2 w-full border border-black focus:outline-none focus:border-blue-500 rounded-md"
      />
    </div>
  );
}
