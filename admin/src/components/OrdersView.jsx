import React, { useState, useEffect } from 'react';
import { firestore } from '../firebase'; 
import { collection, getDocs, addDoc, updateDoc, doc, deleteDoc } from 'firebase/firestore';

const OrdersView = () => {
  const [orders, setOrders] = useState([]);
  const [newOrder, setNewOrder] = useState({
    id_order: '',
    id_customer: '',
    products: [],
    total_amount: '',
    status: '',
  });

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

  const handleAddOrder = async () => {
    try {
      const docRef = await addDoc(collection(firestore, 'orders'), newOrder);
      setOrders([...orders, { id: docRef.id, ...newOrder }]);
      setNewOrder({
        id_order: '',
        id_customer: '',
        products: [],
        total_amount: '',
        status: '',
      });
    } catch (error) {
      console.error('Error adding order: ', error);
    }
  };

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
      <button onClick={() => document.querySelector('.add-new-form').classList.add('active')}>
        Thêm mới
      </button>

      <div className="add-new-form">
        <h3>Thêm đơn hàng</h3>
        <input
          type="text"
          placeholder="ID đơn hàng"
          value={newOrder.id_order}
          onChange={(e) => setNewOrder({ ...newOrder, id_order: e.target.value })}
        />
        <input
          type="text"
          placeholder="ID khách hàng"
          value={newOrder.id_customer}
          onChange={(e) => setNewOrder({ ...newOrder, id_customer: e.target.value })}
        />
        <input
          type="text"
          placeholder="Sản phẩm"
          value={newOrder.products.join(', ')}
          onChange={(e) => setNewOrder({ ...newOrder, products: e.target.value.split(', ') })}
        />
        <input
          type="number"
          placeholder="Tổng số tiền"
          value={newOrder.total_amount}
          onChange={(e) => setNewOrder({ ...newOrder, total_amount: e.target.value })}
        />
        <input
          type="text"
          placeholder="Trạng thái"
          value={newOrder.status}
          onChange={(e) => setNewOrder({ ...newOrder, status: e.target.value })}
        />
        <button onClick={handleAddOrder}>Lưu</button>
      </div>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>ID khách hàng</th>
            <th>Sản phẩm</th>
            <th>Tổng số tiền</th>
            <th>Trạng thái</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td>{order.id_order}</td>
              <td>{order.id_customer}</td>
              <td>{order.products.join(', ')}</td>
              <td>{order.total_amount}</td>
              <td>{order.status}</td>
              <td>
                <button onClick={() => handleUpdateOrder(order.id, { status: 'Updated' })}>Sửa</button>
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
