import React, { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Carousel, Card } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCartFlatbed, faUser, faBars } from '@fortawesome/free-solid-svg-icons';
import Cookies from 'js-cookie'; // Import thư viện js-cookie
import axios from 'axios';
import Instance from '../../axiosInstance';

const gridStyle = {
    width: '20%',
    textAlign: 'center',
};

function Home() {

    const [products, setProducts] = useState([])
    const [laptopGaming, setLaptopGaming] = useState([])
    const [hotSaleProducts, setHotSaleProducts] = useState([]);
    const [brands, setBrands] = useState([]);

    useEffect(() => {
        // Hàm này chạy khi component được mount
        getProducts();
        getLaptopGaming();
        getBrands();
    }, []);

    const getProducts = async () => {
        await Instance.get('/home')
            .then((res) => {
                setProducts(res.data)
                sortHotSaleProducts(res.data);
            })
            .catch((err) => {
                console.log(err)
            })
    }
    const getLaptopGaming = () => {
        Instance.get('/laptop-gaming')
            .then((res) => {
                setLaptopGaming(res.data)
            })
            .catch((err) => {
                console.log(err)
            })
    }

    const getBrands = () => {
        Instance.get('/brands-list')
            .then(response => {
                // console.log(response.data);
                setBrands(response.data);
            })
            .catch(error => {
                // Handle errors here
                console.error('Error fetching data:', error);
            });
    }

    const sortHotSaleProducts = (data) => {
        const sortedProducts = [...data].sort((a, b) => b.prod_percent - a.prod_percent);
        setHotSaleProducts(sortedProducts.slice(0, 5));
    };

    const formatPriceWithCommas = (price) => {
        return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    };

    const renderListProduct = (product) => {
        const brand = brands.find(brand => brand.brand_id === product.brand_id);
        // console.log(brand)
        return (

            <Card.Grid style={gridStyle} key={product.id}
                className='relative'>
                <div className='absolute top-[15px] right-[15px] 
                z-[2]'>
                    <span
                        className='flex items-center justify-center
                        text-[#ed1c24] text-[14px] font-bold 
                        w-[40px] h-[40px] border-[1px] border-solid 
                        border-[#ed1c24]
                        rounded-[50%]'>
                        -{product.prod_percent}%
                    </span>
                </div>
                <div className='flex overflow-hidden items-center h-[60%]'>
                    <Link to={`/product-detail/${product.id}`}
                        className=''>
                        <img src={product.avatar} alt=''
                            className=''></img>

                    </Link>

                </div>
                <div className='flex justify-start text-start 
            items-start h-[40%] flex-col '>
                    {brand && <img src={brand.image} alt="Brand Logo"
                        className="brand-logo max-w-[80px]" />}
                    <Link className=' text-[16px] line-clamp-2 font-bold 
                    overflow-hidden mt-[25px]'>
                        {product.prod_description}
                    </Link>
                    <span className='text-[#1d1d1d] text-[16px] 
                line-through'>
                        {formatPriceWithCommas(product.cost)} đ
                    </span>
                    <span className='text-[#c8191f] text-[21px] 
                font-bold'>
                        {formatPriceWithCommas(product.price)} đ
                    </span>
                </div>

            </Card.Grid>
        )
    }

    return (
        <div className='bg-[#f0f0f0]'>
            <div className='banner w-full'>
                <Carousel
                    autoplay
                    pauseOnDotsHover
                    pauseOnHover
                    draggable
                >
                    <div>
                        <img src='http://localhost:8000/upload/banner2.png'></img>
                    </div>
                    <div>
                        <img src='http://localhost:8000/upload/banner1.jpg'></img>
                    </div>
                    <div>
                        <img src='http://localhost:8000/upload/banner3.png'></img>
                    </div>
                </Carousel>
            </div>
            <div className='pb-[30px]'>
                <div className='w-10/12 m-auto'>
                    <div className='flex justify-between items-center
                    border-b-[2px] border-[#c8191f]  mt-[30px]'>
                        <h2 className='px-[10px] py-[10px] bg-[#c8191f] text-white
                    inline-block font-bold text-[20px] rounded-t-[10px]'
                        >SẢN PHẨM KHUYẾN MÃI HOT NHẤT</h2>
                        <Link
                            to={'/laptop/allproduct'}
                            className='font-bold text-[#c8191f]'>{"xem tất cả >>"}</Link>
                    </div>
                    <Card className=' w-[100%] h-auto'>
                        {hotSaleProducts.map(renderListProduct)}
                    </Card>

                    <div className='flex justify-between items-center
                    border-b-[2px] border-[#c8191f]  mt-[30px]'>
                        <h2 className='px-[10px] py-[10px] bg-[#c8191f] text-white
                    inline-block font-bold text-[20px] rounded-t-[10px]'
                        >Laptop Gaming</h2>
                        <Link
                            to={'/laptop/category=laptop-gaming'}
                            className='font-bold text-[#c8191f]'>{"xem tất cả >>"}</Link>
                    </div>
                    <Card className=' w-[100%] h-auto'>
                        {laptopGaming.slice(0, 5).map(renderListProduct)}
                    </Card>

                    <div className='mt-[30px]'>
                        <img src='http://localhost:8000/upload/sub-banner.png'></img>
                    </div>
                </div>

            </div>
        </div>
    );
}
export default Home;