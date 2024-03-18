import React, { useState, useEffect, useContext } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import Context from '../../store/Context';
function Footer() {
    const context = useContext(Context)
    const isHiddenAutoCpl = context.isHiddenAutoCpl

    const location = useLocation();
    const isAdminHomePage = location.pathname === '/management'
        || location.pathname.startsWith('/management/');

    return (
        <div className={`${isAdminHomePage ? 'hidden' : 'block'}`}>
            <div className={`m-auto w-10/12 pt-[15px] pb-[20px] ${!isHiddenAutoCpl ? '' : 'flex'}`}>
                <div className={`${!isHiddenAutoCpl ? 'w-full' : 'w-[25%]'}`}>
                    <h3 className='text-[18px] font-bold my-[15px]'>Thông tin chung</h3>
                    <ul>
                        <li>Giới thiệu về Phoniex</li>
                        <li>Tin tuyển dụng</li>
                        <li>Tin tức</li>
                        <li>Tin khuyến mãi</li>
                        <li>Liên hệ, góp ý</li>
                        <li>Khách hàng doanh nghiệp</li>
                    </ul>
                </div>
                <div className={`${!isHiddenAutoCpl ? 'w-full' : 'w-[25%]'}`}>
                    <h3 className='text-[18px] font-bold my-[15px]'>Hỗ trợ khách hàng</h3>
                    <ul>
                        <li>Tìm hiểu về mua trả góp</li>
                        <li>Chính sách vận chuyển, giao hàng</li>
                        <li>Chính sách, quy định chung</li>
                        <li>Chính sách bảo hành</li>
                        <li>Chính sách đổi hàng</li>
                        <li>Bảo mật thông tin khách hàng</li>
                    </ul>
                </div>
                <div className={`${!isHiddenAutoCpl ? 'w-full' : 'w-[25%]'}`}>
                    <h3 className='text-[18px] font-bold my-[15px]'>
                        <b className='text-[#ed1d24]'>Phoenix</b> Đà Nẵng
                    </h3>
                    <ul>
                        <li>
                            <strong>Thời gian làm việc: </strong>
                            07h30 - 20h30
                        </li>
                        <li>
                            <strong>Showroom: </strong>
                            362 Hoàng Diệu, Quận Hải Châu, Đà Nẵng
                        </li>
                        <li><strong>Tel: </strong> 0359 973 209</li>
                        <li><strong>Email: </strong> websitebanlaptop1212@gmail.com</li>
                    </ul>
                </div>
                <div className={`${!isHiddenAutoCpl ? 'w-full' : 'w-[25%]'}`}>
                    <h3 className='text-[18px] font-bold my-[15px]'>Chăm sóc khách hàng</h3>
                    <ul>

                        <li>
                            <strong>Trung tâm Bảo Hành và Sửa chữa: </strong>
                            Tầng 4 - 362 Hoàng Diệu,
                            Đà Nẵng (Giờ LV: 7:30 - 11:30 và 13:30 - 17:30 )
                        </li>
                        <li>
                            <strong>Tel: </strong> 0359 973 209 ( 7:30 - 17:30 )
                        </li>
                        <li>
                            <strong>Gọi sửa chữa: </strong> 0359 973 209 ( 7:30 - 11:30 và 13:30 - 17:30 )
                        </li>
                        <li>
                            <strong>Gọi kỹ thuật: </strong> 0359 973 209 ( 7:30 - 11:30 và 13:30 - 17:30 )
                        </li>
                        <li>
                            <strong>Quản lý chất lượng dịch vụ: </strong> ( 7:30 - 11:30 và 13:30 - 17:30 )
                        </li>
                        <li>
                            <strong>Email: </strong> websitebanlaptop1212@gmail.com
                        </li>
                    </ul>

                </div>
            </div>
        </div>

    );
}
export default Footer;