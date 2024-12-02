// src/components/CategoryList.js
import React from 'react';

const categories = ['Quần áo', 'Giày', 'Phụ kiện'];

const CategoryList = () => {
  return (
    <div className="category-list">
      {categories.map((category, index) => (
        <div key={index} className="category-item">
          <h3>{category}</h3>
          <p>Khám phá các sản phẩm {category.toLowerCase()}</p>
        </div>
      ))}
    </div>
  );
};

export default CategoryList;
