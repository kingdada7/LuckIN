import React, { useRef, useState, useEffect } from "react";
import { LucideTrash, LucideUpload, LucideUser } from "lucide-react";

export default function ProfilePhotoUpload({ image, setImage }) {
  const fileInputRef = useRef(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  // Update preview whenever "image" changes (file or string URL)
  useEffect(() => {
    if (!image) {
      setPreviewUrl(null);
      return;
    }

    if (typeof image === "string") {
      // Already a saved image URL
      setPreviewUrl(image);
    } else if (image instanceof File) {
      // Fresh upload, create object URL
      const preview = URL.createObjectURL(image);
      setPreviewUrl(preview);

      // Clean up URL when component unmounts
      return () => URL.revokeObjectURL(preview);
    }
  }, [image]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(file);
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
    setPreviewUrl(null);
  };

  const onChooseFile = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="flex justify-center mb-6">
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
      />

      {!previewUrl ? (
        <div className="w-20 h-20 flex items-center justify-center bg-blue-100/50 rounded-full relative cursor-pointer">
          <LucideUser className="w-16 h-16 text-blue-500" />
          <button
            type="button"
            className="flex items-center justify-center bg-blue-500 text-white rounded-full absolute -bottom-1 -right-1 w-8 h-8 cursor-pointer"
            onClick={onChooseFile}
          >
            <LucideUpload className="w-6 h-6" />
          </button>
        </div>
      ) : (
        <div className="relative">
          <img
            src={previewUrl}
            alt="profile photo"
            className="w-20 h-20 rounded-full object-cover"
          />
          <button
            type="button"
            className="flex items-center justify-center bg-red-500 text-white rounded-full absolute -bottom-1 -right-1 w-8 h-8 cursor-pointer"
            onClick={handleRemoveImage}
          >
            <LucideTrash className="w-6 h-6" />
          </button>
        </div>
      )}
    </div>
  );
}
