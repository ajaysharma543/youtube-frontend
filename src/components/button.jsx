import React from "react";

const Button = ({ type = "submit", text, onClick, loading }) => {
  return (
    <button
      type={type}
      text={text}
      disabled={loading}
      onClick={onClick}
      className="w-full bg-blue-600 mt-4 hover:bg-red-700 text-white py-2 rounded-md transition disabled:opacity-50"
    >
      {loading ? "Loading..." : text}
    </button>
  );
};

export default Button;
