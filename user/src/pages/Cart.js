import React, { useState, useEffect } from "react";
import "./Cart.css";
import { auth } from '../firebase';
import { getFirestore, collection, getDoc, addDoc, doc, getDocs } from "firebase/firestore";

const Cart = () => {
  const [cart, setCart] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectedTotal, setSelectedTotal] = useState(0);

  useEffect(() => {
    const fetchCart = async () => {
      const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
      try {
        const db = getFirestore();
        const productsRef = collection(db, "products");
        const productsSnapshot = await getDocs(productsRef);

        const productsData = productsSnapshot.docs.map((doc) => ({
          id_product: doc.id,
          ...doc.data(),
        }));

        const updatedCart = savedCart.reduce((acc, item) => {
          const product = productsData.find((p) => p.id_product === item.id_product);
          if (product) {
            acc.push({
              ...item,
              sizes: item.sizes || "N/A",
              sale_price: product.sale_price || item.sale_price,
              imageUrls: product.imageUrls || [], // Ensure imageUrls are included
            });
          }
          return acc;
        }, []);

        setCart(updatedCart);
      } catch (error) {
        console.error("Error fetching cart data:", error);
      }
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
    const itemKey = `${productId}-${size}`;
    const updatedSelection = selectedItems.includes(itemKey)
      ? selectedItems.filter((key) => key !== itemKey)
      : [...selectedItems, itemKey];

    setSelectedItems(updatedSelection);
    calculateSelectedTotal(updatedSelection, cart);
  };

  const calculateSelectedTotal = (selectedItems, cart) => {
    const total = selectedItems.reduce((acc, key) => {
      const [productId, size] = key.split("-");
      const item = cart.find((product) => product.id_product === productId && product.sizes === size);
      if (item) {
        return acc + item.quantity * (item.sale_price || item.price);
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

  const handleCheckout = async () => {
    if (selectedItems.length === 0) {
      alert("Vui lòng chọn sản phẩm để thanh toán.");
      return;
    }

    const selectedProducts = cart.filter((item) =>
      selectedItems.includes(`${item.id_product}-${item.sizes}`)
    );

    try {
      const user = auth.currentUser;
      if (!user) {
        alert("Vui lòng đăng nhập trước khi thanh toán.");
        return;
      }

      const db = getFirestore();
      const userDocRef = doc(db, "users", user.uid);
      const userDocSnap = await getDoc(userDocRef);

      if (!userDocSnap.exists()) {
        alert("Không tìm thấy thông tin khách hàng.");
        return;
      }

      const idCustomer = userDocSnap.data().id_customer;
      const idOrder = `ORD${Math.floor(100000 + Math.random() * 900000)}`;

      await Promise.all(
        selectedProducts.map((product) => {
          const selectedSize = product.sizes || "N/A";
          const totalAmount = product.quantity * (product.sale_price || product.price);

          return addDoc(collection(db, "orders"), {
            id_customer: idCustomer,
            imageUrls: product.imageUrls,
            id_order: idOrder,
            name: product.name,
            id_product: product.id_product,
            sale_price: product.sale_price || product.price,
            selectedSize: selectedSize,
            quantity: product.quantity,
            status: "Đang xử lý",
            total_amount: totalAmount,
            createdAt: new Date(),
          });
        })
      );

      alert(`Đơn hàng ${idOrder} của bạn đã được xử lý thành công!`);

      const updatedCart = cart.filter(
        (item) => !selectedItems.includes(`${item.id_product}-${item.sizes}`)
      );
      setCart(updatedCart);
      localStorage.setItem("cart", JSON.stringify(updatedCart));
      setSelectedItems([]);
      setSelectedTotal(0);
    } catch (error) {
      console.error("Error processing order:", error);
      alert("Có lỗi xảy ra khi xử lý đơn hàng.");
    }
  };

  return (
    <div className="cart">
      <h2>Giỏ hàng của bạn</h2>
      <div className="cart-items">
        {cart.map((product, index) => (
          <div key={`${product.id_product}-${product.sizes}-${index}`} className="cart-item">
            <input
              type="checkbox"
              onChange={() => handleSelectItem(product.id_product, product.sizes)}
              checked={selectedItems.includes(`${product.id_product}-${product.sizes}`)}
            />
            <div>
              {product.imageUrls && product.imageUrls.length > 0 ? (
                <img src={product.imageUrls[0]} alt={product.name || "Sản phẩm"} width="100" />
              ) : (
                <p>Không có hình ảnh</p>
              )}
            </div>
            <h3>{product.name}</h3>
            <p>Size: {product.sizes}</p>
            <p className="price">{(product.sale_price || product.price).toLocaleString()} VND</p>
            <div className="quantity-controls">
              <button onClick={() => handleQuantityChange(product.id_product, product.sizes, -1)}>
                -
              </button>
              <span>{product.quantity}</span>
              <button onClick={() => handleQuantityChange(product.id_product, product.sizes, 1)}>
                +
              </button>
            </div>
            <p className="total-price">
              {(product.quantity * (product.sale_price || product.price)).toLocaleString()} VND
            </p>
            <button onClick={() => removeFromCart(product.id_product, product.sizes)}>Xóa</button>
          </div>
        ))}
      </div>

      <div className="cart-total">
        <h3>Tổng cộng (chọn): {selectedTotal.toLocaleString()} VND</h3>
        {selectedItems.length > 0 && <button onClick={handleCheckout}>Thanh toán</button>}
      </div>

      {selectedItems.length > 0 && (
        <div className="qr-code">
          <h3>Xin vui lòng chụp lại hóa đơn</h3>
          <img src="/images/QR.png" alt="QR" className="QR-img" />
        </div>
      )}
    </div>
  );
};

export default Cart;
