import React, { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LucideTrash, Upload } from "lucide-react";

export default function ProfilePhotoUpload({ image, setImage }) {
  const fileInputRef = useRef(null);
  const [preview, setPreview] = useState(null);

  // Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);

      // Create a preview URL
      const previewUrl = URL.createObjectURL(file);
      setPreview(previewUrl);
    }
  };
  const handleRemoveImage = () => {
    setImage(null);
    setPreview(null);
  };

  const onChooseFile = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <Avatar className="w-24 h-24">
        {preview ? (
          <AvatarImage src={preview} alt="Profile preview" />
        ) : (
          <AvatarFallback>U</AvatarFallback>
        )}
      </Avatar>

      {/* Hidden file input */}
      <Input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleFileChange}
        className=""
      />

      <div className="flex gap-2 p-2">
        <Button onClick={onChooseFile} variant="outline">
          Choose Photo
          <Upload className="mr-2 h-4 w-4" />
        </Button>
        <Button
          onClick={handleRemoveImage}
       
          className="w-8 h-8  bg-red-500 text-white  "
        >
          <LucideTrash className=" h-4 w-4 " />
        </Button>
      </div>
    </div>
  );
}
