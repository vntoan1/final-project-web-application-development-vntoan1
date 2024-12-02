import React, { useState, useEffect } from 'react';
import { firestore } from '../firebase'; 
import { collection, getDocs, addDoc, updateDoc, doc, deleteDoc } from 'firebase/firestore';

const CategoriesView = () => {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState({
    id_cata: '',
    name: '',
    description: '',
  });
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      const querySnapshot = await getDocs(collection(firestore, 'categories'));
      const categoryList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCategories(categoryList);
    };
    fetchCategories();
  }, []);

  const handleAddCategory = async () => {
    try {
      const docRef = await addDoc(collection(firestore, 'categories'), newCategory);
      setCategories([...categories, { id: docRef.id, ...newCategory }]);
      setShowForm(false);
    } catch (error) {
      console.error('Error adding category: ', error);
    }
  };

  const handleCancelAdd = () => {
    setShowForm(false);
    setNewCategory({
      id_cata: '',
      name: '',
      description: '',
    });
  };

  const handleDeleteCategory = async (id_cata) => {
    try {
      const docRef = doc(firestore, 'categories', id_cata);
      await deleteDoc(docRef);
      setCategories(categories.filter((category) => category.id !== id_cata));
    } catch (error) {
      console.error('Error deleting category: ', error);
    }
  };

  const handleUpdateCategory = async (id_cata, updatedCategory) => {
    try {
      const docRef = doc(firestore, 'categories', id_cata);
      await updateDoc(docRef, updatedCategory);
      setCategories(
        categories.map((category) =>
          category.id === id_cata ? { ...category, ...updatedCategory } : category
        )
      );
    } catch (error) {
      console.error('Error updating category: ', error);
    }
  };

  return (
    <div>
      <button onClick={() => setShowForm(true)}>Thêm mới</button>

      {showForm && (
        <div className="add-new-form">
          <h3>Thêm danh mục</h3>
          <input
            type="text"
            placeholder="ID danh mục"
            value={newCategory.id_cata}
            onChange={(e) => setNewCategory({ ...newCategory, id_cata: e.target.value })}
          />
          <input
            type="text"
            placeholder="Tên danh mục"
            value={newCategory.name}
            onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
          />
          <input
            type="text"
            placeholder="Mô tả"
            value={newCategory.description}
            onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
            className="category-description"
          />
          <button onClick={handleAddCategory}>Lưu</button>
          <button onClick={handleCancelAdd}>Hủy</button>
        </div>
      )}

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Tên danh mục</th>
            <th>Mô tả</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((category) => (
            <tr key={category.id}>
              <td>{category.id_cata}</td>
              <td>{category.name}</td>
              <td className="description-cell">
                {category.description.length > 30 ? `${category.description.slice(0, 30)}...` : category.description}
              </td>
              <td>
                <button onClick={() => handleUpdateCategory(category.id, { name: 'Updated Name' })}>Sửa</button>
                <button onClick={() => handleDeleteCategory(category.id)}>Xóa</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CategoriesView;
