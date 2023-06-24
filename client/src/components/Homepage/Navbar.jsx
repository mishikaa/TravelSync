import React from 'react'

import './Navbar.css'
import { useNavigate } from 'react-router'
import { ChatState } from '../../Context_API/chatProvider';
import { successPopup } from '../popup';

export const Navbar = () => {
    const navigate = useNavigate();
    const {user} = ChatState();

    const handleClick=()=>{
        if(user) {
            localStorage.removeItem('userInfo')
            navigate('/auth')
            successPopup('Logged out!')
            }
        }

    return (
    <div className='navbar'>
        <div className='brand'>
            <img className="logo" src="/assets/logo.png" alt="logo" />
            <span className='title'>TravelSync</span>
        </div>
        <div className='options'>
            <a href="/">Home</a>
            <a onClick={()=>{navigate('/chats')}}>Chat</a>
            <a href="/about">About</a>
            <a href="/contact">Contact</a>
        </div>
        <div>
            <button className='auth-btn' onClick={handleClick}>
                {!user ? "Get Started" : "Logout"}
            </button>
        </div>
    </div>
  )
}
