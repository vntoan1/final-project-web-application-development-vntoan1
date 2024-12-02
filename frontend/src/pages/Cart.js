import React, { useState, useEffect } from 'react';
import { QRCodeCanvas } from 'qrcode.react'; // Sử dụng QRCodeCanvas thay vì QRCode

const Cart = () => {
  const [cart, setCart] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [isQRVisible, setQRVisible] = useState(false);

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem('cart')) || [];
    setCart(savedCart);
    calculateTotal(savedCart);
  }, []);

  const calculateTotal = (cart) => {
    let total = 0;
    cart.forEach(item => {
      total += (item.salePrice || item.price) * item.quantity;
    });
    setTotalPrice(total);
  };

  const removeFromCart = (productId) => {
    const updatedCart = cart.filter(item => item.id !== productId);
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    calculateTotal(updatedCart);
  };

  const handleCheckout = () => {
    setQRVisible(true); // Hiển thị mã QR khi bấm Thanh toán
  };

  const handleCompleteOrder = () => {
    // Xử lý thanh toán hoàn tất
    alert("Thanh toán thành công!");
    localStorage.removeItem('cart'); // Xóa giỏ hàng sau khi thanh toán
    setCart([]);
    setQRVisible(false);
  };

  const handleCancelOrder = () => {
    setQRVisible(false); // Hủy thanh toán
  };

  return (
    <div className="cart">
      <h2>Giỏ hàng của bạn</h2>
      <div className="cart-items">
        {cart.map((product) => (
          <div key={product.id} className="cart-item">
            <img src={product.image} alt={product.name} />
            <div>
              <h3>{product.name}</h3>
              <p>{(product.salePrice || product.price)} VND</p>
              <p>Số lượng: {product.quantity}</p>
              <button onClick={() => removeFromCart(product.id)}>Xóa</button>
            </div>
          </div>
        ))}
      </div>

      <div className="cart-total">
        <h3>Tổng cộng: {totalPrice} VND</h3>
        <button onClick={handleCheckout}>Thanh toán</button>
      </div>

      {/* Mã QR khi thanh toán */}
      {/* Mã QR khi thanh toán */}
        {isQRVisible && (
          <div className="qr-code">
            <QRCodeCanvas value="Thanh toán qua mã QR" />
            <div>
              <button onClick={handleCompleteOrder}>Hoàn tất</button>
              <button onClick={handleCancelOrder}>Hủy</button>
            </div>
          </div>
        )}

    </div>
  );
};

export default Cart;
