import { useState, useEffect } from "react";
import Login from "../components/Authentication/Login";
import Signup from "../components/Authentication/Signup";
import Intro from "../components/miscellaneous/Intro";
import './authpage.css'
import { useNavigate } from "react-router-dom";

const AuthPage = () => {
    const navigate = useNavigate();

    // Fetching the local storage
    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('userInfo'))

        if (user) {
            navigate('/chats')
        } 
    }, [navigate]) //whenever navigate changes it's gonna run again

    const [currentForm, setForm] = useState('login')
    const changeForm = () => {
        if (currentForm === 'login') {
            setForm('signup')
        } else {
            setForm('login')
        }
    }
    return (
        <div className="authpage">
            <div className="signup-box">
                <Intro />
            </div>
            <div>
                {currentForm === 'login' ? <Login handleClick={changeForm} /> : <Signup handleClick={changeForm} />}
            </div>
        </div>
    )
}

export default AuthPage;