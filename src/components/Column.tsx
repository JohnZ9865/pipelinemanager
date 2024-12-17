import React, { useState } from "react";

interface ColumnProps {
  title: string;
  items: string[];
  onAddItem: (item: string) => void;
  onSearch: (query: string) => void;
}

const Column: React.FC<ColumnProps> = ({
  title,
  items,
  onAddItem,
  onSearch,
}) => {
  const [newItem, setNewItem] = useState("");

  const handleAdd = () => {
    if (newItem.trim()) {
      onAddItem(newItem);
      setNewItem("");
    }
  };

  return (
    <div className="w-full rounded-lg bg-gray-100 p-4 shadow-md md:w-1/4">
      <h2 className="text-lg font-semibold">{title}</h2>
      <input
        type="text"
        placeholder="Search items..."
        onChange={(e) => onSearch(e.target.value)}
        className="my-1 w-full rounded border border-gray-300 px-2 py-1"
      />

      <ul className="mt-2 space-y-2">
        {items.map((item, index) => (
          <li key={index} className="rounded bg-white p-2 shadow">
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Column;
