import { ChatState } from '../Context_API/chatProvider'
import Header from '../components/Chat/Header'
import Chats from '../components/Chat/Chats'
import ChatBox from '../components/Chat/ChatBox'
import SideDrawer from '../components/Chat/SideDrawer'
import './chatpage.css'

const ChatPage = () => {
  const {user} = ChatState()

  return (
    <div className='chatpage'>
      <div className='header'>
        {user && <Header />}
      </div>
      <div className='main'>
        {user && <SideDrawer />}
        {user &&
        <Chats />}
        {user && 
        <ChatBox />}
      </div>
    </div>
  )
}

export default ChatPage
