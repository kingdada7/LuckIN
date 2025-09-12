import { LucideChevronDown } from "lucide-react";
import React, { useState } from "react";

const SelectDropdown = ({ options, value, onChange, placeholder }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (option) => {
    onChange(option);
    setIsOpen(false);
  };

  return <div className="relative w-full">
      {/* dropdown button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-sm text-black outline-none bg-white border border-slate-100 px-2.5 py-3.5 flex justify-between items-center "
      >
        {value
          ? options.find((option) => option.value === value)?.label
          : placeholder}
        <span className="ml-2">
          {isOpen ? <LucideChevronDown className="rotate-180" /> : <LucideChevronDown />}
        </span>
      </button>
      
      {/*  deropdown menu */}
      {isOpen && (
        <div className="absolute mt-1 w-full rounded-md bg-white border border-slate-100 shadow-md z-10">
          {options.map((option) => (
            <div
              key={option.value}
              className="cursor-pointer px-4 py-2 text-sm hover:bg-gray-100"
              onClick={() => handleSelect(option.value)}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  
};

export default SelectDropdown;
