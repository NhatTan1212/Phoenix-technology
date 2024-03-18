import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { subDays, format, set, subMonths } from 'date-fns';
import { Select } from 'antd';

import {
    Chart as ChartJS, CategoryScale, LinearScale, Tooltip, Legend, TimeScale, LineElement, PointElement, defaults, Title, SubTitle
} from 'chart.js';

ChartJS.register(
    CategoryScale, LinearScale, TimeScale, Tooltip, Legend, LineElement, PointElement, Title, SubTitle,
)

defaults.responsive = true
defaults.maintainAspectRatio = false

const ChartNewOrders = ({ data }) => {



    const dataDaysMapping = {
        7: {
            orderSuccess: data.orderSuccess7Days,
            newUser: data.newUser7Days,
            newOrder: data.newOrder7Days,
        },
        30: {
            orderSuccess: data.orderSuccess30Days,
            newUser: data.newUser30Days,
            newOrder: data.newOrder30Days
        },
        365: {
            orderSuccess: data.orderSuccess365Days,
            newUser: data.newUser365Days,
            newOrder: data.newOrder365Days
        }
    };
    let labels = [];
    let newDataTotal = [];
    let newDataOrder = [];
    let newDataUser = [];

    if (data.modeViewChartNewOrder === 7 || data.modeViewChartNewOrder === 30) {
        // Xem theo tuần hoặc tháng
        labels = Array.from({ length: data.modeViewChartNewOrder }, (_, i) => {
            const date = subDays(new Date(), data.modeViewChartNewOrder - 1 - i);
            return format(date, 'yyyy-MM-dd');
        });

        newDataTotal = Array.from({ length: data.modeViewChartNewOrder }, (_, i) => {
            const date = subDays(new Date(), data.modeViewChartNewOrder - 1 - i).toISOString().split('T')[0];
            const order = dataDaysMapping[data.modeViewChartNewOrder].orderSuccess.find(item => item.created_at.split('T')[0] === date);
            return order ? order.total : 0;
        });

        newDataOrder = Array.from({ length: data.modeViewChartNewOrder }, (_, i) => {
            const date = subDays(new Date(), data.modeViewChartNewOrder - 1 - i).toISOString().split('T')[0];
            const orders = dataDaysMapping[data.modeViewChartNewOrder].newOrder.filter(item => item.created_at.split('T')[0] === date);
            return orders.length;
        });

        newDataUser = Array.from({ length: data.modeViewChartNewOrder }, (_, i) => {
            const date = subDays(new Date(), data.modeViewChartNewOrder - 1 - i).toISOString().split('T')[0];
            const users = dataDaysMapping[data.modeViewChartNewOrder].newUser.filter(item => item.created_at.split('T')[0] === date);
            return users.length;
        });
    } else if (data.modeViewChartNewOrder === 365) {
        // Xem theo năm
        const currentDate = new Date();
        for (let i = 11; i >= 0; i--) {
            const date = subMonths(currentDate, i);
            labels.push(format(date, 'yyyy-MM'));
            const total = dataDaysMapping[data.modeViewChartNewOrder].orderSuccess
                .filter(item => format(new Date(item.created_at), 'yyyy-MM') === format(date, 'yyyy-MM'))
                .reduce((acc, curr) => acc + curr.total, 0);
            newDataTotal.push(total);
            const totalOrder = dataDaysMapping[data.modeViewChartNewOrder].newOrder
                .filter(item => format(new Date(item.created_at), 'yyyy-MM') === format(date, 'yyyy-MM'))
                .length;
            newDataOrder.push(totalOrder);
            const totalUser = dataDaysMapping[data.modeViewChartNewOrder].newUser
                .filter(item => format(new Date(item.created_at), 'yyyy-MM') === format(date, 'yyyy-MM'))
                .length;
            newDataUser.push(totalUser);
        }
    }

    const dataNewOrder = {
        labels: labels,
        datasets: [
            {
                label: 'Tổng doanh thu',
                data: newDataTotal,
                fill: false,
                borderColor: 'rgb(206 27 27)',
                backgroundColor: 'rgb(206 27 27)',
                tension: 0.3
            },
            {
                label: 'Đơn hàng mới',
                data: newDataOrder,
                fill: false,
                borderColor: 'rgb(21,177,0)',
                backgroundColor: 'rgb(21,177,0)',
                tension: 0.3,
            },
            {
                label: 'Khách hàng mới',
                data: newDataUser,
                fill: false,
                borderColor: 'rgb(54, 162, 235)',
                backgroundColor: 'rgb(54, 162, 235)',
                tension: 0.3,
            }
        ]
    };

    const optionsNewOrder = {
        scales: {
            y: {
                beginAtZero: true,
                position: 'right',
            },
        },
        plugins: {
            title: {
                display: true,
                align: 'between',
                text: "Đơn hàng mới",
                font: {
                    size: '20px'
                },
                padding: {
                    left: 20,
                    top: 20,
                    bottom: 10,
                }
            },
            legend: {
                display: true,
                position: 'top',
                align: "between",
            }
        }
    };

    return (
        <div className='relative '>
            <Select
                className='absolute right-2 top-2'
                value={data.modeViewChartNewOrder || 7}
                options={[
                    {
                        value: 7,
                        label: 'Xem theo tuần'
                    },
                    {
                        value: 30,
                        label: 'Xem theo tháng'
                    },
                    {
                        value: 365,
                        label: 'Xem theo năm'
                    },
                ]}
                onChange={(e) => {
                    data.setModeViewChartNewOrder(e)
                }}
            ></Select>
            <Line
                // height={500}
                className='w-full h-full max-h-[500px] min-h-[300px]'
                data={dataNewOrder}
                options={optionsNewOrder}
            />
        </div>
    );
};

export default ChartNewOrders;
