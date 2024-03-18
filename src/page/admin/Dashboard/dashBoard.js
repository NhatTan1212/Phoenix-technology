import React, { useContext, useEffect, useState } from 'react';
import { Col, Divider, Row } from 'antd';
import CardTop from '../../../component/management/DashBoard/CardTop';
import ChartNewOrders from '../../../component/management/DashBoard/ChartNewOrder';
import ChartTotal from '../../../component/management/DashBoard/ChartTotal';
import ChartFavoriteBrands from '../../../component/management/DashBoard/ChartFavoriteBrand';
import ChartFavoriteLaptop from '../../../component/management/DashBoard/ChartFavoriteLaptop';
import { GetFavoriteBrandsByDays, GetNewOrderByDays, GetNewUserByDays, GetOrderSuccessByDays } from '../../../callAPI/management/apiDashBoard';
import Cookies from 'js-cookie';
import { faLessThan } from '@fortawesome/free-solid-svg-icons';
import TableFavoriteLaptops from '../../../component/management/DashBoard/TableFavoriteLaptop';
import Context from '../../../store/Context';

const Dashboard = () => {
    let token = Cookies.get('token')
    const context = useContext(Context)
    const isHiddenAutoCpl = context.isHiddenAutoCpl
    const isScreenSmaller1280 = context.isScreenSmaller1280
    const isScreenSmaller430 = context.isScreenSmaller430

    // order success
    const [orderSuccess7Days, setOrderSuccess7Days] = useState([]);
    const [orderSuccess30Days, setOrderSuccess30Days] = useState([]);
    const [orderSuccess365Days, setOrderSuccess365Days] = useState([]);
    const [daysOrderSuccessSelected, setDaysOrderSuccessSelected] = useState(7);
    const [totalOrderSuccess7Days, setTotalOrderSuccess7Days] = useState(0)
    const [totalOrderSuccess30Days, setTotalOrderSuccess30Days] = useState(0)
    const [totalOrderSuccess365Days, setTotalOrderSuccess365Days] = useState(0)
    const [percentSuccess7Days, setPercentSuccess7Days] = useState(0)
    const [percentSuccess30Days, setPercentSuccess30Days] = useState(0)
    const [percentSuccess365Days, setPercentSuccess365Days] = useState(0)

    // new order
    const [newOrder7Days, setNewOrder7Days] = useState([])
    const [newOrder30Days, setNewOrder30Days] = useState([])
    const [newOrder365Days, setNewOrder365Days] = useState([])
    const [daysNewOrderSelected, setDaysNewOrderSelected] = useState(7);
    const [totalNewOrder7Days, setTotalNewOrder7Days] = useState(0)
    const [totalNewOrder30Days, setTotalNewOrder30Days] = useState(0)
    const [totalNewOrder365Days, setTotalNewOrder365Days] = useState(0)
    const [percentNewOrder7Days, setPercentNewOrder7Days] = useState(0)
    const [percentNewOrder30Days, setPercentNewOrder30Days] = useState(0)
    const [percentNewOrder365Days, setPercentNewOrder365Days] = useState(0)

    //new user
    const [newUser7Days, setNewUser7Days] = useState([])
    const [newUser30Days, setNewUser30Days] = useState([])
    const [newUser365Days, setNewUser365Days] = useState([])
    const [daysNewUserSelected, setDaysNewUserSelected] = useState(7);
    const [totalNewUser7Days, setTotalNewUser7Days] = useState(0)
    const [totalNewUser30Days, setTotalNewUser30Days] = useState(0)
    const [totalNewUser365Days, setTotalNewUser365Days] = useState(0)
    const [percentNewUser7Days, setPercentNewUser7Days] = useState(0)
    const [percentNewUser30Days, setPercentNewUser30Days] = useState(0)
    const [percentNewUser365Days, setPercentNewUser365Days] = useState(0)

    //Line chart new order
    const [modeViewChartNewOrder, setModeViewChartNewOrder] = useState(7)

    //Doughnut chart favorite brands
    const [daysFavoriteBrandsSelected, setDaysFavoriteBrandsSelected] = useState(7)
    const [favoriteDataBrands, setFavoriteBrandsData] = useState([])

    //Bar chart favorite laptops
    const [daysFavoriteLaptopsSelected, setDaysFavoriteLaptopsSelected] = useState(7)

    const setOrderData = (days, data) => {
        const orderStateMappings = {
            7: {
                setOrderSuccess: setOrderSuccess7Days,
                setPercent: setPercentSuccess7Days,
                setTotalOrderCurrent: setTotalOrderSuccess7Days
            },
            30: {
                setOrderSuccess: setOrderSuccess30Days,
                setPercent: setPercentSuccess30Days,
                setTotalOrderCurrent: setTotalOrderSuccess30Days
            },
            365: {
                setOrderSuccess: setOrderSuccess365Days,
                setPercent: setPercentSuccess365Days,
                setTotalOrderCurrent: setTotalOrderSuccess365Days
            }
        };

        const { setOrderSuccess, setPercent, setTotalOrderCurrent } = orderStateMappings[days];
        const { listOrders } = data;

        setOrderSuccess(listOrders.daysCurrent);

        const totalOrder = listOrders.daysCurrent.reduce((accumulator, currentValue) => accumulator + currentValue.total, 0);
        const totalOrderBefore = listOrders.daysBefore.reduce((accumulator, currentValue) => accumulator + currentValue.total, 0);

        const percent = totalOrderBefore === 0 ? (totalOrder !== 0 ? 100 : 0) : ((totalOrder - totalOrderBefore) / totalOrderBefore) * 100;

        setPercent(percent);
        setTotalOrderCurrent(totalOrder);
    };

    const setNewOrderData = (days, data) => {
        const orderStateMappings = {
            7: {
                setNewOrder: setNewOrder7Days,
                setPercent: setPercentNewOrder7Days,
                setTotalOrderCurrent: setTotalNewOrder7Days
            },
            30: {
                setNewOrder: setNewOrder30Days,
                setPercent: setPercentNewOrder30Days,
                setTotalOrderCurrent: setTotalNewOrder30Days
            },
            365: {
                setNewOrder: setNewOrder365Days,
                setPercent: setPercentNewOrder365Days,
                setTotalOrderCurrent: setTotalNewOrder365Days
            }
        };

        const { setNewOrder, setPercent, setTotalOrderCurrent } = orderStateMappings[days];
        const { listOrders } = data;

        setNewOrder(listOrders.daysCurrent);

        const totalOrder = listOrders.daysCurrent.length;
        console.log('Total Order = ', totalOrder);
        const totalOrderBefore = listOrders.daysBefore.length;

        const percent = totalOrderBefore === 0 ? (totalOrder !== 0 ? 100 : 0) : ((totalOrder - totalOrderBefore) / totalOrderBefore) * 100;

        setPercent(percent);
        setTotalOrderCurrent(totalOrder);
    };

    const setNewUserData = (days, data) => {
        const orderStateMappings = {
            7: {
                setNewUser: setNewUser7Days,
                setPercent: setPercentNewUser7Days,
                setTotalUserCurrent: setTotalNewUser7Days
            },
            30: {
                setNewUser: setNewUser30Days,
                setPercent: setPercentNewUser30Days,
                setTotalUserCurrent: setTotalNewUser30Days
            },
            365: {
                setNewUser: setNewUser365Days,
                setPercent: setPercentNewUser365Days,
                setTotalUserCurrent: setTotalNewUser365Days
            }
        };

        const { setNewUser, setPercent, setTotalUserCurrent } = orderStateMappings[days];
        const { listUsers } = data;

        setNewUser(listUsers.daysCurrent);

        const totalUser = listUsers.daysCurrent.length;
        console.log('Total User = ', totalUser);
        const totalUserBefore = listUsers.daysBefore.length;

        const percent = totalUserBefore === 0 ? (totalUser !== 0 ? 100 : 0) : ((totalUser - totalUserBefore) / totalUserBefore) * 100;

        setPercent(percent);
        setTotalUserCurrent(totalUser);
    };

    const getOrderSuccessByDays = (days) => {
        GetOrderSuccessByDays(days).then((data) => {
            console.log(data);
            if (data.success) {
                setOrderData(days, data)
            }
        })
    }

    const getNewOrderByDays = (days) => {
        GetNewOrderByDays(days).then((data) => {
            console.log(data);
            if (data.success) {
                setNewOrderData(days, data)
            }
        })
    }

    const getNewUserByDays = (days) => {
        GetNewUserByDays(days).then((data) => {
            console.log(data);
            if (data.success) {
                setNewUserData(days, data)
            }
        })
    }

    const getFavoriteBrandsByDays = (days) => {
        GetFavoriteBrandsByDays(days).then((data) => {
            console.log(data);
            if (data.success) {
                setFavoriteBrandsData(data.listFavoriteBrands)
            }
        })
    }

    useEffect(() => {
        getOrderSuccessByDays(daysOrderSuccessSelected)
    }, [daysOrderSuccessSelected])

    useEffect(() => {
        getNewOrderByDays(daysNewOrderSelected)
    }, [daysNewOrderSelected])

    useEffect(() => {
        getNewUserByDays(daysNewUserSelected)
    }, [daysNewUserSelected])
    useEffect(() => {
        getOrderSuccessByDays(modeViewChartNewOrder)
        getNewOrderByDays(modeViewChartNewOrder)
        getNewUserByDays(modeViewChartNewOrder)
    }, [modeViewChartNewOrder])

    useEffect(() => {
        getFavoriteBrandsByDays(daysFavoriteBrandsSelected)
    }, [daysFavoriteBrandsSelected])

    return (
        <div className="dashboard-container flex-1 mt-1 mx-3">
            <Row gutter={16}>
                <Col xl={{ span: 10 }} lg={{ span: 12 }} md={{ span: 12 }} sm={{ span: 24 }} xs={{ span: 24 }}>
                    <CardTop
                        cardInfo={
                            daysOrderSuccessSelected === 7 ? {
                                tittleCard: "Tổng doanh thu",
                                valueCard: totalOrderSuccess7Days,
                                percentCard: Math.abs(percentSuccess7Days),
                                upOrDown: percentSuccess7Days > 0 ? 'up' : 'down',
                                setDaysOrderSuccessSelected: setDaysOrderSuccessSelected
                            } : daysOrderSuccessSelected === 30 ? {
                                tittleCard: "Tổng doanh thu",
                                valueCard: totalOrderSuccess30Days,
                                percentCard: Math.abs(percentSuccess30Days),
                                upOrDown: percentSuccess30Days > 0 ? 'up' : 'down',
                                setDaysOrderSuccessSelected: setDaysOrderSuccessSelected
                            } : {
                                tittleCard: "Tổng doanh thu",
                                valueCard: totalOrderSuccess365Days,
                                percentCard: Math.abs(percentSuccess365Days),
                                upOrDown: percentSuccess365Days > 0 ? 'up' : 'down',
                                setDaysOrderSuccessSelected: setDaysOrderSuccessSelected
                            }
                        }
                    />
                </Col>
                <Col xl={{ span: 7 }} lg={{ span: 12 }} md={{ span: 12 }} sm={{ span: 24 }} xs={{ span: 24 }}>
                    <CardTop
                        cardInfo={
                            daysNewOrderSelected === 7 ? {
                                tittleCard: "Đơn hàng mới",
                                valueCard: totalNewOrder7Days,
                                percentCard: Math.abs(percentNewOrder7Days),
                                upOrDown: percentNewOrder7Days > 0 ? 'up' : 'down',
                                setDaysNewOrderSelected: setDaysNewOrderSelected
                            } : daysNewOrderSelected === 30 ? {
                                tittleCard: "Đơn hàng mới",
                                valueCard: totalNewOrder30Days,
                                percentCard: Math.abs(percentNewOrder30Days),
                                upOrDown: percentNewOrder30Days > 0 ? 'up' : 'down',
                                setDaysNewOrderSelected: setDaysNewOrderSelected
                            } : {
                                tittleCard: "Đơn hàng mới",
                                valueCard: totalNewOrder365Days,
                                percentCard: Math.abs(percentNewOrder365Days),
                                upOrDown: percentNewOrder365Days > 0 ? 'up' : 'down',
                                setDaysNewOrderSelected: setDaysNewOrderSelected
                            }
                        }
                    />
                </Col>
                <Col xl={{ span: 7 }} lg={{ span: 12 }} md={{ span: 12 }} sm={{ span: 24 }} xs={{ span: 24 }}>
                    <CardTop
                        cardInfo={
                            daysNewUserSelected === 7 ? {
                                tittleCard: "Khách hàng mới",
                                valueCard: totalNewUser7Days,
                                percentCard: Math.abs(percentNewUser7Days),
                                upOrDown: percentNewUser7Days > 0 ? 'up' : 'down',
                                setDaysNewUserSelected: setDaysNewUserSelected
                            } : daysNewUserSelected === 30 ? {
                                tittleCard: "Khách hàng mới",
                                valueCard: totalNewUser30Days,
                                percentCard: Math.abs(percentNewUser30Days),
                                upOrDown: percentNewUser30Days > 0 ? 'up' : 'down',
                                setDaysNewUserSelected: setDaysNewUserSelected
                            } : {
                                tittleCard: "Khách hàng mới",
                                valueCard: totalNewUser365Days,
                                percentCard: Math.abs(percentNewUser365Days),
                                upOrDown: percentNewUser365Days > 0 ? 'up' : 'down',
                                setDaysNewUserSelected: setDaysNewUserSelected
                            }
                        }
                    />
                </Col>
            </Row>
            <Row className='mt-4 mx-0.5' >
                <Col span={24} className='bg-white'>
                    <ChartNewOrders
                        data={{
                            modeViewChartNewOrder: modeViewChartNewOrder,
                            setModeViewChartNewOrder: setModeViewChartNewOrder,
                            orderSuccess7Days: orderSuccess7Days,
                            orderSuccess30Days: orderSuccess30Days,
                            orderSuccess365Days: orderSuccess365Days,
                            newOrder7Days: newOrder7Days,
                            newOrder30Days: newOrder30Days,
                            newOrder365Days: newOrder365Days,
                            newUser7Days: newUser7Days,
                            newUser30Days: newUser30Days,
                            newUser365Days: newUser365Days,
                        }}
                    />
                </Col>
            </Row>
            <Row className='mt-4 h-max' justify={'space-between'}>
                <Col xl={{ span: 16 }} lg={{ span: 24 }} sm={{ span: 24 }} xs={{ span: 24 }}
                    className='max-w-[1094px]'>
                    <TableFavoriteLaptops
                        data={{
                            daysFavoriteLaptopsSelected: daysFavoriteLaptopsSelected,
                            setDaysFavoriteLaptopsSelected: setDaysFavoriteLaptopsSelected
                        }}
                    ></TableFavoriteLaptops>
                </Col>
                <Col xl={{ span: 8 }} lg={{ span: 24 }} sm={{ span: 24 }} xs={{ span: 24 }}
                    className='bg-white max-w-[781px] max-[1200px]:max-w-[1200px]'>
                    <ChartFavoriteBrands
                        data={{
                            daysFavoriteBrandsSelected: daysFavoriteBrandsSelected,
                            setDaysFavoriteBrandsSelected: setDaysFavoriteBrandsSelected,
                            favoriteDataBrands: favoriteDataBrands
                        }} />
                </Col>
            </Row>
            {/* <Col span={12} className='bg-white max-w-[781px] '>
                    <ChartFavoriteLaptop />
                </Col> */}
        </div >
    );
};

export default Dashboard;
