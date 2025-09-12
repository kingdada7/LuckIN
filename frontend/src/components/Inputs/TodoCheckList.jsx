import React from "react";
import { HiMiniPlus, HiOutlineTrash } from "react-icons/hi2";
import { useState } from "react";
const TodoCheckList = ({ todoChecklist, setTodoChecklist }) => {
  const [option, setOption] = useState("");

  //function to handle addong an option
  const handleAddOption = () => {
    if (option.trim()) {
      setTodoChecklist([...todoChecklist, option.trim()]);
      setOption("");
    }
  };
  //function to handle removing an option
  const handleRemoveOption = (index) => {
    const updatedArr = todoChecklist.filter((_, idx) => idx !== index);
    setTodoChecklist(updatedArr);
  };
  return (
    <div>
      {todoChecklist.map((item, index) => (
        <div
          className="flex justify-between bg-gray-50 border border-gray-200 px-4 py-2 rounded-md mt-2"
          key={item}
        >
          <p className=" text-xs text-black">
            <span>{index < 9 ? `0${index + 1}` : index + 1} </span>
            {item}
          </p>
          <button className="cursor-pointer" onClick={() => handleRemoveOption(index)}>
            <HiOutlineTrash className="text-lg text-red-500" />
          </button>
        </div>
      ))}
      <div className="flex items-center gap-2 mt-4">
        <input
          type="text"
          placeholder="Add an option"
          value={option}
          onChange={({ target }) => setOption(target.value)}
          className="w-full text-[-13px] text-black outline-none border-gray-100 px-2.5 py-3.5 rounded-md"
        />
        <button className="card-btn text-nowwrap" onClick={handleAddOption}>
          <HiMiniPlus className="text-lg" />
          Add
        </button>
      </div>
    </div>
  );
};

export default TodoCheckList;
