import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'; // Lấy id_cata từ URL
import { firestore } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import ProductCard from '../components/ProductCard';
import Slider from 'react-slick'; // Thư viện slider
import './Home.css';

const Home = ({ searchQuery }) => {
  const [products, setProducts] = useState([]);
  const [banners, setBanners] = useState([]); // Dữ liệu banner
  const { id_cata } = useParams(); // Lấy id_cata từ URL

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const querySnapshot = await getDocs(collection(firestore, 'products'));
        const productList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        const filteredByCategory = id_cata
          ? productList.filter((product) => product.id_cata === id_cata)
          : productList;

        setProducts(filteredByCategory);
      } catch (error) {
        console.error('Lỗi khi lấy sản phẩm: ', error);
      }
    };

    const fetchBanners = async () => {
      try {
        const querySnapshot = await getDocs(collection(firestore, 'banners')); // Lấy banner từ Firestore
        const bannerList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setBanners(bannerList);
      } catch (error) {
        console.error('Lỗi khi lấy banner: ', error);
      }
    };

    fetchProducts();
    fetchBanners();
  }, [id_cata]);

  const filteredProducts = products.filter((product) =>
    product.name?.toLowerCase().includes(searchQuery?.toLowerCase() || '')
  );

  // Cấu hình cho react-slick (slider)
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  return (
    <div className="home">
      <h1>Danh sách sản phẩm</h1>

      {/* Hiển thị Banner */}
      <div className="banner-container">
        <Slider {...settings}>
          {banners.map((banner) => (
            <div key={banner.id}>
              <img src={banner.imageUrl} alt={banner.title} className="banner-image" />
            </div>
          ))}
        </Slider>
      </div>

      <div className="product-list">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))
        ) : (
          <p>Không có sản phẩm nào phù hợp.</p>
        )}
      </div>
    </div>
  );
};

export default Home;
