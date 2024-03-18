import { Table } from 'antd';
import { useContext } from 'react';
import Context from '../../store/Context';

const TableOrderDetail = ({ columns, dataSource, order }) => {
    const context = useContext(Context)
    const isHiddenAutoCpl = context.isHiddenAutoCpl
    const isScreenSmaller1280 = context.isScreenSmaller1280
    const isScreenSmaller430 = context.isScreenSmaller430
    return (
        <>
            {/* {console.log(order)} */}
            <Table
                className='flex-1 table-order-detail'
                columns={columns}
                dataSource={dataSource} />
            <div className='mb-3'>
                <div className='flex justify-between font-bold text-[20px]'>
                    <span className='pl-5'>Tổng tiền:</span>
                    <span className='text-[#e5101d] pr-[30px]'>
                        {order ? order.total ? order.total.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }) : '' : ''}
                    </span>

                </div>
                <div className='flex justify-between max-[650px]:flex-col'>
                    <span className='pl-5'>Hình thức thanh toán:</span>
                    <span className='text-[#000] pr-[30px] max-[650px]:pl-[20px]'>
                        {order ? order.total ? order.paymentMethods === 'COD' ? 'Thanh toán tiền mặt khi nhận hàng' : order.paymentMethods === 'VNPAY' ?
                            'Thanh toán qua ATM-Tài khoản ngân hàng nội địa (VNPAY)'
                            : 'Thanh toán qua chuyển khoản qua tài khoản ngân hàng' : '' : ''}
                    </span>
                </div>

            </div>
        </>
    )

}

export default TableOrderDetail
