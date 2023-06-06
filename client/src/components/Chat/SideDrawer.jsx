import { useState } from 'react'
import './sideDrawer.css'
import ChatLoading from './ChatLoading'
import { ChatState } from '../../Context_API/chatProvider'
import UserListItem from './UserListItem'
import SearchBar from '../miscellaneous/SearchBar'
import axios from 'axios'
import { errorPopup } from '../popup'

const SideDrawer = () => {
  const {user, setSelectedChat, chats, setChats} = ChatState()
  
  const [search, setSearch] = useState("") // to store the searched keyword
  const [searchResult, setSearchResult] = useState([]) // to store the searched result
  const [loading, setLoading] = useState(false) // to set the loading when a keyword is searched
  const [loadingChat, setLoadingChat] = useState()
  
  // to search for a chat with a particular user(user id as userId) or create chat if doesn't exist
  const accessChat = async(userId) => {
    
    try {
      setSearch("") //to close the sideDrawer as soon as one of the searched results is clicked on

      setLoadingChat(true)

      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`
        }
      }

      const {data} = await axios.post('/api/chats', {userId}, config)
      
      // If the chat is not present already
      if(!chats.find((c) => c._id === data._id)) {
        setChats([...chats, data]) //appending the current newly created chat to the previous ones
      }

      setSelectedChat(data)
      setLoadingChat(false)
      
    } catch (error) {
      errorPopup("Error fetching the chat")
    }
  }

  return (
    <div className="side-drawer">
      <SearchBar search={search} setSearch={setSearch}setSearchResult={setSearchResult} loading={loading} setLoading={setLoading}/>
        {
          // if loading is true then display ChatLoading component or else display the searchResult IF AND ONLY IF search is not empty(so that sideDrawer closes as soon as search is empty or a searchResult is clicked on (this is done in accessChat()))
          loading ? ( 
          <ChatLoading /> 
        ) : (search !== "" && (
            (searchResult[0] !== "No results") ? (
              searchResult.map(user => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={()=>accessChat(user._id)}
                />
              ))
          ) : <span className='no-result'>{searchResult[0]}</span>)
        )}
        {loadingChat && <img className='spinner' src='../assets/spinner.gif' alt="spinner"></img>} {/* For the creation of new chat(if does not exist) or finding one of the chats */}
    </div> 
  )
}

export default SideDrawer
