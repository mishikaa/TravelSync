import { useState, useEffect } from 'react';
import Modal from 'react-modal';
import axios from 'axios';
import "./UpdateGroupModal.css"
import { ChatState } from '../../Context_API/chatProvider';
import { UserBadge } from '../User Card/UserBadge';
import { errorPopup } from '../popup';
import UserListItem from '../Chat/UserListItem';

const customStyles = {
    content: {
      top: '50%',
      left: '52%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      backgroundColor: "#8EC5FC",
      backgroundImage: "linear-gradient(62deg, #8EC5FC 0%, #E0C3FC 50%, #ffffff 100%)"

    },
};

export const UpdateGroupModal = ({fetchMessages}) => {
    
    const [isOpen, setIsOpen] = useState(false)
    
    const [groupName, setGroupName] = useState("")
    const [renameLoading, setRenameLoading] = useState("")
    const [search, setSearch] = useState("")
    const [searchResult, setSearchResult] = useState([]) //to store the search results
    const [loading, setLoading] = useState(false)

    const {selectedChat, setSelectedChat, user, fetchAgain, setFetchAgain} = ChatState()
    
    // To open and close the modal   
    const toggle = () => (
      setIsOpen(prevState => !prevState)
    )
    
    // To rename the group
    const handleRename = async() => {
        if(!groupName) {
            setRenameLoading(false)
            errorPopup("Group Name cannot be blank.")
            return
        }

        try {
            setRenameLoading(true)
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                }
            }
            const {data} = await axios.put('/api/chats/rename', {chatId: selectedChat._id, chatName: groupName}, config)
            
            setSelectedChat(data)
            setFetchAgain(!fetchAgain) //again fetching the chats
            setRenameLoading(false)
        } catch (error) {
            setRenameLoading(false)
            errorPopup("Error Occured!")
        }
        setGroupName("") //back to original state
    }

    // To remove user from the group
    const handleDelete = async(user1) => {
        // if only the admin, then only one can remove other users
        if(user._id !== selectedChat.groupAdmin._id && user1._id !== user._id) {
            setLoading(false)
            errorPopup("Only admins can remove user")
            return
        }
        try {
            setLoading(true)
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            }

            const {data} = await axios.put(
                                        '/api/chats/groupRemove', 
                                        {chatId: selectedChat._id, userId: user1._id}, 
                                        config)
            
            // If the user has left the group, then make the selectedChat as empty
            user1._id === user._id ? setSelectedChat() : setSelectedChat(data)
            setFetchAgain(!fetchAgain);                           
            fetchMessages(); //so that the messages get refreshed
            setLoading(false);
        } catch (error) {
            
        }
    }
    
    // To search users to add to the group    
    useEffect(() => {
      const delayDebounceFn = setTimeout(async() => {
      
      try {
        setLoading(true)
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`
          }
        }
        // Fetching the data from the backend
        const {data} = await axios.get(`/api/user?search=${search}`,config)
        setLoading(false)
       
        if(data.length > 0) {
        setSearchResult(data) //storing the fetched data in searchResult
        } else {
          setSearchResult(["No user found"])
        }

      } catch (error) {
        errorPopup("Error Occured! Failed to Load the Search Results")
        setLoading(false)
      }
    })
    return () => clearTimeout(delayDebounceFn)
    }, [search])
    
    // To add the user to the group
    const handleAddUser = async(userToAdd) => {
        if (selectedChat.users.find((u) => u._id === userToAdd._id)) {
            setLoading(false)
            errorPopup("User already in the group.")
            return
        }
        
        if(user._id !== selectedChat.groupAdmin._id) {
            setLoading(false)
            errorPopup("Only admin can add users")
            return
        }
        
        try {
            setLoading(true)
            
            const config = {
                headers: {
                  Authorization: `Bearer ${user.token}`,
                },
            };

            const {data} = await axios.put('/api/chats/groupAdd', {chatId: selectedChat._id, userId: userToAdd._id}, config)

            setSelectedChat(data)
            setFetchAgain(!fetchAgain)
            setLoading(false)

        } catch (error) {
            setLoading(false)
            errorPopup("Error occured! Unable to add user to the group")
        }
    }
    

    return (
    <div>
        <button onClick={toggle} className='plane-btn'>
          <img className='edit-icon' src="../assets/edit.png" alt="" />
          <p className="edit-label">Edit Group</p>
        </button>

        <Modal
          isOpen={isOpen}
          onRequestClose={toggle}
          style={customStyles}
        >
            <div className='modal-contents'>
              <img onClick={toggle} className="close-icon" src="../assets/close.png" alt="" />
              
              <section className='modal-header'>
                <h2>{selectedChat.chatName}</h2>
              </section>
              
            {/* Selected users */}
            <section className='selected-users'>
                {selectedChat.users.map(user => (
                  <UserBadge
                  key={user._id}
                  user={user}
                  handleFunction={()=>handleDelete(user)}
                  />
                ))}
            </section>
            
            <form className='group-modal-form'>
                <div className='rename-tab'>
                    <input 
                        name="groupName"
                        placeholder='Group Name'
                        value={groupName}
                        onChange={(e) => setGroupName(e.target.value)}
                    />
                    <button 
                        className='update-btn'
                        onClick={handleRename}
                        >
                        Update
                    </button>
                </div>
                {renameLoading && <img className='spinner' src='../assets/spinner.gif' alt="spinner"></img> }
                <input 
                    name="selectedUsers"
                    placeholder='Add User to group'
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />

            </form>
            {loading ?
                    <img className='spinner' src='../assets/spinner.gif' alt="spinner"></img> 
                : (
                  search!=="" && (
                  searchResult[0] !== "No user found" ?
                  <div className='user-list'>
                    {searchResult?.slice(0,3).map(user => (
                    <UserListItem key={user._id} user={user} handleFunction={()=>handleAddUser(user)}/>
                ))}
                </div> : searchResult[0]
                ))
            }

            <button 
                className='create-btn' 
                style={{backgroundColor: "#d52941"}} 
                onClick={() => handleDelete(user)}
            >
                Exit Group
            </button>
               
            </div>
        </Modal>
    </div>
  )
}
