import React, { useState } from "react";

const AddCategoryModal = ({ isOpen, onClose, onAddCategory }) => {
  const [newCategory, setNewCategory] = useState("");

  const handleAddCategory = () => {
    // Add validation if needed
    onAddCategory(newCategory);
    setNewCategory("");
    onClose();
  };

  return (
    <div className={`modal ${isOpen ? "block" : "hidden"}`}>
      <div className="modal-overlay absolute w-full h-full opacity-50"></div>
      <div className="modal-container bg-white w-96 mx-auto mt-20 p-4 rounded shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Add New Category</h3>
          <button onClick={onClose}>&times;</button>
        </div>
        <input
          type="text"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          placeholder="Enter category name"
          className="w-full p-2 border rounded mb-4"
        />
        <button
          onClick={handleAddCategory}
          className="bg-blue-500 text-white p-2 rounded w-full"
        >
          Add Category
        </button>
      </div>
    </div>
  );
};

export default AddCategoryModal;
