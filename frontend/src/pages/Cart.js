import React, { useState, useEffect } from "react";
import { QRCodeCanvas } from "qrcode.react";
import "./Cart.css";
import { getFirestore, collection, getDocs } from "firebase/firestore";

const Cart = ({ qrValue }) => {
  const [cart, setCart] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectedTotal, setSelectedTotal] = useState(0);

  useEffect(() => {
    const fetchCart = async () => {
      const savedCart = JSON.parse(localStorage.getItem("cart")) || [];

      // Lấy thông tin chi tiết sản phẩm từ Firebase
      const db = getFirestore();
      const productsRef = collection(db, "products");
      const productsSnapshot = await getDocs(productsRef);
      const productsData = productsSnapshot.docs.map((doc) => ({
        id_product: doc.id_product,
        ...doc.data(),
      }));

      // Đồng bộ size từ Firebase với dữ liệu trong giỏ hàng
      const updatedCart = savedCart.map((item) => {
        const product = productsData.find((p) => p.id_product === item.id_product);
        return {
          ...item,
          size: product?.sizes || "N/A",
          sale_price: product?.sale_price || item.sale_price,
        };
      });

      // Gộp sản phẩm trùng nhau (dựa trên id và size)
      const mergedCart = updatedCart.reduce((acc, item) => {
        const existing = acc.find((i) => i.id_product === item.id_product && i.size === item.sizes);
        if (existing) {
          existing.quantity += item.quantity;
        } else {
          acc.push(item);
        }
        return acc;
      }, []);

      setCart(mergedCart);
    };

    fetchCart();
  }, []);

  const handleQuantityChange = (productId, size, delta) => {
    const updatedCart = cart.map((item) => {
      if (item.id_product === productId && item.sizes === size) {
        const newQuantity = Math.max(item.quantity + delta, 1);
        return { ...item, quantity: newQuantity };
      }
      return item;
    });

    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    calculateSelectedTotal(selectedItems, updatedCart);
  };

  const handleSelectItem = (productId, size) => {
    if (!productId || !size) return; // Đảm bảo id và size hợp lệ
    const itemKey = `${productId}-${size}`;
    const updatedSelection = selectedItems.includes(itemKey)
      ? selectedItems.filter((key) => key !== itemKey)
      : [...selectedItems, itemKey];
  
    setSelectedItems(updatedSelection);
    calculateSelectedTotal(updatedSelection, cart);
  };  

  const calculateSelectedTotal = (selectedItems, cart) => {
    const total = selectedItems.reduce((acc, key) => {
      if (!key) return acc; // Bỏ qua nếu key không hợp lệ
      const [productId, size] = key.split("-");
      const item = cart.find((product) => product.id_product === productId && product.sizes === size);
      if (item) {
        return acc + (item.sale_price || item.sale_price) * item.quantity;
      }
      return acc;
    }, 0);
    setSelectedTotal(total);
  };  

  const removeFromCart = (productId, size) => {
    const updatedCart = cart.filter((item) => !(item.id_product === productId && item.sizes === size));
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));

    const itemKey = `${productId}-${size}`;
    if (selectedItems.includes(itemKey)) {
      handleSelectItem(productId, size);
    }
  };

  return (
    <div className="cart">
      <h2>Giỏ hàng của bạn</h2>
      <div className="cart-items">
        {cart.map((product) => (
          <div key={`${product.id_product}-${product.size}`} className="cart-item">
            <input
              type="checkbox"
              onChange={() => handleSelectItem(product.id_product, product.sizes)}
              checked={selectedItems.includes(`${product.id_product}-${product.sizes}`)}
            />
            <img src={product.imageUrls} alt={product.name} />
            <div>
              <h3>{product.name}</h3>
              <p>Size: {product.sizes}</p>
            </div>
            <p className="price">
              {(product.sale_price || product.price).toLocaleString()} VND
            </p>
            <div className="quantity-controls">
              <button onClick={() => handleQuantityChange(product.id_product, product.sizes, -1)}>-</button>
              <span>{product.quantity}</span>
              <button onClick={() => handleQuantityChange(product.id_product, product.sizes, 1)}>+</button>
            </div>
            <p className="total-price">
              {(product.quantity * (product.sale_price || product.price || 0)).toLocaleString()} VND
            </p>
            <button onClick={() => removeFromCart(product.id_product, product.sizes)}>Xóa</button>
          </div>
        ))}
      </div>

      <div className="cart-total">
        <h3>Tổng cộng (chọn): {selectedTotal.toLocaleString()} VND</h3>
        {selectedItems.length > 0 && <button>Thanh toán</button>}
      </div>

      {selectedItems.length > 0 && (
        <div className="qr-code">
          <QRCodeCanvas value={qrValue || "Thanh toán qua mã QR"} />
        </div>
      )}
    </div>
  );
};

export default Cart;
