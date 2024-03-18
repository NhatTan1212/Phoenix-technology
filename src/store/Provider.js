import Context from "./Context";
import { useState } from "react";
import { message } from "antd";

function Provider({ children }) {
    const [isCartChange, setIsCartChange] = useState(false);
    const [isShowFloatLayer, setIsShowFloatLayer] = useState(false);
    const [messageApi, contextHolder] = message.useMessage();
    const [isFinishAddNewOrderVNPAY, setIsFinishAddNewOrderVNPAY] = useState(false);
    const [isHiddenAutoCpl, setIsHiddenAutoCpl] = useState(window.innerWidth >= 992);
    const [isScreenSmaller1280, setIsScreenSmaller1280] = useState(window.innerWidth <= 1280);
    const [isScreenSmaller430, setIsScreenSmaller430] = useState(window.innerWidth <= 430);
    const [currentPageAdminHome, setCurrentPageAdminHome] = useState('db');

    const Message = (type, text) => {
        messageApi.open({
            type: type,
            content: text,
        });
    };

    return (
        <Context.Provider value={{
            isCartChange, setIsCartChange, Message, isShowFloatLayer, setIsShowFloatLayer,
            isFinishAddNewOrderVNPAY, setIsFinishAddNewOrderVNPAY, isHiddenAutoCpl, setIsHiddenAutoCpl,
            isScreenSmaller1280, setIsScreenSmaller1280, isScreenSmaller430, setIsScreenSmaller430,
            currentPageAdminHome, setCurrentPageAdminHome
        }}>
            {contextHolder}
            {children}
        </Context.Provider>
    )
}

export default Provider