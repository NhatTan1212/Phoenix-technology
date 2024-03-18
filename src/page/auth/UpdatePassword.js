import React, { useState, useEffect } from 'react';
import './UpdatePassword.scss';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import '../../views/font.scss'
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye } from '@fortawesome/free-regular-svg-icons';
import { faEyeSlash } from '@fortawesome/free-regular-svg-icons';
import Instance from '../../axiosInstance';

const UpdatePassword = () => {
    const navigate = useNavigate()
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const { email } = useParams();
    const [password, setPassword] = useState('');
    const [isSendMailFail, setIsSendEmailFail] = useState(false);
    const [passwordErr, setPasswordErr] = useState('')

    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);

    const showPassword = () => {
        return setIsPasswordVisible(!isPasswordVisible)
    }

    const handleConfirm = () => {
        const token = queryParams.get('token')
        if (password === '') {
            return;
        } else if (password.length < 6) {
            setIsSendEmailFail(true)
            setPasswordErr('Password phải có ít nhất 6 ký tự.')
            return;
        } else {
            Instance.post(`/password/reset`,
                { email: email, password: password, token: token })
                .then((res) => {
                    if (res.data.status) {
                        // console.log(res.data.message)
                        setIsSendEmailFail(false)
                        alert(res.data.message)

                        navigate('/auth')
                    } else {
                        setIsSendEmailFail(true)
                        setPasswordErr(res.message)
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
                    {/* <input placeholder='New Password' type="password" onChange={(e) => { setPassword(e.target.value) }}></input> */}
                    <div className='wrap-password'>
                        <input placeholder='New Password' type={isPasswordVisible ? 'text' : 'password'} onChange={(e) => { setPassword(e.target.value) }}>
                        </input>
                        {isPasswordVisible
                            ? <FontAwesomeIcon icon={faEyeSlash} className='eye-icon' onClick={() => { showPassword() }} />
                            : <FontAwesomeIcon icon={faEye} className='eye-icon' onClick={() => { showPassword() }} />}

                    </div>
                    <button className='btnSendMail' onClick={() => { handleConfirm() }}>RESET PASSWORD</button>
                    <div className='wrap-err-mess'>
                        {isSendMailFail ? <p className='err-mess'>*{passwordErr}</p>
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

export default UpdatePassword;
