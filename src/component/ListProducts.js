import React, { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Carousel, Card } from 'antd';

const gridStyle = {
    width: '100%',
    textAlign: 'center',
};

const formatPriceWithCommas = (price) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

const renderListProduct = (product, brands) => {
    const brand = brands.find(brand => brand.brand_id === product.brand_id);
    return (

        <Card.Grid style={gridStyle} key={product.id}
            className='relative h-full p-5'>
            <div className='absolute top-[15px] right-[15px] 
            z-[2] '>
                <span
                    className='flex items-center justify-center
                    text-[#ed1c24] text-[14px] font-bold 
                    w-[40px] h-[40px] border-[1px] border-solid 
                    border-[#ed1c24]
                    rounded-[50%]'>
                    -{product.prod_percent}%
                </span>
            </div>
            <div className='flex overflow-hidden items-center h-[60%] py-7 justify-center'>
                <Link to={`/product-detail/${product.id}`}
                    className=''>
                    <img src={product.avatar} alt=''
                        className='max-h-[150px]'></img>

                </Link>

            </div>
            <div className='flex justify-start text-start 
        items-start h-[40%] flex-col '>
                {brand && <img src={brand.image} alt="Brand Logo"
                    className="brand-logo max-w-[80px]" />}
                <Link className=' text-[16px] line-clamp-2 font-bold min-h-[50px]
                overflow-hidden mt-[25px]'>
                    {product.prod_description}
                </Link>
                <span className='text-[#1d1d1d] text-[16px] 
            line-through'>
                    {formatPriceWithCommas(product.cost)} đ
                </span>
                <span className='text-[#c8191f] text-[21px] 
            font-bold'>
                    {formatPriceWithCommas(product.price)} đ
                </span>
            </div>

        </Card.Grid>
    )
}

export default renderListProduct