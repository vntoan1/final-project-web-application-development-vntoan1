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
  const [userData, setUserData] = useState(null);  // State to store user data
  const navigate = useNavigate();

  // const toggleForm = () => {
  //   setIsLogin(!isLogin);
  // };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // Xử lý đăng nhập, không cần username
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
  
      // Fetch Firestore user data nếu cần
      const docRef = doc(firestore, "users", user.uid);
      const docSnap = await getDoc(docRef);
  
      if (docSnap.exists()) {
        const userData = docSnap.data();
        setUserData(userData); // Chỉ cần set userData sau khi fetch Firestore thành công
        navigate('/home'); // Chuyển hướng đúng cách
      } else {
        setError("User data not found.");
      }
    } catch (error) {
      console.error('Login error:', error); // Log lỗi chi tiết hơn
      setError("Invalid login credentials!");
    }
  };  

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
  
      const countersRef = doc(firestore, "system", "counters");
      const countersSnap = await getDoc(countersRef);
      let newCustomerId = 1;
  
      if (countersSnap.exists()) {
        const data = countersSnap.data();
        newCustomerId = (data.last_customer_id || 0) + 1;
      }
  
      await setDoc(countersRef, { last_customer_id: newCustomerId }, { merge: true });
  
      await setDoc(doc(firestore, "users", user.uid), {
        id_customer: newCustomerId,
        username: userName,
        email: user.email,
        role: "user",
      });
  
      alert("Registration successful!");
      console.log('Redirecting to /home'); // Debugging log
      navigate('/home');
    } catch (error) {
      console.error('Registration error:', error); // Log detailed error
      if (error.code === 'auth/email-already-in-use') {
        setError("Email is already in use");
      } else {
        setError("Error during registration: " + error.message);
      }
    }
  };
  
  const handleLogout = async () => {
    await auth.signOut();
    setUserData(null);
    navigate('/home');
  };

  return (
    <div className="login-register-container">
      <div className="form-toggle">
        <button 
          data-cy="toggle-login"
          className={isLogin ? 'active' : ''} 
          onClick={() => setIsLogin(true)}>Login</button>
        <button 
          data-cy="toggle-register"
          className={!isLogin ? 'active' : ''} 
          onClick={() => setIsLogin(false)}>Register</button>
      </div>

      <div className="form-container">
        {isLogin ? (
          <form className="login-form" onSubmit={handleLogin}>
            <h2>Login</h2>
            {error && <div className="error">{error}</div>}
            <input type="email" name="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <input type="password" name="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            <button type="submit">Login</button>
          </form>
        ) : (
          <form className="register-form" onSubmit={handleRegister}>
            <h2>Register</h2>
            {error && <div className="error">{error}</div>}
            <input type="text" name="username" placeholder="Username" value={userName} onChange={(e) => setUserName(e.target.value)} required />
            <input type="email" name="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <input type="password" name="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            <button type="submit">Register</button>
          </form>
        )}
      </div>

      {userData && (
        <div className="user-info">
          <p>{userData.username}</p>
          <button onClick={() => navigate('/user-profile')}>Profile</button>
          <button onClick={() => navigate('/orders')}>My Orders</button>
          <button onClick={handleLogout}>Logout</button>
        </div>
      )}
    </div>
  );
};

export default LoginRegister;
