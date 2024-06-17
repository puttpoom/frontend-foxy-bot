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
    <div>
      <label>
        {label}
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="p-2 w-full border border-black focus:outline-none focus:border-blue-500 rounded-md"
        />
      </label>
    </div>
  );
}
