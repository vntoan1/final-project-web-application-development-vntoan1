import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { firestore } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import './ProductDetail.css';

const ProductDetail = () => {
  const { id } = useParams(); // Lấy id sản phẩm từ URL
  const [product, setProduct] = useState(null);
  const [imageSrc, setImageSrc] = useState(''); // Thêm state cho ảnh sản phẩm

  useEffect(() => {
    const fetchProductDetail = async () => {
      const docRef = doc(firestore, 'products', id); // Truy xuất sản phẩm theo id
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setProduct(docSnap.data());
        setImageSrc(docSnap.data().imageUrls?.[0]); // Set ảnh chính khi tải sản phẩm
      } else {
        console.log('Không tìm thấy sản phẩm');
      }
    };

    fetchProductDetail();
  }, [id]);

  const handleAddToCart = () => {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart.push(product);
    localStorage.setItem('cart', JSON.stringify(cart));
    alert('Sản phẩm đã được thêm vào giỏ hàng!');
  };

  if (!product) return <div>Loading...</div>;

  return (
    <div className="product-detail">
      <div className="product-images">
        {/* Các ảnh thu nhỏ nằm bên trái ảnh chính */}
        <div className="thumbnail-images">
          {product.imageUrls?.map((url, index) => (
            <img
              key={index}
              src={url}
              alt={`${product.name}-${index}`}
              onClick={() => setImageSrc(url)} // Cập nhật ảnh khi nhấp vào thumbnail
            />
          ))}
        </div>

        {/* Hiển thị ảnh chính */}
        <div className="main-image">
          <img src={imageSrc} alt={product.name} />
        </div>
      </div>

      <div className="product-info">
        <h2>{product.name}</h2>
        <div className="price">
          {product.salePrice ? (
            <>
              <span className="original-price">{product.price} VND</span>
              <span className="sale-price">{product.salePrice} VND</span>
            </>
          ) : (
            <span className="price">{product.sale_price} VND</span>
          )}
        </div>
        <div className="sizes">
          <span>Chọn kích thước: </span>
          {product.sizes?.map((size) => (
            <button key={size}>{size}</button>
          ))}
        </div>
        <div className="product-actions">
          <button className="buy-now">Mua ngay</button>
          <button className="add-to-cart" onClick={handleAddToCart}>
            Thêm vào giỏ hàng
          </button>
        </div>
        {/* Hiển thị mô tả sản phẩm */}
        <p className="description">{product.mo_ta}</p>
      </div>
    </div>

  );
};

export default ProductDetail;
