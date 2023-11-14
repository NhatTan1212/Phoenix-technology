import React, { useState, useEffect } from 'react';
import './ResetPassword.scss';
import { Link, NavLink, useLocation } from 'react-router-dom';
import '../../views/font.scss'
import axios from 'axios';
import Instance from '../../axiosInstance';

const ResetPassword = () => {

    const [email, setEmail] = useState('');
    const [emailErr, setEmailErr] = useState('');
    const [isSendMailFail, setIsSendEmailFail] = useState(false);

    const handleConfirm = () => {
        const regexEmail = /^[a-zA-Z0-9]+@(?:[a-zA-Z0-9]+\.)+[A-Za-z]+$/;

        if (email === '') {
            setIsSendEmailFail(true)
            setEmailErr("Vui lòng nhập email cần đổi mật khẩu!")
        } else if (!regexEmail.test(email)) {
            setIsSendEmailFail(true)
            setEmailErr('Email không hợp lệ')
            return;
        } else {
            Instance.post(`/password/email`, { email: email })
                .then((res) => {
                    if (res.status) {
                        setIsSendEmailFail(false)
                        alert("Gửi thư xác thực thành công!")
                    } else {
                        setIsSendEmailFail(true)
                        setEmailErr(res.message)
                    }
                })
                .catch((error) => {
                    console.error(error);
                });

        }
    };

    return (
        <div className={`container m-auto min-w-full h-auto`}  >
            <div className='wrapContent h-auto mb-[100px]'>
                <div className='loginForm'>
                    <h2 className='my-[50px] font-bold text-[20px]'>Reset Password</h2>
                    <input className='pl-[10px]' placeholder='Email' type="email"
                        onChange={(e) => {
                            setIsSendEmailFail(false)
                            setEmail(e.target.value)
                        }}></input>

                    <button className='btnSendMail' onClick={() => { handleConfirm() }}>RESET PASSWORD</button>
                    <div className='wrap-err-mess'>
                        {isSendMailFail ? <p className='err-mess'>*{emailErr}</p>
                            : null}
                    </div>
                    <div >
                        <div className='labelSignUp'>
                            <label>Return to the sign in page?</label>
                            <Link to='/auth'>Sign In</Link>
                        </div>
                    </div>
                </div>
                {/* <div className='img'>
                    <img src={img} alt="" />
                </div> */}
            </div>
        </div>

    );
};

export default ResetPassword;
