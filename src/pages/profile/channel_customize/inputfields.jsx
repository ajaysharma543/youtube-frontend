import React from "react";

function Inputfields({
  label,
  description,
  name,
  register,
  errors,
  type = "text",
  placeholder,
}) {
  return (
    <div className="w-[60%] mb-6">
      <h1 className="text-lg font-semibold mb-1 capitalize">{label}</h1>
      {description && (
        <p className="text-sm text-gray-600 mb-2">{description}</p>
      )}

      <div className="flex gap-2">
        <input
          type={type}
          placeholder={placeholder || label}
          {...register}
          className={`border-2 p-2 rounded-2xl text-white  w-full focus:outline-none ${
            errors[name] ? "border-red-500" : "border-gray-300"
          }`}
        />

      </div>
    </div>
  );
}

export default Inputfields;
