import React, { useState, useEffect } from 'react';
import { collection, addDoc, updateDoc, deleteDoc, onSnapshot, doc } from 'firebase/firestore';
import { firestore } from '../firebase';
import './BannersView.css';

const BannersView = () => {
  const [banners, setBanners] = useState([]);
  const [form, setForm] = useState({ id: '', image: '', description: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [isFormVisible, setIsFormVisible] = useState(false); // Quản lý hiển thị form
  const [error, setError] = useState(null);

  const bannersCollection = collection(firestore, 'banners');

  useEffect(() => {
    const unsubscribe = onSnapshot(bannersCollection, (snapshot) => {
      const fetchedBanners = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setBanners(fetchedBanners);
    });

    return unsubscribe;
  }, [bannersCollection]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      if (isEditing) {
        const bannerDoc = doc(firestore, 'banners', form.id);
        await updateDoc(bannerDoc, {
          image: form.image,
          description: form.description,
        });
      } else {
        await addDoc(bannersCollection, {
          image: form.image,
          description: form.description,
        });
      }
      resetForm();
    } catch (err) {
      console.error('Error updating/adding banner:', err);
      setError('Lỗi khi cập nhật hoặc thêm banner. Vui lòng thử lại!');
    }
  };

  const handleDelete = async (id) => {
    setError(null);
    try {
      const bannerDoc = doc(firestore, 'banners', id);
      await deleteDoc(bannerDoc);
    } catch (err) {
      console.error('Error deleting banner:', err);
      setError('Lỗi khi xóa banner. Vui lòng thử lại!');
    }
  };

  const handleEdit = (banner) => {
    setForm(banner);
    setIsEditing(true);
    setIsFormVisible(true); // Hiển thị form khi chỉnh sửa
  };

  const resetForm = () => {
    setForm({ id: '', image: '', description: '' });
    setIsEditing(false);
    setIsFormVisible(false); // Ẩn form khi hoàn thành
    setError(null);
  };

  return (
    <div className="banners-view">
      <h2>Quản lý Banner</h2>
      <div className="main-container">
        {/* Nút hiển thị form thêm mới */}
        {!isFormVisible && (
          <button
            className="btn-show-form"
            onClick={() => setIsFormVisible(true)}
          >
            Thêm mới
          </button>
        )}

        {/* Form thêm/sửa */}
        {isFormVisible && (
          <form className="banner-form" onSubmit={handleSubmit}>
            {error && <p className="error">{error}</p>}
            <div className="form-group">
              <label htmlFor="image">Image (URL):</label>
              <input
                type="text"
                id="image"
                name="image"
                value={form.image}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="description">Mô tả:</label>
              <input
                type="text"
                id="description"
                name="description"
                value={form.description}
                onChange={handleChange}
                required
              />
            </div>
            <button type="submit" className="btn-submit">
              {isEditing ? 'Cập nhật' : 'Thêm mới'}
            </button>
            <button type="button" className="btn-cancel" onClick={resetForm}>
              Hủy
            </button>
          </form>
        )}

        {/* Danh sách banners */}
        <div className="banner-list-container">
          {banners.length > 0 ? (
            <div className="banner-list">
              {banners.map((banner) => (
                <div key={banner.id} className="banner-item">
                  <img src={banner.image} alt="Banner" className="banner-image" />
                  <div className="banner-info">
                    <p>ID: {banner.id}</p>
                    <p>Mô tả: {banner.description}</p>
                  </div>
                  <div className="banner-actions">
                    <button
                      onClick={() => handleEdit(banner)}
                      className="btn-edit"
                    >
                      Sửa
                    </button>
                    <button
                      onClick={() => handleDelete(banner.id)}
                      className="btn-delete"
                    >
                      Xóa
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>Không có banner nào.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default BannersView;
