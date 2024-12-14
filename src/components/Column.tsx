import React, { useState } from "react";

interface ColumnProps {
  title: string;
  items: string[];
  onAddItem: (item: string) => void;
  onSearch: (query: string) => void;
}

const Column: React.FC<ColumnProps> = ({ title, items, onAddItem, onSearch }) => {
  const [newItem, setNewItem] = useState("");

  const handleAdd = () => {
    if (newItem.trim()) {
      onAddItem(newItem);
      setNewItem("");
    }
  };

  return (
    <div className="bg-gray-100 p-4 rounded-lg shadow-md w-full md:w-1/4">
      <h2 className="text-lg font-semibold">{title}</h2>
      <input
        type="text"
        placeholder="Search items..."
        onChange={(e) => onSearch(e.target.value)}
        className="border border-gray-300 rounded px-2 py-1 my-1 w-full"
      />


      <ul className="space-y-2 mt-2">
        {items.map((item, index) => (
          <li key={index} className="bg-white p-2 rounded shadow">
            {item}
          </li>
        ))}
      </ul>

    </div>
  );
};

export default Column;
