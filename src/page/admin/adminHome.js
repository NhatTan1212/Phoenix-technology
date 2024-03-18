import React, { useState, useEffect, useContext } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import {
    UserOutlined, BarsOutlined, LaptopOutlined, ShoppingOutlined,
    DashboardOutlined, BoldOutlined
} from '@ant-design/icons';
import { Menu, Space } from 'antd';
import ProductManagement from './productManagement/productManagement';
import OrderManagement from './orderManagement/orderManagement';
import Cookies from 'js-cookie';
import jwtDecode from 'jwt-decode';
import { v4 as uuidv4 } from 'uuid';
import UserManagement from './userManagement/userManagement';
import CategoryManagement from './categoryManagement/categoryManagement';
import Dashboard from './Dashboard/dashBoard';
import BrandManagement from './brandManagement/brandManagement';
import DescriptionManagement from './productManagement/descriptionProductManagement';
import Context from '../../store/Context';
import io from 'socket.io-client';


const AdminHome = () => {
    const context = useContext(Context)
    const currentPageAdminHome = context.currentPageAdminHome
    const setCurrentPageAdminHome = context.setCurrentPageAdminHome
    const [isAdmin, setIsAdmin] = useState(false)

    function getItem(label, key, icon, children, type) {
        return {
            key,
            icon,
            children,
            label,
            type,
        };
    }

    useEffect(() => {
        let token = Cookies.get('token')
        // console.log(token)
        if (token) {
            const decodedToken = jwtDecode(token);
            if (decodedToken.role == 'admin') {
                setIsAdmin(true)
                // console.log('hi');
            } else {
                setIsAdmin(false)
            }
        } else {
            setIsAdmin(false)
        }
    }, [isAdmin])

    useEffect(() => {
        // Thiết lập kết nối WebSocket
        const socket = io('http://localhost:8000/');

        // Lắng nghe sự kiện khi có thông báo từ máy chủ
        socket.on('newOrder', (data) => {
            // Xử lý thông báo, ví dụ: hiển thị lên đầu trang
            console.log('New order received:', data);
            context.Message("info", "Có một đơn hàng mới vừa được tạo.")
        });

        // Ngắt kết nối khi component unmount
        return () => socket.disconnect();
    }, []);

    function AccessDeniedMessage() {
        return <div className='mt-4 font-bold'>Bạn không đủ quyền truy cập vào đường dẫn này!</div>;
    }

    const handleMenu = (e) => {
        console.log(e)
        setCurrentPageAdminHome(e.key);
    }
    return (
        <>{isAdmin ? <div className='flex'>
            <Space className='items-start bg-white max-[992px]:hidden' >
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

            </Space>
            {currentPageAdminHome === 'db' && <Dashboard />}
            {currentPageAdminHome === 'um' && <UserManagement />}
            {currentPageAdminHome === 'cm' && <CategoryManagement />}
            {currentPageAdminHome === 'bm' && <BrandManagement />}
            {currentPageAdminHome === 'pm' && <ProductManagement />}
            {currentPageAdminHome === 'om' && <OrderManagement />}
        </div>
            : <AccessDeniedMessage />
        }
        </>
    );
};
export default AdminHome;