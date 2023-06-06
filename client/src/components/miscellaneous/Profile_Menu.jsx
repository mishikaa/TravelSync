import {PopupMenu} from 'react-simple-widgets'
import Profile_Details from './Profile_Details';
import AvatarIcon from './Avatar';
import { ChatState } from '../../Context_API/chatProvider';
import { useState } from 'react';


const Profile_Menu = ({sender}) => {
    const {user} = ChatState()
    const [showPopup, setShowPopup] = useState(false)

    return (
    <>  
      <PopupMenu>        
        <button className="plane-btn">
          {/* If the sender is coming from the parent component then display its profile otherwise display the logged user profile */}
          {sender ?
          <AvatarIcon user={sender}/>
          : <AvatarIcon user={user}/>
          }
        </button>
        
        {closePopup => (
          sender ?
            <Profile_Details sender={sender} displayButton="close" closePopup={closePopup}/>
            :
            <Profile_Details closePopup={closePopup}/>
        )}
        
      </PopupMenu>
      
    </>
  )
}

export default Profile_Menu
