import React, { useState, useEffect } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, firestore } from '../firebase';
import './UserProfile.css';

const UserProfile = () => {
  const [userData, setUserData] = useState({
    username: '',
    email: '',
    phone: '',
    address: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchUserData = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        const docRef = doc(firestore, 'users', user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setUserData(docSnap.data());
        } else {
          console.warn("Không tìm thấy dữ liệu người dùng!");
          setUserData({
            username: '',
            email: user.email,
            phone: '',
            address: '',
          });
        }
      } else {
        console.error("Người dùng chưa đăng nhập!");
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching user data:', error);
      alert("Lỗi khi tải dữ liệu người dùng!");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        const docRef = doc(firestore, 'users', user.uid);
        await updateDoc(docRef, userData);
        alert('Cập nhật thông tin thành công!');
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Error updating user data:', error);
      alert('Đã xảy ra lỗi khi cập nhật!');
    }
  };

  if (loading) return <div>Đang tải thông tin...</div>;
  if (!auth.currentUser) return <div>Bạn cần đăng nhập để xem thông tin cá nhân!</div>;

  return (
    <div className="user-profile">
      <h2>Thông Tin Cá Nhân</h2>
      <div className="profile-field">
        <label>Tên người dùng:</label>
        <input
          type="text"
          name="username"
          value={userData.username}
          onChange={handleChange}
          disabled={!isEditing}
        />
      </div>
      <div className="profile-field">
        <label>Email:</label>
        <input
          type="email"
          name="email"
          value={userData.email}
          onChange={handleChange}
          disabled={!isEditing}
        />
      </div>
      <div className="profile-field">
        <label>Số điện thoại:</label>
        <input
          type="text"
          name="phone"
          value={userData.phone}
          onChange={handleChange}
          disabled={!isEditing}
        />
      </div>
      <div className="profile-field">
        <label>Địa chỉ:</label>
        <input
          type="text"
          name="address"
          value={userData.address}
          onChange={handleChange}
          disabled={!isEditing}
        />
      </div>

      <div className="profile-actions">
        {isEditing ? (
          <>
            <button onClick={handleSave}>Lưu</button>
            <button onClick={() => setIsEditing(false)}>Hủy</button>
          </>
        ) : (
          <button onClick={() => setIsEditing(true)}>Chỉnh sửa</button>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
