import React, { useContext } from 'react';
import Context from '../../store/Context';
import AppRoutes from '../../AppRoutes';

function Content() {
    const context = useContext(Context)
    const isShowFloatLayer = context.isShowFloatLayer
    const setIsShowFloatLayer = context.setIsShowFloatLayer
    return (

        <div className='page-content' onClick={(e) => { isShowFloatLayer ? setIsShowFloatLayer(false) : setIsShowFloatLayer(false) }}>
            <>
                <AppRoutes></AppRoutes>
            </>
        </div>
    );
}

export default Content