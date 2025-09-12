import React from "react";
import { HiMiniPlus, HiOutlineTrash } from "react-icons/hi2";

import { useState } from "react";
import { LucidePaperclip } from "lucide-react";

const FileUpload = ({ attachments, setAttachments }) => {
  const [option, setOption] = useState("");

  //function to handle addong an option
  const handleAddOption = () => {
    if (option.trim()) {
      setAttachments([...attachments, option.trim()]);
      setOption("");
    }
  };

  // function to handle removing an option
  const handleRemoveOption = (index) => {
    const updatedArr = attachments.filter((_, idx) => idx !== index);
    setAttachments(updatedArr);
  };
  return (
    <div>
      {attachments.map((item, index) => (
        <div
          key={item}
          className=" flex justify-between bg-gray-50 border border-gray-200 px-4 py-2 rounded-md mb-3 mt-2"
        >
          <div className="flex-1 flex items-center gap-3 border border-gray-200 ">
            <LucidePaperclip className=" text-gray-500" />
            <p className="text-xs text-black">{item}</p>
          </div>
          <button
            className="cursor-pointer"
            onClick={() => handleRemoveOption(index)}
          >
            <HiOutlineTrash className="text-lg text-red-500" />
          </button>
        </div>
      ))}

      <div className="flex items-center gap-3 mt-4">
        <div className="flex-1 flex items-center gap-3 border border-gray-200 rounded-md px-3 ">
          <LucidePaperclip className=" text-gray-500" />
          <input
            type="text "
            onChange={({ target }) => setOption(target.value)}
            className="w-full text-[12px] text-black outline-none bg-white py-2"
            placeholder="File Name"
          />
        </div>
        <button onClick={handleAddOption} className="card-btn text-nowrap">
          <HiMiniPlus className="text-lg" />
          Add
        </button>
      </div>
    </div>
  );
};

export default FileUpload;
