import React, { useState, useEffect, useContext } from 'react';
import Context from '../../store/Context';
import '../header/header.scss';
import { Link, NavLink, useLocation, useParams } from 'react-router-dom';
import logo from '../../images/logo-phoenix.png'
import { AutoComplete, Input } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCartFlatbed, faUser, faBars, faAngleRight } from '@fortawesome/free-solid-svg-icons';
import Cookies from 'js-cookie'; // Import thư viện js-cookie
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import Instance from '../../axiosInstance';


const { Search } = Input;
function Header() {
    const { param } = useParams(); // Lấy tham số từ URL

    const context = useContext(Context)
    const isCartChange = context.isCartChange
    const setIsCartChange = context.setIsCartChange
    const isShowFloatLayer = context.isShowFloatLayer
    const setIsShowFloatLayer = context.setIsShowFloatLayer
    const [isLogin, setIsLogin] = useState(false);
    const [products, setProducts] = useState([])
    const [cart, setCart] = useState([]);
    const [brands, setBrands] = useState([]);
    const [categories, setCategories] = useState([]);
    const [cartUpdated, setCartUpdated] = useState(false);
    const tokenCookieName = 'token';
    const userName = localStorage.getItem('user_name');
    const role = localStorage.getItem('role');

    const location = useLocation();
    const isHomePage = location.pathname === '/';
    const isAdminHomePage = location.pathname === '/management'
        || location.pathname.startsWith('/management/');
    // console.log(isHomePage)
    const renderOption = (item) => (
        <Link to={`/product-detail/${item.id}`} className='flex'>
            <img
                src={item.avatar}
                alt={item.prod_name}
                style={{
                    marginRight: 8,
                    verticalAlign: "middle",
                    width: 60,
                    height: 'auto',
                }}
            />
            <p className='' style={{ textWrap: 'wrap' }}>{item.prod_description}</p>
        </Link>
    );


    useEffect(() => {
        // getBankAccountNumber()
        checkLoginStatus();
        getProducts();
        getBrands();
        getCategories();
        if (isCartChange) {
            setIsCartChange(false); // Đặt lại trạng thái giỏ hàng đã được cập nhật
        }
        getCart();
    }, [userName, cart, cartUpdated, isCartChange]);

    const checkLoginStatus = () => {
        const token = Cookies.get(tokenCookieName);
        if (token) {
            setIsLogin(true);
        } else {
            setIsLogin(false);
        }
    };
    const handleLogout = () => {
        Cookies.remove(tokenCookieName);
        localStorage.removeItem('user_name');
        localStorage.removeItem('role');
        // Sau khi xóa cookie, cập nhật lại trạng thái đăng nhập
        setIsLogin(false);
        const guestId = uuidv4();
        Cookies.set('tokenGID', guestId, { expires: 31 })
    };

    const getProducts = () => {
        Instance.get('/home')
            .then((res) => {
                setProducts(res.data)
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
    const getCategories = () => {
        Instance.get('/categories-list')
            .then(response => {
                // console.log(response.data);
                setCategories(response.data);
            })
            .catch(error => {
                // Handle errors here
                console.error('Error fetching data:', error);
            });
    }

    const getCart = () => {
        const token = Cookies.get('token');
        const tokenGID = Cookies.get('tokenGID');
        // console.log(token, tokenGID);

        if (token !== undefined) {
            Instance.post('/cart', { token }, {
                headers: {
                    "Content-Type": "application/json",
                }
            })
                .then(response => {
                    // console.log(response);
                    setCart(response.data.length)
                })
                .catch(error => {
                    // Xử lý lỗi ở đây
                    console.error('Error fetching data:', error);
                });
        } else if (tokenGID !== undefined) {
            Instance.post('/cart', { tokenGID }, {
                headers: {
                    "Content-Type": "application/json",
                }
            })
                .then(response => {
                    // console.log(response);
                    setCart(response.data.length)
                })
                .catch(error => {
                    // Xử lý lỗi ở đây
                    console.error('Error fetching data:', error);
                });
        }
    }

    // const getBankAccountNumber = () => {
    //     var data = JSON.stringify({
    //         "bin": "970415",
    //         "accountNumber": "0356939428"
    //     });

    //     var config = {
    //         method: 'post',
    //         url: 'https://api.vietqr.io/v2/lookup',
    //         headers: {
    //             'x-client-id': 'b7e699e8-7e5c-4a60-97f5-65d5d6d0daed',
    //             'x-api-key': '7b4ed5dc-570c-4f6b-9125-07499d21f66a',
    //             'Content-Type': 'application/json',
    //         },
    //         data: data
    //     };

    //     axios(config)
    //         .then(function (response) {
    //             console.log(JSON.stringify(response.data));
    //         })
    //         .catch(function (error) {
    //             console.log(error);
    //         });
    // }


    // console.log(token)
    return (
        <div
            onClick={(e) => {
                if (isShowFloatLayer) {
                    setIsShowFloatLayer(false);
                }
            }}
            className='header'
        >
            {console.log("isCartChange", isCartChange)}
            <div className={`topnav ${isAdminHomePage ? 'w-full' : 'w-10/12'}`}>
                <div className='topnav-left'>

                    <NavLink to='/'><img src={logo}></img></NavLink>
                    {/* <Search
                        allowClear
                        className='search'
                        placeholder='Nhập tên sản phẩm, từ khóa cần tìm kiếm,...'
                        onSearch={(e) => { console.log('hi') }}
                        onPressEnter={(e) => { console.log('hi') }}
                    // onClick={onSearch}
                    /> */}
                    <AutoComplete
                        className='flex text-center'
                        popupClassName="certain-category-search-dropdown"
                        popupMatchSelectWidth={500}
                        style={{
                            width: '100%'
                        }}
                        options={products.map((product) => ({
                            ...product,
                            label: renderOption(product),
                            value: product.prod_name,
                        }))}
                        filterOption={true}
                        size="large"
                        onSelect={(value, option) => { }}
                    >
                        <Input.Search
                            className='text-white'
                            size="large"
                            placeholder='Nhập tên sản phẩm, từ khóa cần tìm kiếm,...'
                        />
                    </AutoComplete>
                </div>
                {/* <NavLink to='/' activeClassName='active'>Home</NavLink>
                <NavLink to='/products/management' activeClassName='active'>Products</NavLink>
                <NavLink to='/users/management' activeClassName='active'>Users</NavLink>
                <NavLink to='/contact' activeClassName='active'>Contact</NavLink> */}
                <div className='topnav-right'>
                    <Link to={"/cart"} className='wrap-link'>
                        <span className='icon icon-cart relative'>
                            <FontAwesomeIcon icon={faCartFlatbed}></FontAwesomeIcon>
                            <span className={`${cart > 0 ? 'block ' : 'hidden '}absolute text-white z-10 text-center bg-red-500 
                            ${cart > 10
                                    ? 'rounded-[8px] w-[27px] h-[21px] right-[-13px] top-[-11px] text-[16px] flex flex-col'
                                    : 'rounded-[50%] w-[22px] h-[22px] right-[-11px] top-[-11px] text-[16px]'}`}>
                                {cart}
                            </span>
                        </span>
                        <span className='text pl-[5px]'>Giỏ hàng</span>
                    </Link>
                    <>
                        {isLogin ?
                            <div className=' text-white flex items-center text-[17px] relative'>
                                <div
                                    className='wrap-link py-[24px] px-[16px]'
                                    onClick={(e) => {
                                        setIsShowFloatLayer(!isShowFloatLayer)
                                    }}>
                                    <span className='icon icon-user'>
                                        <FontAwesomeIcon icon={faUser}></FontAwesomeIcon>
                                    </span>
                                    <span className='text pl-[5px]'>  {userName}</span>
                                    <div className={isShowFloatLayer ? ' absolute left-[16px] top-[75px] z-10 bg-white shadow-[0px_0px_10px_0px_rgba(0,0,0,0.5)] w-[auto] rounded-[10px]' : 'hidden'}>
                                        <ul className=''>
                                            <li className='flex '>
                                                <Link className='text-black hover:bg-gray-200 hover:rounded-[10px] py-[15px]'>
                                                    Quản lý thông tin cá nhân
                                                    <FontAwesomeIcon icon={faAngleRight} className='pl-5' />
                                                </Link>
                                            </li>
                                            <li>
                                                <Link to={'/order'} className='text-black hover:bg-gray-200 hover:rounded-[10px] py-[15px]'>
                                                    Quản lý đơn hàng
                                                    <FontAwesomeIcon icon={faAngleRight} className='pl-5' />
                                                </Link>
                                            </li>
                                        </ul>
                                    </div>
                                </div>

                                <Link to='/auth'
                                    onClick={(e) => { handleLogout(e) }}
                                    className='auth mt-1'>Đăng xuất</Link>
                            </div> :
                            <>
                                <Link to='/auth' className='auth'>Đăng nhập</Link>
                            </>

                        }
                    </>
                </div>
            </div>
            <div className={`menu-header ${isAdminHomePage ? 'hidden' : 'block'}`}>
                <ul className='menu flex items-center w-10/12' >
                    <li className='group categories flex items-center font-medium 
                     text-white h-auto relative'>
                        <FontAwesomeIcon icon={faBars} className='icon p-3 mt-auto mb-auto'></FontAwesomeIcon>
                        <span className=''>
                            DANH MỤC SẢN PHẨM
                        </span>
                        <ul className={` dropdown group-hover:block ${isHomePage ? 'block'
                            : 'hidden'} absolute 
                        bg-white top-[40px] z-10 w-[263px] overflow-hidden
                        h-[406.58px] `}>
                            {categories.map((category) => (
                                <li key={category.category_id} className=' pt-[8px] 
                                pl-[12px]'>
                                    <Link to={`laptop/category=${category.slug}`} className='text-black'>
                                        {category.name}
                                    </Link>
                                </li>
                            ))}
                            {brands.map((brand) => (
                                <li key={brand.brand_id} className=' pt-[10px] 
                                pl-[12px] last:pb-[10px]'>
                                    <Link to={`laptop/brand=${brand.slug}`} className='text-black'>
                                        Laptop {brand.name}

                                    </Link>
                                </li>
                            ))}
                        </ul>

                    </li>
                    {brands.map((brand) => (
                        <li key={brand.brand_id} className='brands pl-5'>
                            <Link to={`laptop/brand=${brand.slug}`} className=''>
                                <img src={brand.image}></img>

                            </Link>
                        </li>
                    ))}
                </ul>

            </div>
        </div >
    );
}

export default Header