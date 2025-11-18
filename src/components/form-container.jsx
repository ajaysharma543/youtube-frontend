import React from "react";

const FormContainer = ({ title, children, toggle }) => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-black/90 backdrop-blur-sm">
      <div className="bg-linear-to-b from-black to-gray-950 p-8 rounded-2xl shadow-2xl w-full max-w-md border border-gray-700">
        <h2 className="text-3xl font-extrabold text-center mb-6 text-white tracking-wide">
          {title}
        </h2>

        <div className="space-y-4">{children}</div>
        <div className="text-center mt-3 text-white text-sm">{toggle}</div>
      </div>
    </div>
  );
};

export default FormContainer;
