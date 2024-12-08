import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { doc, getDoc, setDoc } from 'firebase/firestore';  
import { auth, firestore, createUserWithEmailAndPassword, signInWithEmailAndPassword } from '../firebase';
import './LoginRegister.css';

const LoginRegister = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userName, setUserName] = useState('');  
  const [error, setError] = useState('');
  const [userData, setUserData] = useState(null);  // State để lưu thông tin người dùng
  const navigate = useNavigate();

  const toggleForm = () => {
    setIsLogin(!isLogin);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
  
      // Truy cập Firestore để lấy thông tin người dùng
      const docRef = doc(firestore, "users", user.uid);
      const docSnap = await getDoc(docRef);
  
      if (docSnap.exists()) {
        const userData = docSnap.data();
        setUserData(userData);  // Lưu dữ liệu người dùng vào state
        console.log('User data: ', userData); // Kiểm tra dữ liệu người dùng
        navigate('/home');
      } else {
        console.error("Không tìm thấy dữ liệu người dùng!");
      }
    } catch (error) {
      setError("Thông tin đăng nhập không chính xác!");
      console.error(error);
    }
  };    

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
  
      const countersRef = doc(firestore, "system", "counters");
  
      // Lấy và tăng last_customer_id
      const countersSnap = await getDoc(countersRef);
      let newCustomerId = 1; // Mặc định nếu chưa có last_customer_id
  
      if (countersSnap.exists()) {
        const data = countersSnap.data();
        newCustomerId = (data.last_customer_id || 0) + 1;
      }
  
      // Cập nhật last_customer_id trong Firestore
      await setDoc(countersRef, { last_customer_id: newCustomerId }, { merge: true });
  
      // Lưu thông tin người dùng với id_customer ngắn gọn
      await setDoc(doc(firestore, "users", user.uid), {
        id_customer: newCustomerId, // ID ngắn gọn
        username: userName,
        email: user.email,
        role: "user", // Mặc định là user
      });
  
      alert("Đăng ký thành công!");
      navigate('/home');
    } catch (error) {
      setError(error.message);
      console.error("Lỗi khi đăng ký:", error);
    }
  };  

  const handleLogout = async () => {
    await auth.signOut();
    setUserData(null);  // Đặt lại thông tin người dùng khi đăng xuất
    navigate('/login');  // Điều hướng về trang đăng nhập
  };

  return (
    <div className="login-register-container">
      <div className="form-toggle">
        <button
          className={isLogin ? 'active' : ''}
          onClick={toggleForm}
        >
          Đăng Nhập
        </button>
        <button
          className={!isLogin ? 'active' : ''}
          onClick={toggleForm}
        >
          Đăng Ký
        </button>
      </div>

      <div className="form-container">
        {isLogin ? (
          <form className="login-form" onSubmit={handleLogin}>
            <h2>Đăng Nhập</h2>
            {error && <div className="error">{error}</div>}
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Mật khẩu"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button type="submit">Đăng Nhập</button>
          </form>
        ) : (
          <form className="register-form" onSubmit={handleRegister}>
            <h2>Đăng Ký</h2>
            {error && <div className="error">{error}</div>}
            <input
              type="text"
              placeholder="Tên người dùng"
              value={userName}
              onChange={(e) => setUserName(e.target.value)} 
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Mật khẩu"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button type="submit">Đăng Ký</button>
          </form>
        )}
      </div>

      {/* Hiển thị tên người dùng nếu đã đăng nhập */}
      {userData && (
        <div className="user-info">
          <p>{userData.username}</p>
          <button onClick={() => navigate('/user-profile')}>Thông tin cá nhân</button>
          <button onClick={() => navigate('/orders')}>Đơn hàng của tôi</button>
          <button onClick={handleLogout}>Đăng xuất</button>
        </div>
      )}
    </div>
  );
};

export default LoginRegister;
