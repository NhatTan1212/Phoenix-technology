import React, { useState, useEffect } from 'react';
import './ResetPassword.scss';
import { Link, NavLink, useLocation } from 'react-router-dom';
import '../../views/font.scss'
import axios from 'axios';

const ResetPassword = () => {

    const [email, setEmail] = useState('');
    const [emailErr, setEmailErr] = useState('');
    const [isSendMailFail, setIsSendEmailFail] = useState(false);

    const handleConfirm = () => {
        const regexEmail = /^[a-zA-Z0-9]+@(?:[a-zA-Z0-9]+\.)+[A-Za-z]+$/;

        if (email === '') {
            return;
        } else if (!regexEmail.test(email)) {
            setIsSendEmailFail(true)
            setEmailErr('Email không hợp lệ')
            return;
        } else {
            axios.post(`http://localhost:8000/password/email`, { email: email })
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
        <div className='container'>
            <div className='wrapContent'>
                <div className='confirmationForm'>
                    <h2>Reset Password</h2>
                    <input placeholder='Email' type="email" onChange={(e) => { setEmail(e.target.value) }}></input>

                    <button className='btnSendMail' onClick={() => { handleConfirm() }}>RESET PASSWORD</button>
                    <div className='wrap-err-mess'>
                        {isSendMailFail ? <p className='err-mess'>*{emailErr}</p>
                            : null}
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
