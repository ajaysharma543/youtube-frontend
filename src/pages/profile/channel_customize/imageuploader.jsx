import React, { useEffect, useState } from "react";
import { Upload } from "lucide-react";

const ImageUploader = ({
  title,
  description,
  value,
  onChange,
  des,
  recommendedSize,
}) => {
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    if (value instanceof File) {
      const objectUrl = URL.createObjectURL(value);
      setPreview(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    } else {
      setPreview(null);
    }
  }, [value]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    onChange(file);
  };

  const handleRemove = () => {
    onChange(null);
  };

  return (
    <div className="w-[60%] max-[640px]:w-full  max-[640px]:p-2 max-[400px]:p-0 rounded-xl p-6 flex flex-col gap-6 ">
      <div>
        <h1 className="text-xl max-[400px]:text-sm font-semibold">{title}</h1>
        <p className="text-gray-400 text-base">{description}</p>
      </div>

      <div className="flex items-center gap-6 ">
        <div className="w-[90%]  max-[400px]:w-full  h-[180px] rounded-xl bg-gray-800 flex items-center justify-center overflow-hidden">
          {preview ? (
            <img
              src={preview}
              alt="Uploaded"
              className="w-full h-full object-cover"
            />
          ) : (
            <Upload className="w-40 h-40 text-gray-500" />
          )}
        </div>

        <div className="flex flex-col justify-start gap-3">
          {recommendedSize && (
            <>
              <p className="text-gray-400  max-[400px]:text-sm text-base">{des}</p>
              <p className="text-gray-400 text-base  max-[400px]:text-sm">
                Recommended size: {recommendedSize}.
              </p>
            </>
          )}

          {!preview ? (
            <label className="bg-red-600 hover:bg-red-700 px-5 py-2  max-[400px]:text-sm rounded-full cursor-pointer font-semibold w-fit">
              Upload Image
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleFileChange}
              />
            </label>
          ) : (
            <div className="flex gap-3">
              <label className="bg-gray-800 hover:bg-gray-700 px-5 py-2 rounded-full cursor-pointer font-semibold w-fit">
                Change
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </label>
              <button
                onClick={handleRemove}
                type="button"
                className="bg-gray-800 hover:bg-red-600 px-5 py-2 rounded-full font-semibold w-fit"
              >
                Remove
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageUploader;
