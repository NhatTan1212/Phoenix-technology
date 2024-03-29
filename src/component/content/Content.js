import React, { useContext } from 'react';
import Context from '../../store/Context';
import AppRoutes from '../../AppRoutes';
import MessengerChat from '../MessengerChat';

function Content() {
    const context = useContext(Context)
    const isShowFloatLayer = context.isShowFloatLayer
    const setIsShowFloatLayer = context.setIsShowFloatLayer
    return (

        <div className='page-content bg-[#f0f0f0]' onClick={(e) => { isShowFloatLayer ? setIsShowFloatLayer(false) : setIsShowFloatLayer(false) }}>
            <>
                <AppRoutes></AppRoutes>
                <MessengerChat />
            </>
        </div>
    );
}

export default Content