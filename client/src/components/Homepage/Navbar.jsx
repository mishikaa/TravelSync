import React from 'react'

import './Navbar.css'

export const Navbar = () => {
  return (
    <div className='navbar'>
        <div className='brand'>
            <img className="logo" src="/assets/logo.png" alt="logo" />
            <span className='title'>TravelSync</span>
        </div>
        <div className='options'>
            <a href="/">Home</a>
            <a href="/chats">Chat</a>
            <a href="/about">About</a>
            <a href="/contact">Contact</a>
        </div>
        <div>
            <button className='auth-btn'>
                Get Started
            </button>
        </div>
    </div>
  )
}
