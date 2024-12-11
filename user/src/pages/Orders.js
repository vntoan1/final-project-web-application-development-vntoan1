import React, { useState, useEffect } from "react";
import { firestore, auth } from "../firebase";
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
  
        const userRef = doc(firestore, "users", user.uid);
        const userSnap = await getDoc(userRef);
  
        if (!userSnap.exists()) {
          alert("Không tìm thấy thông tin người dùng.");
          return;
        }
  
        const idCustomer = userSnap.data().id_customer;
        const ordersRef = collection(firestore, "orders");
        const q = query(ordersRef, where("id_customer", "==", idCustomer));
        const querySnapshot = await getDocs(q);
        const orderList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
  
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
    return date.toLocaleString(); 
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="orders">
      <h2>Thông tin đơn hàng</h2>
      {orders.length === 0 ? (
        <p className="no-orders">Không có đơn hàng nào.</p>
      ) : (
        <table className="order-table">
          <thead>
            <tr>
              <th>Hình ảnh</th>
              <th>Mã đơn</th>
              <th>Tên sản phẩm</th>
              <th>Số lượng</th>
              <th>Giá bán</th>
              <th>Kích thước</th>
              <th>Trạng thái</th>
              <th>Tổng tiền</th>
              <th>Ngày tạo</th>
              <th>Hủy đơn</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td className="order-image">
                  {order.imageUrls && order.imageUrls.length > 0 ? (
                    <img src={order.imageUrls[0]} alt={order.name} />
                  ) : (
                    <div className="no-image">Không có hình</div>
                  )}
                </td>
                <td>{order.id_order}</td>
                <td>{order.name}</td>
                <td>{order.quantity}</td>
                <td>{order.sale_price.toLocaleString()} VND</td>
                <td>{order.selectedSize}</td>
                <td>{order.status}</td>
                <td>{order.total_amount.toLocaleString()} VND</td>
                <td>{formatDate(order.createdAt)}</td>
                <td>
                  {order.status !== "Đơn hủy" && (
                    <button
                      className="cancel-button"
                      onClick={() => handleCancelOrder(order.id)}
                    >
                      Hủy
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Orders;
