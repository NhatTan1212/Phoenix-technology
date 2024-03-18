import React from 'react';
import { Card, Col, Row, Select } from 'antd';
import { UpOutlined, MoneyCollectOutlined, ShoppingOutlined, UserAddOutlined, DownOutlined } from '@ant-design/icons';

const CardTop = ({ cardInfo }) => {
    const optionsSelectDay = [
        { value: 7, label: '7 ngày gần nhất' },
        { value: 30, label: '30 ngày gần nhất' },
        { value: 365, label: '365 ngày gần nhất' }
    ];

    const setStateMapping = {
        'Tổng doanh thu': cardInfo.setDaysOrderSuccessSelected,
        'Đơn hàng mới': cardInfo.setDaysNewOrderSelected,
        'Khách hàng mới': cardInfo.setDaysNewUserSelected
    }

    const iconMapping = {
        'Tổng doanh thu': MoneyCollectOutlined,
        'Đơn hàng mới': ShoppingOutlined,
        'Khách hàng mới': UserAddOutlined
    };

    const iconUpDownMapping = {
        'up': UpOutlined,
        'down': DownOutlined
    }

    const IconComponent = iconMapping[cardInfo.tittleCard] || MoneyCollectOutlined;
    const IconUpDownComponent = iconUpDownMapping[cardInfo.upOrDown];

    const iconClass = cardInfo.upOrDown === 'up' ? 'text-green-500' : 'text-red-500';

    const handleChange = (value) => {
        console.log(`selected ${value}`);
        setStateMapping[cardInfo.tittleCard](value)
    };
    return (
        <Card
            className='border-b-[4px] border-[#ce1b1b] bg-[#fff]'
            title={
                <Row>
                    <Col span={12} className='align-middle flex my-auto'>
                        <h1 className='font-bold text-[15px]'>{cardInfo.tittleCard}</h1>
                    </Col>
                    <Col span={12} className='text-end'>
                        <Select
                            className=''
                            defaultValue="7 ngày"
                            onChange={handleChange}
                            options={optionsSelectDay}
                        />
                    </Col>
                </Row>
            }
            bordered={false}
        >
            <div className='flex justify-between max-[1300px]:flex-col-reverse'>
                <div className='flex'>
                    <IconComponent className='text-[30px] my-auto mr-2 p-4 bg-[#ce1b1b] rounded-xl text-white' />
                    <span className='text-[30px] my-auto'>
                        {cardInfo.tittleCard === 'Tổng doanh thu'
                            ? cardInfo.valueCard.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })
                            : cardInfo.valueCard + '+'
                        }

                    </span>
                </div>
                <div className='flex max-[1300px]:justify-end max-[1300px]:pb-2'>
                    <IconUpDownComponent className={`${iconClass} text-[20px] my-auto pt mr-2`} />
                    <span className='text-[20px] my-auto'>{parseFloat(cardInfo.percentCard).toFixed(2)} %</span>
                </div>
            </div>
        </Card>
    );
};

export default CardTop;
