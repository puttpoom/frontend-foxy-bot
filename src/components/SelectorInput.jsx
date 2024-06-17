export default function SelectorInput({ label, value, onChange, options }) {
  return (
    <div>
      <label>
        {label}
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="p-2 w-full border border-black focus:outline-none focus:border-blue-500 rounded-md"
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}
