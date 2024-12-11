import React, { useState, useEffect } from 'react';
import { firestore } from '../firebase'; 
import { collection, getDocs, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import './OrdersView.css';  // Import CSS file

const OrdersView = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      const querySnapshot = await getDocs(collection(firestore, 'orders'));
      const orderList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setOrders(orderList);
    };
    fetchOrders();
  }, []);

  const handleDeleteOrder = async (orderId) => {
    try {
      const docRef = doc(firestore, 'orders', orderId);
      await deleteDoc(docRef);
      setOrders(orders.filter((order) => order.id !== orderId));
    } catch (error) {
      console.error('Error deleting order: ', error);
    }
  };

  const handleUpdateOrder = async (orderId, updatedOrder) => {
    try {
      const docRef = doc(firestore, 'orders', orderId);
      await updateDoc(docRef, updatedOrder);
      setOrders(
        orders.map((order) =>
          order.id === orderId ? { ...order, ...updatedOrder } : order
        )
      );
    } catch (error) {
      console.error('Error updating order: ', error);
    }
  };  

  return (
    <div>
      <table>
        <thead>
          <tr>
            <th className = "ID">ID Đơn hàng</th>
            <th>ID Khách hàng</th>
            <th>Sản phẩm</th>
            <th>Số lượng</th>
            <th>Giá bán</th>
            <th>Kích thước</th>
            <th>Tổng tiền</th>
            <th>Trạng thái</th>
            <th>Ngày tạo</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td>{order.id_order}</td>
              <td>{order.id_customer}</td>
              <td>{order.name}</td>
              <td>{order.quantity}</td>
              <td>{order.sale_price.toLocaleString()} VND</td>
              <td>{order.selectedSize}</td>
              <td>{order.total_amount.toLocaleString()} VND</td>
              <td>{order.status}</td>
              <td>{new Date(order.createdAt.seconds * 1000).toLocaleString()}</td>
              <td>
                <button onClick={() => handleUpdateOrder(order.id, { status: 'Đã xác nhận' })}>
                  Xác nhận
                </button>
                <button onClick={() => handleDeleteOrder(order.id)}>Xóa</button>
              </td>
            </tr>          
          ))}
        </tbody>

      </table>
    </div>
  );
};

export default OrdersView;
