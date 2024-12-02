import React, { useState } from 'react';

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState('');

  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);

    // Gọi hàm onSearch được truyền từ Home.js
    if (onSearch && typeof onSearch === 'function') {
      onSearch(value);
    } else {
      console.error('onSearch prop is not a function.');
    }
  };

  return (
    <div className="search-bar">
      <input
        type="text"
        value={query}
        onChange={handleInputChange}
        placeholder="Tìm kiếm sản phẩm..."
        className="search-input"
      />
    </div>
  );
};

export default SearchBar;
