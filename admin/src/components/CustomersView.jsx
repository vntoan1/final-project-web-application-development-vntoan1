import React, { useState, useEffect } from 'react';
import { firestore } from '../firebase'; 
import { collection, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

const CustomersView = () => {
  const [userCustomer, setUserCustomer] = useState({});  // Quản lý thông tin khách hàng
  const [currentUser, setCurrentUser] = useState(null);  // Quản lý người dùng hiện tại

  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
        fetchCustomerData(user.uid);
      }
    });
  }, []);

  const fetchCustomerData = async (userId) => {
    const querySnapshot = await getDocs(collection(firestore, 'customers'));
    querySnapshot.forEach((doc) => {
      if (doc.data().userId === userId) {
        setUserCustomer({ id: doc.id, ...doc.data() });
      }
    });
  };

  const handleUpdateCustomer = async (updatedCustomer) => {
    if (currentUser) {
      try {
        const docRef = doc(firestore, 'customers', userCustomer.id);
        await updateDoc(docRef, updatedCustomer);
        setUserCustomer({ ...userCustomer, ...updatedCustomer });
      } catch (error) {
        console.error('Error updating customer: ', error);
      }
    }
  };

  const handleDeleteCustomer = async () => {
    if (currentUser) {
      try {
        const docRef = doc(firestore, 'customers', userCustomer.id);
        await deleteDoc(docRef);
        setUserCustomer({});
      } catch (error) {
        console.error('Error deleting customer: ', error);
      }
    }
  };

  return (
    <div>
      <h3>Thông tin khách hàng</h3>
      <div>
        <div>
          <label>ID Khách hàng</label>
          <input
            type="text"
            value={userCustomer.id}
            disabled
          />
        </div>
        <div>
          <label>Tên khách hàng</label>
          <input
            type="text"
            value={userCustomer.name || ''}
            onChange={(e) => setUserCustomer({ ...userCustomer, name: e.target.value })}
          />
        </div>
        <div>
          <label>Email</label>
          <input
            type="text"
            value={userCustomer.email || ''}
            disabled
          />
        </div>
        <button onClick={() => handleUpdateCustomer({ name: userCustomer.name })}>Sửa</button>
        <button onClick={handleDeleteCustomer}>Xóa</button>
      </div>
    </div>
  );
};

export default CustomersView;
