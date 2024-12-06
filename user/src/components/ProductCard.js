import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Thêm useNavigate để điều hướng

const ProductCard = ({ product }) => {
  const [imageSrc, setImageSrc] = useState(product.imageUrls?.[0] || 'default-image-url.jpg');
  const navigate = useNavigate(); // Hook điều hướng

  // Kiểm tra trạng thái đăng nhập
  const isLoggedIn = () => {
    const user = JSON.parse(localStorage.getItem('user')); // Giả sử thông tin đăng nhập được lưu trong localStorage
    return user !== null; // Trả về true nếu người dùng đã đăng nhập
  };

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
    if (!isLoggedIn()) {
      navigate('/login'); // Chuyển hướng đến trang đăng nhập nếu chưa đăng nhập
      return;
    }

    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existingProductIndex = cart.findIndex(
      (item) => item.id_product === product.id_product && item.sizes === product.sizes
    );

    if (existingProductIndex !== -1) {
      cart[existingProductIndex].quantity += 1; // Nếu đã có trong giỏ, tăng số lượng
    } else {
      cart.push({ ...product, quantity: 1 }); // Thêm mới vào giỏ
    }

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

      {/* Giá sản phẩm */}
      <div className="product-price">
        {product.sale_price && (
          <>
            <span
              className="original-price"
              style={{ color: 'red', textDecoration: 'line-through', marginRight: '8px' }}
            >
              {product.price.toLocaleString()} VND
            </span>
            <span className="sale-price" style={{ color: 'black', fontWeight: 'bold' }}>
              {product.sale_price.toLocaleString()} VND
            </span>
          </>
        )}
        {!product.sale_price && (
          <span className="original-price">{product.price.toLocaleString()} VND</span>
        )}
      </div>

      {/* Mô tả sản phẩm */}
      <p>{product.description}</p>
    </div>
  );
};

export default ProductCard;
