import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { firestore } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import ProductCard from '../components/ProductCard';
import Slider from 'react-slick';
import './Home.css';

const Home = ({ searchQuery }) => {
  const [products, setProducts] = useState([]);
  const [banners, setBanners] = useState([]);
  const { id_cata } = useParams();

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
        const querySnapshot = await getDocs(collection(firestore, 'banners'));
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

  // Cấu hình slider
  const settings = {
    dots: true,
    infinite: true,
    speed: 1000,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: true,
    pauseOnHover: true,
  };

  return (
    <div className="home">

      {/* Hiển thị Banner */}
      <div className="banner-container">
        <Slider {...settings}>
          {banners.map((banner) => (
            <div key={banner.id} className="banner-slide">
              <img src={banner.image} alt={banner.description} className="banner-image" />
              <p className="banner-description">{banner.description}</p>
            </div>
          ))}
        </Slider>
      </div>
      
      <h1>Danh sách sản phẩm</h1>

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
