import {PopupMenu} from 'react-simple-widgets'
import { ChatState } from '../../Context_API/chatProvider'
import { getSender } from '../../config/chatLogic';
import NotificationBadge from 'react-notification-badge';
import { Effect } from 'react-notification-badge';

const styles = {
  cursor: "pointer",
  paddingTop: "3px",
}
const Notification_Menu = () => {
  const {user, notification, setSelectedChat, setNotification} = ChatState();
  return (
      
      <PopupMenu>
        <button className='plane-btn'>
          <NotificationBadge 
            containerStyle={{position: "relative", left: "5px", bottom: "10px"}}
            count={notification.length} 
            effect={Effect.SCALE}
          />
          <i className="fa-solid fa-bell" style={{fontSize:"20px"}}></i>
        </button>
        
        {closePopup => (
          <div className='card'>
            <button onClick={closePopup}  className='plane-btn'>
              <img className="close-icon" src="../assets/close.png" alt="" />
            </button>
            {!notification.length && "No New Messages"}
            {notification.map(noti => (
              <div style={styles} key={noti._id} onClick={() => {
                setSelectedChat(noti.chat);
                setNotification(notification.filter((n) => n !== noti));
              }}>
                {noti.chat.isGroupChat
                ? `New Message in ${noti.chat.chatName}`
                : `New Message from ${getSender(user, noti.chat.users).username}`}
              </div>
            ))}
          </div>
        )}
        
      </PopupMenu>
      
  )
}

export default Notification_Menu
