import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import LoginRegister from './components/LoginRegister';
import ProductList from './pages/ProductList';
import Cart from './pages/Cart';
import Orders from './pages/Orders';
import Header from './components/Header';
import UserProfile from './pages/UserProfile'; // Import UserProfile
import { auth, firestore } from './firebase'; // Import Firestore
import ProductDetail from './pages/ProductDetail'; // Import trang chi tiết sản phẩm
import { doc, getDoc } from 'firebase/firestore';

const App = () => {
  const [user, setUser] = useState(null); // Quản lý thông tin người dùng
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      if (currentUser) {
        // Lấy thông tin Firestore của người dùng
        const userDoc = await getDoc(doc(firestore, 'users', currentUser.uid));
        if (userDoc.exists()) {
          setUser({ ...currentUser, ...userDoc.data() }); // Thêm dữ liệu Firestore vào state `user`
        }
      } else {
        setUser(null); // Xóa trạng thái user khi đăng xuất
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <Router>
      <Header user={user} onSearch={(query) => setSearchQuery(query)} />
      <Routes>
        <Route path="/" element={<Home searchQuery={searchQuery} />} />
        <Route path="/home" element={<Home />} />
        <Route path="/category/:id_cata" element={<Home searchQuery={searchQuery} />} />
        <Route path="/account" element={<LoginRegister />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/products" element={<ProductList />} />
        <Route path="/product/:id" element={<ProductDetail />} /> {/* Route cho chi tiết sản phẩm */}
        <Route path="/user-profile" element={<UserProfile />} />
        <Route path="/orders" element={<Orders />} /> 
      </Routes>
    </Router>
  );
};

export default App;
