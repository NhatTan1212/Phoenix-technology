import { useContext } from "react"
import Context from "../../store/Context"

const DeliveryAddressOrderDetail = ({ order }) => {
    const context = useContext(Context)
    const isHiddenAutoCpl = context.isHiddenAutoCpl
    const isScreenSmaller1280 = context.isScreenSmaller1280
    const isScreenSmaller430 = context.isScreenSmaller430
    return (
        <>
            <h3 className='text-[20px] p-4'>Địa chỉ nhận hàng</h3>
            <div className='flex justify-between p-4 pt-0 max-[730px]:justify-start max-[730px]:flex-col'>
                {order ?
                    <>
                        <ul>
                            <li>{order.name}</li>
                            <li>{order.phone}</li>
                            <li>{order.user_address}</li>
                        </ul>

                        <ul>
                            {order.user_address === 'Nhận hàng tại cửa hàng'
                                ? <li>
                                    <span>
                                        {new Date(order.created_at).toISOString().slice(11, 19)}
                                    </span>
                                    <span className='ml-2'>
                                        {new Date(order.created_at).toLocaleDateString()}
                                    </span>
                                    <span className='ml-3 active-status font-bold'>Đặt hàng thành công</span>
                                </li>
                                : null}
                            {order.is_success === 1 ? <li>
                                <span>
                                    {order.successful_at.slice(11, 19)}
                                </span>
                                <span className='ml-2'>
                                    {new Date(order.successful_at).toLocaleDateString()}
                                </span>
                                <span className='ml-3 active-status font-bold'>
                                    Đơn hàng đã hoàn tất
                                </span>
                            </li>
                                : null}
                            {order.is_transported === 1 ? <li>
                                <span>
                                    {order.transported_at.slice(11, 19)}
                                </span>
                                <span className='ml-2'>
                                    {new Date(order.transported_at).toLocaleDateString()}
                                </span>
                                <span className={'ml-3 font-bold' + (order.is_success ? null : ' active-status')}>
                                    Đơn hàng đã được giao đến nơi
                                </span>
                            </li>
                                : null}
                            {order.is_being_shipped === 1 ? <li>
                                <span>
                                    {order.being_shipped_at.slice(11, 19)}
                                </span>
                                <span className='ml-2'>
                                    {new Date(order.being_shipped_at).toLocaleDateString()}
                                </span>
                                <span className={'ml-3 font-bold' + (order.is_transported ? null : ' active-status')}>
                                    Đơn hàng đang được giao đến bạn
                                </span>
                            </li>
                                : null}
                            {order.is_approved === 1 ? <li>
                                <span>
                                    {order.approved_at.slice(11, 19)}
                                </span>
                                <span className='ml-2'>
                                    {new Date(order.approved_at).toLocaleDateString()}
                                </span>
                                <span className={'ml-3 font-bold' + (order.is_being_shipped ? null : ' active-status')}>
                                    Đơn hàng đã được xác nhận. (Đang chuẩn bị hàng)
                                </span>
                            </li>
                                : null
                            }
                            {order.is_payment === 1 ? <li>
                                <span>
                                    {order.paid_at.slice(11, 19)}
                                </span>
                                <span className='ml-2'>
                                    {new Date(order.paid_at).toLocaleDateString()}
                                </span>
                                <span className='ml-3 active-status font-bold'>Đơn hàng đã thanh toán</span>
                            </li>
                                : null
                            }
                            {order ? order.created_at ? order.user_address === 'Nhận hàng tại cửa hàng'
                                ? null :
                                <li>
                                    <span>
                                        {order.created_at.slice(11, 19)}
                                    </span>
                                    <span className='ml-2'>
                                        {new Date(order.created_at).toLocaleDateString()}
                                    </span>
                                    <span className='ml-3 active-status font-bold'>Đặt hàng thành công</span>
                                </li>
                                : null : null}
                        </ul>
                    </>
                    : ''
                }
            </div>
        </>
    )

}

export default DeliveryAddressOrderDetail
