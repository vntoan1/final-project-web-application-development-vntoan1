import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { firestore, auth } from '../firebase';
import { doc, getDoc, addDoc, collection, getFirestore } from 'firebase/firestore';
import './ProductDetail.css';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [imageSrc, setImageSrc] = useState('');
  const [selectedSize, setSelectedSize] = useState(null); // State for selected size

  useEffect(() => {
    const fetchProductDetail = async () => {
      const docRef = doc(firestore, 'products', id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setProduct(docSnap.data());
        setImageSrc(docSnap.data().imageUrls?.[0]);
      } else {
        console.log('Không tìm thấy sản phẩm');
      }
    };

    fetchProductDetail();
  }, [id]);

  const handleAddToCart = () => {
    if (!selectedSize) {
      alert('Vui lòng chọn kích thước.');
      return;
    }

    const savedCart = JSON.parse(localStorage.getItem('cart')) || [];
    const updatedCart = [
      ...savedCart,
      {
        ...product,
        sizes: selectedSize, // lưu size đã chọn
        quantity: 1, // mặc định số lượng là 1 khi thêm sản phẩm
      },
    ];

    // Lưu giỏ hàng vào localStorage
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    alert('Sản phẩm đã được thêm vào giỏ hàng.');
  };

  const handleBuyNow = async () => {
    if (!selectedSize) {
      alert("Vui lòng chọn kích thước trước khi mua ngay.");
      return;
    }
  
    try {
      const user = auth.currentUser;
      if (!user) {
        alert("Vui lòng đăng nhập trước khi mua hàng.");
        return;
      }
  
      const db = getFirestore();
  
      // Lấy `id_customer` từ Firestore
      const userDocRef = doc(db, "users", user.uid);
      const userDocSnap = await getDoc(userDocRef);
  
      if (!userDocSnap.exists()) {
        alert("Không tìm thấy thông tin khách hàng.");
        return;
      }
  
      const idCustomer = userDocSnap.data().id_customer; // Lấy `id_customer`
  
      // Tạo `id_order` ngắn gọn (VD: `ORD12345`)
      const idOrder = `ORD${Math.floor(100000 + Math.random() * 900000)}`; // 6 chữ số ngẫu nhiên
  
      // Tạo đơn hàng
      const ordersRef = collection(db, "orders");
      await addDoc(ordersRef, {
        id_customer: idCustomer, // ID khách hàng từ Firestore
        imageUrls: product.imageUrls,
        id_order: idOrder, // ID đơn hàng ngắn gọn
        name: product.name,
        id_product: product.id_product,
        sale_price: product.sale_price || product.price,
        selectedSize: selectedSize,
        quantity: 1, // Mua 1 sản phẩm
        status: "Đang xử lý", // Trạng thái đơn hàng
        total_amount: product.sale_price || product.price, // Tổng tiền
        createdAt: new Date(),
      });
  
      alert(`Đơn hàng ${idOrder} của bạn đã được tạo thành công!`);
    } catch (error) {
      console.error("Lỗi khi tạo đơn hàng: ", error);
      alert("Không thể tạo đơn hàng. Vui lòng thử lại.");
    }
  };  

  if (!product) return <div>Loading...</div>;

  return (
    <div className="product-detail">
      <div className="product-images">
        <div className="thumbnail-images">
          {product.imageUrls?.map((url, index) => (
            <img
              key={index}
              src={url}
              alt={`${product.name}-${index}`}
              onClick={() => setImageSrc(url)}
            />
          ))}
        </div>
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
            <button
              key={size}
              className={selectedSize === size ? 'selected' : ''}
              onClick={() => setSelectedSize(size)}
            >
              {size}
            </button>
          ))}
        </div>
        <div className="product-actions">
          <button className="buy-now" onClick={handleBuyNow}>
            Mua ngay
          </button>
          <button className="add-to-cart" onClick={handleAddToCart}>
            Thêm vào giỏ hàng
          </button>
        </div>
        <p className="description">{product.mo_ta}</p>
      </div>
    </div>
  );
};

export default ProductDetail;
