import React, { useState } from "react";

const FilterForm = ({ onApply }) => {
  // State to store selected categories
  const [selectedCategories, setSelectedCategories] = useState([]);

  const categories = [
    "electronics",
    "fashion",
    "furniture",
    "books",
    "grocery",
    "games",
    "beauty",
    "health",
  ];

  // Handle checkbox changes
  const handleCheckboxChange = (category) => {
    if (selectedCategories.includes(category)) {
      // Remove the category if already selected
      setSelectedCategories(
        selectedCategories.filter((cat) => cat !== category)
      );
    } else {
      // Add the category if not already selected
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  // Handle Apply button click
  const handleApply = () => {
    onApply(selectedCategories); // Pass selected categories to parent
  };

  return (
    <div className="modal-box">
      {categories.map((category) => (
        <div className="form-control" key={category}>
          <label className="label cursor-pointer">
            <span className="label-text">{category}</span>
            <input
              type="checkbox"
              className="checkbox"
              checked={selectedCategories.includes(category)}
              onChange={() => handleCheckboxChange(category)}
            />
          </label>
        </div>
      ))}
      <div className="modal-action">
        <form method="dialog">
          <button className="btn" onClick={handleApply}>
            Apply
          </button>
        </form>
      </div>
    </div>
  );
};

export default FilterForm;
