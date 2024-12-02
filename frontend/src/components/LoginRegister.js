import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { doc, setDoc, getDoc } from 'firebase/firestore';  // Đảm bảo có 'getDoc'
import { auth, firestore, createUserWithEmailAndPassword, signInWithEmailAndPassword } from '../firebase';
import './LoginRegister.css';

const LoginRegister = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userName, setUserName] = useState('');  // Thêm state cho tên người dùng
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const toggleForm = () => {
    setIsLogin(!isLogin);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Truy cập Firestore để lấy thông tin vai trò
      const docRef = doc(firestore, "users", user.uid);
      const docSnap = await getDoc(docRef);  // Đảm bảo dùng getDoc

      if (docSnap.exists()) {
        const role = docSnap.data().role;
        if (role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/home');
        }
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

      // Tạo document trong Firestore với tên người dùng
      await setDoc(doc(firestore, "users", user.uid), {
        username: userName,  // Lưu tên người dùng từ form đăng ký
        email: user.email,
        role: "user", // Mặc định là user
      });

      alert("Đăng ký thành công!");
      navigate('/home');
    } catch (error) {
      setError(error.message);
    }
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
              onChange={(e) => setUserName(e.target.value)} // Lấy giá trị tên người dùng
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
    </div>
  );
};

export default LoginRegister;
