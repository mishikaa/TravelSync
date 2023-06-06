import { useNavigate } from 'react-router-dom'
import { ChatState } from '../../Context_API/chatProvider'
import { successPopup } from '../popup'
import AvatarIcon from './Avatar'
import './Profile_Details.css'
import { useState } from 'react'

const Profile_Details = ({sender, displayButton, closePopup}) => {
    const {user} = ChatState()
    const navigate = useNavigate()
    
    const logout = () => {
        localStorage.removeItem('userInfo')
        successPopup('Logged out!')
        navigate('/')
    }

    return (
    <div className="card">
        <button onClick={closePopup}  className='plane-btn'>
            <img className="close-icon" src="../assets/close.png" alt="" />
        </button>
        <section className='circle-avatar'>
          {sender ?
          <AvatarIcon user={sender} size='100'/>
          : <AvatarIcon user={user} size='100'/>
          }
        </section>
        
        <h5 className="txt username">{sender ? sender.username : user.username}</h5>
        
        <p className="txt email">{sender ? sender.email : user.email}</p>
        <hr />
    
        <hr style={{ margin: "0 -24px 24px" }} />
        
        {!displayButton &&
        <button 
            className="logout-btn"
            onClick={logout}>
          Logout
        </button>  
        }
        </div>
  )
}

export default Profile_Details
