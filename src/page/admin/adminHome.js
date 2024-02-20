import React, { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import {
    UserOutlined, BarsOutlined, LaptopOutlined, ShoppingOutlined,
    DashboardOutlined
} from '@ant-design/icons';
import { Menu, Space } from 'antd';
import ProductManagement from './productManagement';
import OrderManagement from './orderManagement/orderManagement';
import Cookies from 'js-cookie';
import jwtDecode from 'jwt-decode';
import { v4 as uuidv4 } from 'uuid';


const AdminHome = () => {
    const [current, setCurrent] = useState('db');
    const [isAdmin, setIsAdmin] = useState(false)

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

    function AccessDeniedMessage() {
        return <div className='mt-4 font-bold'>Bạn không đủ quyền truy cập vào đường dẫn này!</div>;
    }

    const handleMenu = (e) => {
        // console.log(e)
        setCurrent(e.key);
    }
    return (
        <>{isAdmin ? <div className='flex'>
            <Space className='items-start' >
                <Menu

                    mode='inline'
                    defaultSelectedKeys={[current]}
                    onClick={(e) => { handleMenu(e) }}
                    selectedKeys={[current]}
                    items={[
                        {
                            label:
                                <div to={'/management'}>Dashboards</div>,
                            key: "db",
                            icon: <DashboardOutlined></DashboardOutlined>
                        },
                        {
                            label:
                                <div to={'/management/user'}>User Management</div>,
                            key: "um",
                            icon: <UserOutlined></UserOutlined>
                        },
                        {
                            label:
                                <div to={'/management/category'}>Category Management</div>,
                            key: "cm",
                            icon: <BarsOutlined></BarsOutlined>
                        },
                        {
                            label:
                                <div to={'/management/product'}>Product Management</div>,
                            key: "pm",
                            icon: <LaptopOutlined></LaptopOutlined>
                        },
                        {
                            label:
                                <div to={'/management/order'}>Order Management</div>,
                            key: "om",
                            icon: <ShoppingOutlined></ShoppingOutlined>
                        }
                    ]}>

                </Menu>

            </Space>
            {current === 'pm' && <ProductManagement />}
            {current === 'om' && <OrderManagement />}
        </div>
            : <AccessDeniedMessage />
        }
        </>
    );
};
export default AdminHome;