import React, { useState, useEffect } from 'react';
import { collection, getDocs, doc, deleteDoc } from 'firebase/firestore';
import { firestore } from '../firebase'; // Import firestore
import './CustomersView.css';

const CustomersView = () => {
  const [customersList, setCustomersList] = useState([]); // Dữ liệu của tất cả khách hàng
  const [error, setError] = useState(''); // Xử lý lỗi
  const [isLoading, setIsLoading] = useState(true); // Trạng thái đang tải dữ liệu

  // Fetch dữ liệu khách hàng từ Firestore
  useEffect(() => {
    const fetchCustomersData = async () => {
      try {
        const customersSnapshot = await getDocs(collection(firestore, 'users'));
        const customersData = customersSnapshot.docs.map((doc) => ({
          id_document: doc.id,  // Đây là ID tài liệu Firestore
          ...doc.data(),
        }));        
        setCustomersList(customersData); // Lưu danh sách khách hàng vào state
      } catch (error) {
        setError('Đã xảy ra lỗi khi tải dữ liệu khách hàng');
        console.error("Error fetching customers:", error);
      } finally {
        setIsLoading(false); // Đã hoàn thành tải dữ liệu
      }
    };

    fetchCustomersData();
  }, []); // Chạy khi component được render lần đầu tiên

  // Hàm xóa khách hàng (không kiểm tra điều kiện, có thể xóa bất kỳ tài khoản nào)
  const handleDeleteCustomer = async (customerId) => {
    if (!customerId) {
      console.error("Customer ID is undefined or null");
      return;
    }
  
    try {
      // Truy vấn tài liệu có id_customer khớp với giá trị cần xóa
      const customersCollection = collection(firestore, 'users');
      const querySnapshot = await getDocs(customersCollection);
      let documentIdToDelete = null;
  
      querySnapshot.forEach((doc) => {
        if (doc.data().id_customer === customerId) {
          documentIdToDelete = doc.id; // Lấy ID tài liệu
        }
      });
  
      if (!documentIdToDelete) {
        console.error("No document found with the given id_customer:", customerId);
        setError("Không tìm thấy khách hàng với ID này.");
        return;
      }
  
      // Xóa tài liệu khỏi Firestore
      const customerRef = doc(firestore, 'users', documentIdToDelete);
      await deleteDoc(customerRef);
      console.log("Customer deleted:", customerId);
  
      // Cập nhật danh sách khách hàng sau khi xóa
      setCustomersList((prevList) => {
        return prevList.filter((customer) => customer.id_customer !== customerId);
      });
  
    } catch (error) {
      setError('Lỗi khi xóa khách hàng');
      console.error("Error deleting customer:", error);
    }
  };  
  
  return (
    <div className="customers-view-container">
      {isLoading ? (
        <p>Đang tải dữ liệu...</p> // Hiển thị khi đang tải dữ liệu
      ) : error ? (
        <div className="error">{error}</div> // Hiển thị khi có lỗi
      ) : (
        <>
          <h2>Danh sách khách hàng</h2>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Tên người dùng</th>
                <th>Email</th>
                <th>Số điện thoại</th>
                <th>Địa chỉ</th>
                <th>Vai trò</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {customersList.length > 0 ? (
                customersList.map((customer) => (
                  <tr key={customer.id_customer}>
                    <td>{customer.id_customer}</td>
                    <td>{customer.username}</td>
                    <td>{customer.email}</td>
                    <td>{customer.phone || 'Chưa cập nhật'}</td>
                    <td>{customer.address || 'Chưa cập nhật'}</td>
                    <td>{customer.role}</td>
                    <td>
                      <button
                        className="delete-btn"
                        onClick={() => handleDeleteCustomer(customer.id_customer)}
                      >
                        Xóa
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="no-customers">Không có khách hàng nào.</td>
                </tr>
              )}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};

export default CustomersView;
