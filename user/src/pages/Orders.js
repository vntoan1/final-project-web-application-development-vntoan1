import React, { useState, useEffect } from "react";
import { firestore, auth } from "../firebase"; // Import auth từ Firebase
import { collection, getDocs, updateDoc, getDoc, doc, query, where } from "firebase/firestore";
import './Orders.css';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const user = auth.currentUser;
        if (!user) {
          alert("Vui lòng đăng nhập để xem đơn hàng.");
          return;
        }
  
        // Lấy thông tin người dùng từ Firestore để lấy id_customer
        const userRef = doc(firestore, "users", user.uid);
        const userSnap = await getDoc(userRef);
  
        if (!userSnap.exists()) {
          alert("Không tìm thấy thông tin người dùng.");
          return;
        }
  
        const idCustomer = userSnap.data().id_customer;
        console.log("id_customer:", idCustomer);
  
        // Lấy các đơn hàng của người dùng từ Firestore
        const ordersRef = collection(firestore, "orders");
        const q = query(ordersRef, where("id_customer", "==", idCustomer));
  
        const querySnapshot = await getDocs(q);
        const orderList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
  
        if (orderList.length === 0) {
          console.log("Không có đơn hàng nào.");
        } else {
          console.log("Fetched Orders: ", orderList);
        }
  
        setOrders(orderList);
      } catch (error) {
        console.error("Lỗi khi lấy đơn hàng từ Firestore: ", error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchOrders();
  }, []);

  const handleCancelOrder = async (orderId) => {
    try {
      const orderRef = doc(firestore, "orders", orderId);
      await updateDoc(orderRef, { status: "Đơn hủy" });
      alert("Đơn hàng đã được hủy thành công!");
      
      // Cập nhật danh sách đơn hàng trên giao diện
      setOrders((prevOrders) => 
        prevOrders.map((order) => 
          order.id === orderId ? { ...order, status: "Đơn hủy" } : order
        )
      );
    } catch (error) {
      console.error("Lỗi khi hủy đơn hàng:", error);
      alert("Có lỗi xảy ra khi hủy đơn hàng.");
    }
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp.seconds * 1000);
    return date.toLocaleString(); // Format the date as a readable string
  };

  if (loading) {
    return <div>Loading...</div>; // Hiển thị loading khi đang tải dữ liệu
  }

  return (
    <div className="orders">
      <h2>Thông tin đơn hàng</h2>
      <div className="order-list">
        {orders.length === 0 ? (
          <p>Không có đơn hàng nào.</p>
        ) : (
          orders.map((order) => (
            <div key={order.id} className="order-item">
              <div className="order-image">
                {order.imageUrls && order.imageUrls.length > 0 ? (
                  <img src={order.imageUrls[0]} alt={order.name} />
                ) : (
                  <div className="no-image">Không có hình ảnh</div>
                )}
              </div>
              <div className="order-info"><strong>Mã đơn:</strong> {order.id_order}</div>
              <div className="order-info"><strong>Tên sản phẩm:</strong> {order.name}</div>
              <div className="order-info"><strong>Số lượng:</strong> {order.quantity}</div>
              <div className="order-info"><strong>Giá bán:</strong> {order.sale_price.toLocaleString()} VND</div>
              <div className="order-info"><strong>Kích thước:</strong> {order.selectedSize}</div>
              <div className="order-info"><strong>Trạng thái:</strong> {order.status}</div>
              <div className="order-info"><strong>Tổng tiền:</strong> {order.total_amount.toLocaleString()} VND</div>
              <div className="order-info"><strong>Ngày tạo:</strong> {formatDate(order.createdAt)}</div>
              <div className="order-info">
                {order.status !== "Đơn hủy" && (
                  <button
                    className="cancel-button"
                    onClick={() => handleCancelOrder(order.id)}
                  >
                    Hủy đơn
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Orders;
