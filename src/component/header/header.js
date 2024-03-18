import React, { useState, useEffect, useContext } from 'react';
import Context from '../../store/Context';
import '../header/header.scss';
import { Link, NavLink, useLocation, useParams, useHistory, useNavigate } from 'react-router-dom';
import logo from '../../images/logo1000.png'
import { AutoComplete, Input, Row, Col, Drawer, Space, Menu } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCartFlatbed, faUser, faBars, faAngleRight } from '@fortawesome/free-solid-svg-icons';
import Cookies from 'js-cookie'; // Import thư viện js-cookie
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import Instance from '../../axiosInstance';
import jwtDecode from 'jwt-decode';
import {
    UserOutlined, BarsOutlined, LaptopOutlined, ShoppingOutlined,
    DashboardOutlined, BoldOutlined
} from '@ant-design/icons';

const { Search } = Input;
function Header() {
    const navigate = useNavigate()
    const { param } = useParams(); // Lấy tham số từ URL
    const token = Cookies.get('token');
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
    const [isAdmin, setIsAdmin] = useState(false)
    const [userId, setUserId] = useState('')
    const location = useLocation();
    const isHomePage = location.pathname === '/';
    const isAdminHomePage = location.pathname === '/management'
        || location.pathname.startsWith('/management/');
    const [searchValue, setSearchValue] = useState('');
    //Bar responsive
    const [isBarOpen, setIsBarOpen] = useState(false);
    const toggleBar = () => {
        setIsBarOpen(true);
    };

    //Admin page responsive
    const currentPageAdminHome = context.currentPageAdminHome
    const setCurrentPageAdminHome = context.setCurrentPageAdminHome
    const handleMenu = (e) => {
        console.log(e)
        setCurrentPageAdminHome(e.key);
        setIsBarOpen(false)
        navigate('/management')
    }
    //Context responsive
    const isHiddenAutoCpl = context.isHiddenAutoCpl
    const setIsHiddenAutoCpl = context.setIsHiddenAutoCpl
    const isScreenSmaller1280 = context.isScreenSmaller1280
    const setIsScreenSmaller1280 = context.setIsScreenSmaller1280
    const isScreenSmaller430 = context.isScreenSmaller430
    const setIsScreenSmaller430 = context.setIsScreenSmaller430

    useEffect(() => {
        const handleResize = () => {
            setIsHiddenAutoCpl(window.innerWidth >= 992);
            setIsScreenSmaller1280(window.innerWidth <= 1280)
            setIsScreenSmaller430(window.innerWidth <= 430)
        };

        // Thiết lập sự kiện lắng nghe cho việc thay đổi kích thước của cửa sổ
        window.addEventListener('resize', handleResize);

        // Xóa sự kiện lắng nghe khi component bị unmount
        return () => window.removeEventListener('resize', handleResize);
    }, []); // Chỉ chạy một lần khi component được render


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
                }}
                className='h-auto max-[550px]:max-h-[44px]'
            />
            <p className='' style={{ textWrap: 'wrap' }}>{item.prod_description}</p>
        </Link>
    );

    useEffect(() => {
        if (token) {
            const decodedToken = jwtDecode(token);
            if (decodedToken.role == 'admin') {
                setIsAdmin(true)
                console.log('ĐÂY LÀ ADMIN');
            } else {
                console.log('ĐÂY LÀ USER');
                setIsAdmin(false)
            }
        } else {
            setIsAdmin(false)
        }
    }, [isAdmin, token])
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
            const decodedToken = jwtDecode(token);
            if (decodedToken && decodedToken.id) {
                setUserId(decodedToken.id);
            }
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

    const handleProfile = () => {
        setIsShowFloatLayer(false);
    }

    // const getBankAccountNumber = () => {
    //     var data = JSON.stringify({
    //         "bin": "",
    //         "accountNumber": ""
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
    const filterOptions = (inputValue, option) => {
        const lowerCaseInput = inputValue.toLowerCase();
        return (
            (option.prod_name && option.prod_name.toLowerCase().includes(lowerCaseInput)) ||
            (option.cpu && option.cpu.toLowerCase().includes(lowerCaseInput)) ||
            (option.ram && option.ram.toLowerCase().includes(lowerCaseInput)) ||
            (option.hard_drive && option.hard_drive.toLowerCase().includes(lowerCaseInput)) ||
            (option.graphics && option.graphics.toLowerCase().includes(lowerCaseInput)) ||
            (option.on_board && option.on_board.toLowerCase().includes(lowerCaseInput))
        );
    };



    const AutoCompleteCpn = ({ isHidden }) => {
        return (<AutoComplete
            className={`${isHidden ? 'hidden ' : ''}my-auto header-autocpl ${!isHiddenAutoCpl ? 'pb-2' : ''}
            `}
            popupClassName="certain-category-search-dropdown"
            popupMatchSelectWidth={300}
            style={{
                width: '100%'
            }}
            options={products.map((product) => ({
                ...product,
                label: renderOption(product),
                value: product.prod_name
            }))}
            filterOption={filterOptions}
            size="large"
            onSelect={(value, option) => { }}

        >
            <Input.Search
                className='text-white header-input-search'
                size="large"
                placeholder='Nhập tên sản phẩm, từ khóa cần tìm kiếm,...'
            />
        </AutoComplete>)
    }

    const ListCategoriesCpn = () => {
        return (
            <ul className={` 
            ${!isHiddenAutoCpl ? '' : 'w-[263px] h-[406.58px]'} dropdown group-hover:block ${(isHomePage || !isHiddenAutoCpl) ? 'block'
                    : 'hidden'} absolute 
                bg-white top-[40px] z-10  overflow-hidden
                `}>
                {isBarOpen &&
                    <li className=' pt-[8px] group/category
                pl-[12px] hover:bg-[#c8191f] '>
                        <Link
                            onClick={() => setIsBarOpen(false)} to={'/'}
                            className='text-black group-hover/category:text-white'
                        >Trang chủ</Link>
                    </li>
                }
                {categories.map((category) => (
                    <li key={category.category_id} className=' pt-[8px] group/category
            pl-[12px] hover:bg-[#c8191f] '>
                        <Link onClick={() => setIsBarOpen(false)} to={`laptop/category=${category.slug}&page=1`} className='text-black group-hover/category:text-white'>
                            {category.name}
                        </Link>
                    </li>
                ))}
                {brands.map((brand) => (
                    <li key={brand.brand_id} className=' pt-[10px] group/category
            pl-[12px] hover:text-white hover:bg-[#c8191f]  last:pb-[10px]'>
                        <Link onClick={() => setIsBarOpen(false)} to={`laptop/brand=${brand.slug}&page=1`} className='text-black group-hover/category:text-white'>
                            Laptop {brand.name}

                        </Link>
                    </li>
                ))}
            </ul>
        )
    }

    return (
        <div
            className='header'
        >
            <Drawer
                open={isBarOpen}
                onClose={() => setIsBarOpen(false)}
                closable={false}
                placement='right'
            >
                {isAdmin ?
                    <div className='flex'>
                        {/* <Space className='items-start bg-white flex-1' > */}
                        <Menu
                            mode='inline'
                            defaultSelectedKeys={[currentPageAdminHome]}
                            onClick={(e) => { handleMenu(e) }}
                            selectedKeys={[currentPageAdminHome]}
                            items={[
                                {
                                    label:
                                        <div>Dashboards</div>,
                                    key: "db",
                                    icon: <DashboardOutlined></DashboardOutlined>
                                },
                                {
                                    label:
                                        <div>User Management</div>,
                                    key: "um",
                                    icon: <UserOutlined></UserOutlined>
                                },
                                {
                                    label:
                                        <div>Category Management</div>,
                                    key: "cm",
                                    icon: <BarsOutlined></BarsOutlined>
                                },
                                {
                                    label:
                                        <div>Brand Management</div>,
                                    key: "bm",
                                    icon: <BoldOutlined></BoldOutlined>
                                },
                                // getItem('Product Management', 'pm', <LaptopOutlined />, [
                                //     getItem('Management', 'pmm'),
                                //     getItem('Desciption', 'pmd')
                                // ]),
                                {
                                    label:
                                        <div>Product Management</div>,
                                    key: "pm",
                                    icon: <LaptopOutlined></LaptopOutlined>
                                },
                                {
                                    label:
                                        <div>Order Management</div>,
                                    key: "om",
                                    icon: <ShoppingOutlined></ShoppingOutlined>
                                }
                            ]}>

                        </Menu>

                        {/* </Space> */}
                    </div>
                    :
                    <ListCategoriesCpn></ListCategoriesCpn>
                }
            </Drawer>
            <div className='header-wrap mx-auto '>
                <Row>
                    <Col
                        xs={{ span: 16, offset: 0 }} lg={{ span: 5, offset: 0 }} xl={{ span: 3, offset: 0 }}
                        className={` ${isHiddenAutoCpl ? '' : 'flex'} ${isScreenSmaller430 ? 'pl-4' : 'pl-6'}`}
                    >
                        <div className={`${(!isHiddenAutoCpl) ? 'block' : 'hidden'} my-auto pr-6 max-[430px]:pr-4`}>
                            <FontAwesomeIcon
                                className='text-white text-[25px]'
                                icon={faBars} onClick={toggleBar} />
                        </div>
                        <div className=''>
                            <NavLink
                                // className={'inline-block'}
                                to='/'
                            ><img
                                className={` max-w-[197px] mx-[30px] mt-[33px] mb-[25px] ${!isHiddenAutoCpl ? 'ml-0' : ''} max-[430px]:w-[180px]`}
                                src={logo}></img>
                            </NavLink>
                        </div>
                    </Col>
                    <Col
                        className='pl-2 flex header-search-autocp' id='header-search-autocp'
                        xs={{ span: 0, offset: 0 }} lg={{ span: 10, offset: 1 }} xl={{ span: 11, offset: 3 }}
                    >
                        <AutoCompleteCpn isHidden={false} />
                    </Col>
                    <Col xs={{ span: 8, offset: 0 }} lg={{ span: 8, offset: 0 }} xl={{ span: 7, offset: 0 }}
                        className='flex justify-end'
                    >
                        <div className='header-wrapnav-right flex h-full'>
                            <Link to={"/cart"} className={`my-auto flex p-6 group/cart ${isScreenSmaller1280 ? 'pr-0' : ''}
                            `}>
                                <span className='text-white relative'>
                                    <FontAwesomeIcon icon={faCartFlatbed}
                                        className=' text-[20px] py-3 px-[0.55rem] bg-white text-black
                                        rounded-[10px]'>
                                    </FontAwesomeIcon>
                                    <span className={`${cart > 0 ? 'block ' : 'hidden '}absolute text-white z-10 text-center bg-red-500 
                            ${cart > 10
                                            ? 'rounded-[8px] w-[27px] h-[21px] right-[-13px] top-[-11px] text-[16px] flex flex-col'
                                            : 'rounded-[50%] w-[22px] h-[22px] right-[-11px] top-[-11px] text-[16px]'}`}>
                                        {cart}
                                    </span>
                                </span>
                                {!isHiddenAutoCpl ? null :
                                    <span className='text-white pl-[5px] text-[17px] my-auto group-hover/cart:text-[red]'>Giỏ hàng</span>
                                }
                            </Link>
                            {
                                !isHiddenAutoCpl ?
                                    <>
                                        {isLogin ?
                                            <div
                                                id={`${!isHiddenAutoCpl ? '' : 'header-wrap-login'}`}
                                                className='header-wrap-login text-white flex items-center text-[17px] '>
                                                <div
                                                    className={`flex  group/username relative ${!isHiddenAutoCpl ? 'pl-4 pr-6' : ''}
                                                    ${isScreenSmaller430 ? 'pr-4' : ''}`}
                                                    onMouseEnter={() => {
                                                        setIsShowFloatLayer(true);
                                                    }}
                                                    onMouseLeave={() => {
                                                        setIsShowFloatLayer(false);
                                                    }}
                                                >
                                                    <span className=''>
                                                        <FontAwesomeIcon icon={faUser}
                                                            className='text-[20px] p-3 bg-white text-black
                                                                    rounded-[10px]'
                                                        ></FontAwesomeIcon>
                                                    </span>
                                                    {/* <span className='text pl-[5px] my-auto group-hover/username:text-[red]'>  {userName}</span> */}
                                                    <div
                                                        className={
                                                            `
                                                               
                                                             
                                                                ${isShowFloatLayer ? ' absolute right-6 top-[50px] z-10 bg-white shadow-[0px_0px_10px_0px_rgba(0,0,0,0.5)] min-w-[260px] rounded-[10px]' : 'hidden'}
                                                                `}>
                                                        <ul className=''>
                                                            {isAdmin &&
                                                                <li className='flex  '>
                                                                    <Link
                                                                        onClick={() => {
                                                                            setIsShowFloatLayer(false);
                                                                        }}
                                                                        to={'/management'}
                                                                        className=' text-black hover:bg-gray-200 hover:rounded-[10px] py-[15px] w-full px-4'>
                                                                        Vào trang Admin
                                                                        <FontAwesomeIcon icon={faAngleRight} className='pl-5' />
                                                                    </Link>
                                                                </li>
                                                            }
                                                            <li className='flex  '>
                                                                <Link
                                                                    to={`profile/${userId}`}
                                                                    onClick={() => {
                                                                        handleProfile();
                                                                    }}
                                                                    className='text-black hover:bg-gray-200 hover:rounded-[10px] py-[15px] w-full px-4'>
                                                                    Quản lý thông tin cá nhân
                                                                    <FontAwesomeIcon icon={faAngleRight} className='pl-5' />
                                                                </Link>
                                                            </li>
                                                            <li className='flex '>
                                                                <Link
                                                                    onClick={() => {
                                                                        setIsShowFloatLayer(false);
                                                                    }}
                                                                    to={'/order'}
                                                                    className='text-black hover:bg-gray-200 hover:rounded-[10px] py-[15px] w-full px-4'>
                                                                    Quản lý đơn hàng
                                                                    <FontAwesomeIcon icon={faAngleRight} className='pl-5' />
                                                                </Link>
                                                            </li>
                                                            <li className='flex '>
                                                                <Link to='/auth'
                                                                    onClick={(e) => { handleLogout(e) }}
                                                                    className='text-black hover:bg-gray-200 hover:rounded-[10px] py-[15px] w-full px-4'>Đăng xuất</Link>
                                                            </li>
                                                        </ul>
                                                    </div>
                                                </div>


                                            </div> :
                                            <>
                                                {/* <Link to='/auth' className='text-white'>Đăng nhập</Link> */}
                                            </>

                                        }
                                    </>

                                    : null
                            }
                            <>
                                {isLogin ?
                                    <div
                                        id='header-wrap-login'
                                        className='header-wrap-login text-white flex items-center text-[17px] relative'>
                                        <div
                                            className='flex pr-6 group/username'
                                            onMouseEnter={() => {
                                                setIsShowFloatLayer(true);
                                            }}
                                            onMouseLeave={() => {
                                                setIsShowFloatLayer(false);
                                            }}
                                        >
                                            <span className='pl-4'>
                                                <FontAwesomeIcon icon={faUser}
                                                    className='text-[20px] p-3 bg-white text-black
                                                rounded-[10px]'
                                                ></FontAwesomeIcon>
                                            </span>
                                            <span className='text pl-[5px] my-auto group-hover/username:text-[red]'>  {userName}</span>
                                            <div
                                                className={isShowFloatLayer ? ' absolute right-4 top-[85px] z-10 bg-white shadow-[0px_0px_10px_0px_rgba(0,0,0,0.5)] min-w-[260px] rounded-[10px]' : 'hidden'}>
                                                <ul className=''>
                                                    {isAdmin &&
                                                        <li className='flex  '>
                                                            <Link
                                                                onClick={() => {
                                                                    setIsShowFloatLayer(false);
                                                                }}
                                                                to={'/management'}
                                                                className=' text-black hover:bg-gray-200 hover:rounded-[10px] py-[15px] w-full px-4'>
                                                                Vào trang Admin
                                                                <FontAwesomeIcon icon={faAngleRight} className='pl-5' />
                                                            </Link>
                                                        </li>
                                                    }
                                                    <li className='flex  '>
                                                        <Link
                                                            to={`profile/${userId}`}
                                                            onClick={() => {
                                                                handleProfile();
                                                            }}
                                                            className='text-black hover:bg-gray-200 hover:rounded-[10px] py-[15px] w-full px-4'>
                                                            Quản lý thông tin cá nhân
                                                            <FontAwesomeIcon icon={faAngleRight} className='pl-5' />
                                                        </Link>
                                                    </li>
                                                    <li className='flex '>
                                                        <Link
                                                            onClick={() => {
                                                                setIsShowFloatLayer(false);
                                                            }}
                                                            to={'/order'}
                                                            className='text-black hover:bg-gray-200 hover:rounded-[10px] py-[15px] w-full px-4'>
                                                            Quản lý đơn hàng
                                                            <FontAwesomeIcon icon={faAngleRight} className='pl-5' />
                                                        </Link>
                                                    </li>
                                                    <li className='flex '>
                                                        <Link to='/auth'
                                                            onClick={(e) => { handleLogout(e) }}
                                                            className='text-black hover:bg-gray-200 hover:rounded-[10px] py-[15px] w-full px-4'>Đăng xuất</Link>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>

                                    </div> :
                                    <>
                                        <Link
                                            to={`/auth`}
                                            className='my-auto pl-4 pr-6 text-white group/linkauth'
                                        >
                                            <div className='flex'>
                                                <FontAwesomeIcon icon={faUser}
                                                    className='text-[20px] p-3 bg-white text-black
                                                rounded-[10px]'
                                                ></FontAwesomeIcon>
                                                {isHiddenAutoCpl ?
                                                    <span className='my-auto pl-[5px] text-[17px] group-hover/linkout:text-[red]'>
                                                        Đăng nhập
                                                    </span> : null
                                                }
                                            </div>


                                        </Link>
                                    </>

                                }
                            </>
                        </div>

                    </Col>
                </Row>
            </div>
            <div className='bg-white'>
                <div className={`menu-header mx-auto ${isAdminHomePage ? 'hidden' : 'block'} ${(!isHiddenAutoCpl && !isScreenSmaller430) ? 'px-6 bg-black' : ''}
                ${isScreenSmaller430 ? 'px-4 bg-black' : ''}`}>
                    <div
                        id='menu'
                        className='menu flex ml-[30px] mr-[30px]' >
                        <h3 className='group categories flex items-center font-medium 
                     text-white h-auto relative min-w-[263px]'>
                            <FontAwesomeIcon icon={faBars} className='icon p-3 mt-auto mb-auto'></FontAwesomeIcon>
                            <span className=''>
                                DANH MỤC SẢN PHẨM
                            </span>
                            <ul className={` dropdown group-hover:block ${isHomePage ? 'block'
                                : 'hidden'} absolute 
                        bg-white top-[40px] z-10 w-[263px] overflow-hidden
                        h-[406.58px] `}>
                                {categories.map((category) => (
                                    <li key={category.category_id} className=' pt-[8px] group/category
                                pl-[12px] hover:bg-[#c8191f] '>
                                        <Link to={`laptop/category=${category.slug}&page=1`} className='text-black group-hover/category:text-white'>
                                            {category.name}
                                        </Link>
                                    </li>
                                ))}
                                {brands.map((brand) => (
                                    <li key={brand.brand_id} className=' pt-[10px] group/category
                                pl-[12px] hover:text-white hover:bg-[#c8191f]  last:pb-[10px]'>
                                        <Link to={`laptop/brand=${brand.slug}&page=1`} className='text-black group-hover/category:text-white'>
                                            Laptop {brand.name}

                                        </Link>
                                    </li>
                                ))}
                            </ul>

                        </h3>
                        <ul className=' flex'>
                            {isScreenSmaller1280 ?
                                brands.slice(0, 9).map((brand) => (
                                    <li key={brand.brand_id} className='brands pl-5'>
                                        <Link to={`laptop/brand=${brand.slug}&page=1`} className=''>
                                            <img src={brand.image}></img>

                                        </Link>
                                    </li>
                                ))
                                :
                                brands.map((brand) => (
                                    <li key={brand.brand_id} className='brands pl-5'>
                                        <Link to={`laptop/brand=${brand.slug}&page=1`} className=''>
                                            <img src={brand.image}></img>

                                        </Link>
                                    </li>
                                ))
                            }
                        </ul>
                    </div>
                    {!isHiddenAutoCpl && <AutoCompleteCpn isHidden={false} />}
                </div>
            </div>
        </div >
    );
}

export default Header