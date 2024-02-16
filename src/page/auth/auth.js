import React, { useState, useEffect } from 'react';
import './auth.scss';
import Cookies from 'js-cookie';
import ggIcon from '../../images/search.png'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye } from '@fortawesome/free-regular-svg-icons';
import { faEyeSlash } from '@fortawesome/free-regular-svg-icons';
import { faFacebookF } from '@fortawesome/free-brands-svg-icons';
// import { faGoogle } from '@fortawesome/free-brands-svg-icons';
import { Link, NavLink, useLocation } from 'react-router-dom';
// import '../../views/font.scss'

const Auth = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const successMessage = queryParams.get('success');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [signInError, setSignupError] = useState(false);
    const [emailInvalid, setEmailInvalid] = useState(false);
    const [emailExists, setEmailExists] = useState(false);
    const [errMessage, setErrMassage] = useState('');
    const [isSignUpFail, setIsSignUpFail] = useState(false);

    const handleSignIn = () => {
        const regexEmail = /^[a-zA-Z0-9]+@(?:[a-zA-Z0-9]+\.)+[A-Za-z]+$/;
        // console.log(regexEmail.test(email))
        if (!regexEmail.test(email)) {
            setEmailInvalid(true);
            return;
        } else {
            setEmailInvalid(false);
            if (password === '') {
                setSignupError(true);
                setErrMassage('Mật khẩu không được để trống');
                return;
            } else {
                setSignupError(false);
            }
        }

        if (!signInError) {
            const dataUser = {
                email: email,
                pass: password
            };

            // fetch("https://phoenixlt.azurewebsites.net/requirelogin", {
            fetch("http://localhost:8000/requirelogin", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(dataUser),
            })
                .then((response) => response.json())
                .then((data) => {
                    if (data.success) {
                        // localStorage.setItem('isLogin', true);
                        localStorage.setItem('user_name', data.user_name);
                        localStorage.setItem('role', data.role);
                        Cookies.set('token', data.token, { expires: 30 });
                        Cookies.remove('tokenGID');
                        console.log((data.redirectUrl));
                        window.location.href = data.redirectUrl;
                        // setIncorrectPass(false);
                    } else {
                        setIsSignUpFail(true);
                        setErrMassage(data.errMessage);
                    }
                })
                .catch((error) => {
                    console.error("Error:", error);
                });

        }
        setSignupError(false)
        setIsSignUpFail(false);
        setErrMassage('');
    };

    const showPassword = () => {
        return setIsPasswordVisible(!isPasswordVisible)
    }

    useEffect(() => {
        if (successMessage === 'true') {
            alert("Tài khoản của bạn đã được đăng ký thành công!");
        }
    }, [successMessage]);

    return (
        <div className={`container m-auto min-w-full h-auto`}  >
            <div className='wrapContent h-auto mb-[100px]'>
                <div className='loginForm'>
                    <h2 className='text-[20px] font-bold'>Sign In</h2>
                    <input
                        className='input'
                        placeholder='Email'
                        type="email"
                        onChange={(e) => { setEmail(e.target.value) }}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                handleSignIn();
                            }
                        }}></input>
                    {/* <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} /> */}
                    <div className='wrap-password'>
                        <input
                            className='input'
                            placeholder='Password'
                            type={isPasswordVisible ? 'text' : 'password'}
                            onChange={(e) => { setPassword(e.target.value) }}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    handleSignIn();
                                }
                            }}>
                        </input>
                        {isPasswordVisible
                            ? <FontAwesomeIcon icon={faEyeSlash} className='eye-icon' onClick={() => { showPassword() }} />
                            : <FontAwesomeIcon icon={faEye} className='eye-icon' onClick={() => { showPassword() }} />}

                    </div>
                    <div className='wrap-err-mess'>
                        {emailInvalid ? (
                            <p className='err-mess'>*Email không hợp lệ</p>
                        )
                            : isSignUpFail ? (
                                <p className='err-mess'>
                                    *{errMessage === 'Tài khoản chưa được xác thực.'
                                        ? <span>{errMessage} <a href='/auth/confirm'>Nhấp vào đây để xác thực tài khoản</a></span>
                                        : errMessage}
                                </p>
                            ) : null}
                    </div>
                    <div className="forgot-pass">
                        <Link to="/password/reset">Forgot Password?</Link>
                    </div>
                    <button
                        className='btnSignIn'
                        onClick={() => { handleSignIn() }}>SIGN IN</button>
                    <div className="divider">
                        <div className="line"></div>
                        <div className='txt-divider'>

                            <span>or</span>
                        </div>
                        <div className="line"></div>
                    </div>
                    <div className='wrap-sign-in-fb'>
                        <button className='btnSignInFb'>
                            <label>
                                <FontAwesomeIcon icon={faFacebookF} className='fb-icon' />

                            </label>
                            <label>

                                SIGN IN WITH FACEBOOK
                            </label>
                        </button>

                    </div>
                    <div className='wrap-sign-in-gg'>
                        <button className='btnSignInGg'>
                            <label>
                                <img src={ggIcon} className='gg-icon'></img>

                            </label>
                            <label className='txt-signin-gg'>
                                SIGN IN WITH GOOGLE

                            </label>
                        </button>

                    </div>
                    <div className='labelSignUp'>
                        <label>Create an account?</label>
                        <Link to='/auth/signup'>Sign Up</Link>
                    </div>
                </div>
                {/* <div className='img'>
                    <img src={img} alt="" />
                </div> */}
            </div>
        </div>

    );
};

export default Auth;
