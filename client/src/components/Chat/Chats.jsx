import { useEffect, useState } from 'react'
import './chats.css'
import { ChatState } from '../../Context_API/chatProvider'
import { errorPopup } from '../popup'
import axios from 'axios'
import ChatLoading from './ChatLoading'
import AvatarIcon from '../miscellaneous/Avatar'
import { getSender } from '../../config/chatLogic'
import { GroupModal } from '../Group/GroupModal'
import ChatBox from './ChatBox'

const Chats = () => {

  const {selectedChat, setSelectedChat, user, chats, setChats, fetchAgain} = ChatState()
  const [loggedUser, setLoggedUser] = useState();
  
  const fetchChats = async() => { 
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      }

      const {data} = await axios.get('/api/chats', config)
      setChats(data)
      // console.log(chats)

    } catch (error) {
      errorPopup("Error occured! Failed to load the chats.")
    }
  }
  
  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchChats()
  }, [fetchAgain])
  
  return (
    <div className='chats'>
      <div className="head">
        <h2>Chats</h2> 
        
        <GroupModal />
      </div>
      
      <div className='fetched-chats'>
        {chats.length > 0 ? (
          chats.map((chat)=> (
            <div style={
              {
                backgroundColor: selectedChat === chat ? "#424874" : "transparent",
              }
            }
              className='individual-chat'
              key={chat._id}
              onClick={
                () => (
                  setSelectedChat(chat)
                )} >
                <AvatarIcon user=
                  {!chat.isGroupChat 
                  && getSender(loggedUser, chat.users)
                }/>
                <span style={
                  {
                    color: selectedChat === chat ? "#fff" : "#000"
                  }
                }>
                    {/* Fetching the username of the sender */}
                    {!chat.isGroupChat ? getSender(loggedUser, chat.users).username : chat.chatName}
                </span>
                {/* <p>{chat.latestMessage}</p> */}
            </div>
          ))
        ) : (
          <ChatLoading />
        )}
      </div>
    </div>
  )
}

export default Chats
