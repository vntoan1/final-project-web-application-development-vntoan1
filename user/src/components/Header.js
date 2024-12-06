import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { firestore, auth } from '../firebase';
import { signOut } from 'firebase/auth';
import './Header.css';

const Header = ({ user, onLogout, onSearch }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [categories, setCategories] = useState([]);
  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    // Lấy danh mục từ Firestore
    const fetchCategories = async () => {
      try {
        const querySnapshot = await getDocs(collection(firestore, 'categories'));
        const categoryList = querySnapshot.docs.map((doc) => ({
          id_cata: doc.data().id_cata,
          name: doc.data().name,
        }));
        setCategories(categoryList);
      } catch (error) {
        console.error('Error fetching categories: ', error);
      }
    };

    fetchCategories();
    updateCartCount();

    // Lắng nghe sự kiện thay đổi `localStorage`
    const handleStorageChange = () => {
      updateCartCount();
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Hàm tính số lượng sản phẩm trong giỏ hàng
  const updateCartCount = () => {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    setCartCount(count);
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    if (onSearch && typeof onSearch === 'function') {
      onSearch(value);
    }
  };

  const handleLogout = () => {
    signOut(auth).then(() => {
      if (onLogout) onLogout();
    });
  };

  return (
    <header className="header">
      <div className="logo-container">
        <Link to="/" className="logo">
          <img src="/images/logo.png" alt="Logo" className="logo-img" />
        </Link>
      </div>

      <nav className="category-nav">
        {categories.map((category) => (
          <Link
            key={category.id_cata}
            to={`/category/${category.id_cata}`}
            className="category-link"
          >
            {category.name.toUpperCase()}
          </Link>
        ))}
      </nav>

      <div className="search-container">
        <input
          type="text"
          placeholder="Tìm kiếm sản phẩm..."
          value={searchQuery}
          onChange={handleInputChange}
          className="search-input"
        />
      </div>

      <div className="account-cart-container">
        <div className="cart">
          <Link to="/cart">
            <i className="fas fa-shopping-cart"></i>
            {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
          </Link>
        </div>
        <div className="account">
          {user ? (
            <div
              className="account-dropdown"
              onMouseEnter={() => setShowAccountMenu(true)}
              onMouseLeave={() => setShowAccountMenu(false)}
            >
              <span className="account-name">{user.username || 'Người dùng'}</span>
              {showAccountMenu && (
                <div className="account-menu">
                  <Link to="/user-profile" className="account-menu-item">
                    Thông tin cá nhân
                  </Link>
                  <button className="account-menu-item logout-btn" onClick={handleLogout}>
                    Đăng xuất
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/account">Tài khoản</Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
