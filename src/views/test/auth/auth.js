import React, { useState } from 'react';
import './auth.scss';
import Cookies from 'js-cookie';

const Auth = () => {
    const [isSignUp, setIsSignUp] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [signupError, setSignupError] = useState('');
    const [emailInvalid, setEmailInvalid] = useState(false);
    const [emailExists, setEmailExists] = useState(false);
    const [incorrectPass, setIncorrectPass] = useState(false);

    const toggleSignUp = () => {
        setIsSignUp(!isSignUp);
    };

    const handleSignUp = () => {
        if (name === '' || email === '' || password === '') {
            setSignupError('This field cannot be left blank!');
            return;
        }

        const regexEmail = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
        const isEmailError = !regexEmail.test(email.trim());

        if (isEmailError) {
            setEmailInvalid(true);
            return;
        }

        const dataUser = {
            name: name,
            email: email,
            pass: password
        };

        fetch("/requireregister", {
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
                } else {
                    setEmailExists(false);
                    alert("Bạn đã tạo tài khoản thành công.");
                }
            })
            .catch((error) => {
                console.error("Error:", error);
            });
    };

    const handleSignIn = () => {
        const dataUser = {
            email: email,
            pass: password
        };

        fetch("http://localhost:8000/requirelogin", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(dataUser),
        })
            .then((response) => response.json())
            .then((data) => {
                localStorage.setItem('isLogin', true);
                localStorage.setItem('user_name', data.user_name);
                if (data.success) {
                    Cookies.set('token', data.token, { expires: 1 });
                    window.location.href = data.redirectUrl;
                    setIncorrectPass(false);
                } else {
                    setIncorrectPass(true);
                }
            })
            .catch((error) => {
                console.error("Error:", error);
            });
    };

    return (
        <div>
            <div className={`cont ${isSignUp ? 's--signup' : ''}`}>
                <div className="form sign-in">
                    <h2>Welcome back,</h2>
                    <label>
                        <span>Email</span>
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    </label>
                    <label>
                        <span>Password</span>
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    </label>
                    <p className="forgot-pass">Forgot password?</p>
                    {incorrectPass && <p className="incorrect-pass">Incorrect username or password!</p>}
                    <button type="button" className="submit" onClick={handleSignIn}>Sign In</button>
                    <button type="button" className="fb-btn">
                        Connect with <span>facebook</span>
                    </button>
                </div>
                <div className="sub-cont">
                    <div className="img">
                        <div className="img__text m--up">
                            <h2>New here?</h2>
                            <p>Sign up and discover great amount of new opportunities!</p>
                        </div>
                        <div className="img__text m--in">
                            <h2>One of us?</h2>
                            <p>If you already have an account, just sign in. We've missed you!</p>
                        </div>
                        <div className="img__btn" onClick={toggleSignUp}>
                            <span className="m--up" >Sign Up</span>
                            <span className="m--in" >Sign In</span>
                        </div>
                    </div>
                    <div className="form sign-up">
                        <h2>Time to feel like home,</h2>
                        <label>
                            <span>Name</span>
                            <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
                            {signupError && <p className="signup-error">{signupError}</p>}
                        </label>
                        <label>
                            <span>Email</span>
                            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                            {signupError && <p className="signup-error">{signupError}</p>}
                            {emailInvalid && <p className="email-invalid">Email invalid!</p>}
                            {emailExists && <p className="email-exists">Email already exists!</p>}
                        </label>
                        <label>
                            <span>Password</span>
                            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                            {signupError && <p className="signup-error">{signupError}</p>}
                        </label>
                        <button type="button" className="submit" onClick={handleSignUp}>Sign Up</button>
                        <button type="button" className="fb-btn">
                            Join with <span>facebook</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Auth;
