import React, { useState } from 'react';
import './SignUp.scss';
import Cookies from 'js-cookie';
import ggIcon from '../../images/search.png'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye } from '@fortawesome/free-regular-svg-icons';
import { faFacebookF } from '@fortawesome/free-brands-svg-icons';
// import { faGoogle } from '@fortawesome/free-brands-svg-icons';
import { Link, NavLink } from 'react-router-dom';

const SignUp = () => {
    const [isSignUp, setIsSignUp] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [retypePassword, setRetypePassword] = useState('');
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [signupError, setSignupError] = useState('');
    const [emailInvalid, setEmailInvalid] = useState(false);
    const [nameInvalid, setNameInvalid] = useState(false);
    const [passwordInValid, setPasswordInvalid] = useState(false);
    const [rePasswordInValid, setRePasswordInvalid] = useState(false);
    const [emailExists, setEmailExists] = useState(false);
    const [incorrectPass, setIncorrectPass] = useState(false);
    const [hasNameChanged, setHasNameChanged] = useState(false);
    const [hasEmailChanged, setHasEmailChanged] = useState(false);
    const [hasPasswordChanged, setHasPasswordChanged] = useState(false);
    const [hasRePasswordChanged, setHasRePasswordChanged] = useState(false);
    const [errMessage, setErrMassage] = useState('');


    // const toggleSignUp = () => {
    //     setIsSignUp(!isSignUp);
    // };

    const handleSignUp = () => {
        if (name === '' || email === '' || password === '' || retypePassword === '') {
            setSignupError(true)
        }
        if (password !== retypePassword) {
            setSignupError(true);
            setErrMassage('Mật khẩu và mật khẩu nhập lại không khớp');
            return;
        }
        if (name === '' || email === '' || password === ''
            || emailInvalid || nameInvalid || passwordInValid) {
            return;
        } else {
            const dataUser = {
                name: name,
                email: email,
                pass: password
            };

            fetch("http://localhost:8000/requireregister", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(dataUser),
            })
                .then((response) => response.json())
                .then((data) => {
                    if (data.emailAlreadyExists) {
                        setEmailExists(true);
                        setSignupError(true)
                    } else {
                        setEmailExists(false);

                        alert(data.message);
                    }
                })
                .catch((error) => {
                    console.error("Error:", error);
                });
        }


    };

    const onChangeName = (e) => {
        setName(e.target.value);
        setHasNameChanged(true);
        const regexName = /^(?:(?!\s\s)(?!\d).){1,50}$/;
        const isNameError = !regexName.test(e.target.value.trim());

        if (isNameError) {
            setNameInvalid(true);
            return;
        }
        setNameInvalid(false);
    };

    const onChangeEmail = (e) => {
        const newEmail = e.target.value;
        setHasEmailChanged(true);
        setEmail(newEmail);
        const regexEmail = /^[a-zA-Z0-9]+@(?:[a-zA-Z0-9]+\.)+[A-Za-z]+$/;
        const isEmailValid = regexEmail.test(newEmail) && newEmail.length <= 255;
        setEmailInvalid(!isEmailValid);
    };

    const onChangePassword = (e) => {
        const newPassword = e.target.value;
        setHasPasswordChanged(true);
        setPassword(newPassword);
        const regexPassword = /^.{6,}$/;
        const isPasswordValid = regexPassword.test(newPassword);
        setPasswordInvalid(!isPasswordValid);
    };

    const onChangeRetypePassword = (e) => {
        const newPassword = e.target.value;
        setHasRePasswordChanged(true);
        setRetypePassword(newPassword)
        if (newPassword === password) {
            setRePasswordInvalid(false);
        } else {
            setRePasswordInvalid(true);

        }

    };



    const showPassword = () => {
        return setIsPasswordVisible(!isPasswordVisible)
    }

    return (
        <div className={`container m-auto min-w-full h-auto`}  >
            <div className='wrapContent h-auto mb-[100px]'>
                <div className='loginForm'>
                    <h2 className=''>Sign Up</h2>
                    <input
                        className='input'
                        placeholder='Name' type='text'
                        onChange={(e) => onChangeName(e)}></input>
                    <div className='wrap-err-mess'>
                        {hasNameChanged && name == '' ? <p className='err-mess'>*Name không được để trống</p>
                            : nameInvalid ? <p className='err-mess'>*Name không hợp lệ</p>
                                : null
                        }

                    </div>
                    <input
                        className='input'
                        placeholder='Email' type="email"
                        onChange={(e) => onChangeEmail(e)}></input>
                    <div className='wrap-err-mess'>
                        {hasEmailChanged && email == '' ? <p className='err-mess'>*Email không được để trống</p>
                            : emailInvalid ? <p className='err-mess'>*Email không hợp lệ</p>
                                : null
                        }

                    </div>
                    {/* <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} /> */}
                    <div className='wrap-password'>
                        <input

                            className='input' placeholder='Password'
                            type={isPasswordVisible ? 'text' : 'password'}
                            onChange={(e) => onChangePassword(e)}>
                        </input>
                        <FontAwesomeIcon icon={faEye} className='eye-icon' onClick={() => { showPassword() }} />

                    </div>
                    <div className='wrap-password'>
                        <input

                            className='input' placeholder='Retype Password'
                            type={isPasswordVisible ? 'text' : 'password'}
                            onChange={(e) => { onChangeRetypePassword(e) }}>
                        </input>
                        <FontAwesomeIcon icon={faEye} className='eye-icon' onClick={() => { showPassword() }} />

                    </div>
                    <div className='wrap-err-mess'>
                        {hasRePasswordChanged && retypePassword == '' ? <p className='err-mess'>*Retype Password không được để trống</p>
                            : rePasswordInValid ? <p className='err-mess'>*{errMessage}</p> : null
                        }

                    </div>

                    <div className='wrap-err-mess'>
                        {hasPasswordChanged && password == '' ? <p className='err-mess'>*Password không được để trống</p>
                            : passwordInValid ? <p className='err-mess'>*Password phải có ít nhất 6 ký tự</p>
                                : password.length > 255 ? <p className='err-mess'>*Password không được vượt quá 255 ký tự</p>
                                    : null
                        }

                    </div>
                    <button className='btnSignIn' onClick={() => { handleSignUp() }}>SIGN UP</button>
                    <div className='wrap-err-mess'>
                        {
                            signupError && name == ''
                                ? <p className='err-mess'>*Name không được để trống</p> :
                                signupError && email == ''
                                    ? <p className='err-mess'>*Email không được để trống</p> :
                                    signupError && password == ''
                                        ? <p className='err-mess'>*Password không được để trống</p> :
                                        emailExists ? <p className='err-mess'>*Email đã tồn tại</p>
                                            : null
                        }

                    </div>

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
                        <label>Already have an account?</label>
                        <Link href='' to='/auth'>Sign In</Link>
                    </div>
                </div>
                {/* <div className='img'>
                    <img src={img} alt="" />
                </div> */}
            </div>
        </div>
    );
};

export default SignUp;
