import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // Đừng quên import Link để điều hướng đến chi tiết sản phẩm

const ProductCard = ({ product }) => {
  const [imageSrc, setImageSrc] = useState(product.imageUrls?.[0] || 'default-image-url.jpg');

  // Xử lý hover khi di chuột vào hình ảnh
  const handleMouseEnter = () => {
    if (product.imageUrls?.[1]) {
      setImageSrc(product.imageUrls[1]); // Hiển thị ảnh khác khi hover
    }
  };

  const handleMouseLeave = () => {
    setImageSrc(product.imageUrls?.[0] || 'default-image-url.jpg'); // Quay lại ảnh gốc khi bỏ chuột
  };

  // Thêm sản phẩm vào giỏ hàng
  const handleAddToCart = (e) => {
    e.stopPropagation(); // Ngừng lan truyền sự kiện để tránh chuyển đến trang chi tiết
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart.push(product);
    localStorage.setItem('cart', JSON.stringify(cart)); // Lưu giỏ hàng vào localStorage
    alert('Sản phẩm đã được thêm vào giỏ hàng!');
  };

  return (
    <div className="product-card">
      <Link to={`/product/${product.id}`} className="product-link">
        {/* Container cho hình ảnh và giỏ hàng */}
        <div className="product-image-container">
          <img
            src={imageSrc}
            alt={product.name}
            className="product-image"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          />
          {/* Icon giỏ hàng */}
          <div className="cart-icon" onClick={handleAddToCart}>
            <i className="fas fa-shopping-cart"></i>
          </div>
        </div>
      </Link>

      {/* Tên sản phẩm */}
      <h3>{product.name}</h3>

      <div className="product-price">
        {/* Giá gốc */}
        {product.price && (
          <span className="original-price" style={{ color: 'red', textDecoration: 'line-through' }}>
            {product.price} VND
          </span>
        )}

        {/* Giá sale */}
        {product.salePrice && (
          <span className="sale-price">
            {product.salePrice} VND
          </span>
        )}

        {/* Nếu không có salePrice, chỉ hiển thị giá gốc */}
        {!product.salePrice && product.price && (
          <span className="sale-price">{product.price} VND</span>
        )}
      </div>

      {/* Mô tả sản phẩm */}
      <p>{product.description}</p>
    </div>
  );
};

export default ProductCard;
