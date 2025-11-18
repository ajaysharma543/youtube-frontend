import React from "react";

function Inputfields({
  label,
  description,
  name,
  register,
  errors,
  type = "text",
  placeholder,
  showOtpButton = false,
  onSendOtp,
  isSendingOtp = false,
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

        {showOtpButton && (
          <button
            type="button"
            onClick={onSendOtp}
            disabled={isSendingOtp}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:bg-gray-400"
          >
            {isSendingOtp ? "Sending..." : "Send OTP"}
          </button>
        )}
      </div>

      {errors[name] && (
        <p className="text-red-500 text-sm mt-1">{errors[name].message}</p>
      )}
    </div>
  );
}

export default Inputfields;
