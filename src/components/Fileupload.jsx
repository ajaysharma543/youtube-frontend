import { Upload } from "lucide-react";
import React, { useState } from "react";

const FileUpload = ({ label, name, onChange, accept = "image/*" }) => {
  const [preview, setPreview] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
      onChange(e);
    }
  };

  return (
    <div className="mb-3">
      {/* Label aligned to left */}
      <label className="block text-sm font-semibold mb-2 text-gray-300 text-left">
        {label}
      </label>

      {/* Centered circular preview */}
      <div className="flex justify-center">
        <div className="relative w-28 h-27 rounded-3xl overflow-hidden border-2 border-gray-600 hover:border-purple-500 transition">
          {preview ? (
            <img
              src={preview}
              alt="Preview"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="flex flex-col  items-center justify-center w-full h-full bg-black text-gray-400 text-xs">
              <Upload className="w-12 h-8 mb-2 bg-white" />
              Click to upload
            </div>
          )}

          {/* Hidden Input */}
          <input
            type="file"
            id={name}
            name={name}
            accept={accept}
            onChange={handleFileChange}
            className="absolute inset-0 opacity-0 cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
};

export default FileUpload;
