import React from "react";

const InputField = React.forwardRef(
  (
    {
      label,
      type = "text",
      name,
      value,
      onChange,
      placeholder,
      required,
      ...rest
    },
    ref
  ) => {
    return (
      <div className="mb-4">
        <label className="block text-sm font-semibold mb-2 text-white">
          {label}
        </label>
        <input
          ref={ref}
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          {...rest} // ✅ allows React Hook Form to inject handlers
          className="w-full px-3 py-2 rounded-3xl bg-black text-white border 
                     placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 
                     transition duration-200"
        />
      </div>
    );
  }
);

export default InputField;
