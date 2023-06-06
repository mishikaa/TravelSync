import { useState, useEffect } from 'react';
import Modal from 'react-modal';
import './GroupModal.css'
import { ChatState } from '../../Context_API/chatProvider';
import axios from 'axios';
import { errorPopup, successPopup } from '../popup';
import UserListItem from '../Chat/UserListItem';
import { UserBadge } from '../User Card/UserBadge';

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

export const GroupModal = () => {
  const [modalIsOpen, setIsOpen] = useState(false);
  
  const [groupName, setGroupName] = useState("")
  const [selectedUsers, setSelectedUsers] = useState([])
  
  const {user, chats, setChats} = ChatState()

  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(false)
  const [loadingNewGroup, setLoadingNewGroup] = useState(false)
  const [searchResult, setSearchResult] = useState([])

  // To open and close the modal   
  const openModal = () => (
    setIsOpen(true)
  )
  const closeModal = () => (
    setIsOpen(false)
  )

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
    //   console.log(data)
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
  const handleGroup = (userToAdd) => {
    if(selectedUsers.includes(userToAdd)) {
      errorPopup("User already added.")
      return
    }
    else {

    setSelectedUsers([...selectedUsers, userToAdd])
    }}

  // Delete the user that has been added
  const handleDelete = (userToBeDeleted) => {
    setSelectedUsers(selectedUsers.filter((user) => user._id !== userToBeDeleted._id))
  }
  
  
  // When the form is submitted
  const handleSubmit = async(event) => {
    event.preventDefault()
    
    if(!groupName || !selectedUsers) {
      setLoadingNewGroup(false)
      errorPopup("Please fill both the fields")
      return
    }

    try {
      setLoadingNewGroup(true)

      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        }
      }

      const {data} = await axios.post('/api/chats/group', {
        chatName: groupName, 
        // As it is a reference
        users: JSON.stringify(selectedUsers.map((u) => u._id))
      }, config)
      
      setLoadingNewGroup(false)
      setChats([data, ...chats])
      closeModal()

      successPopup("New group created!")
    } catch (error) {
      setLoadingNewGroup(false)
      errorPopup("Failed to create the chat.")
    }
  }

    return (
    <div>
        <button onClick={openModal} className='plane-btn'>
          <img className="group-chat-icon" src="../assets/group-chat.png" alt="create-group-chat" />
          <p className="group-label">New group</p>
        </button>

        <Modal
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          style={customStyles}
        >
            <div className='modal-contents'>
              <img onClick={closeModal} className="close-icon" src="../assets/close.png" alt="" />
              
              <section className='modal-header'>
                <img className="group-icon" src="../assets/group-chat.png" alt="create-group-chat" />
                <h2>Create A Group</h2>
              </section>
              
              <form className='modal-form'>
                <input 
                    name="groupName"
                    onChange={(e) => setGroupName(e.target.value)}
                    value={groupName}
                    placeholder='Group Name'
                />
                <input 
                    name="selectedUsers"
                    onChange={(e) => setSearch(e.target.value)}
                    value={search}
                    placeholder='Add users'
                />
                {/* Selected users */}
                <section className='selected-users'>
                {selectedUsers.map(user => (
                  <UserBadge
                  key={user.id}
                  user={user}
                  handleFunction={()=>handleDelete(user)}
                  />
                ))}
                </section>
                <button className='create-btn' onClick={handleSubmit}>Create Group</button>
                 {loadingNewGroup &&
                    <img className='spinner' src='../assets/spinner.gif' alt="spinner"></img>}
              </form>
              
                {loading ?
                    <img className='spinner' src='../assets/spinner.gif' alt="spinner"></img> 
                : (
                  search!=="" && (
                  searchResult[0] !== "No user found" ?
                  <div className='user-list'>
                    {searchResult?.slice(0,3).map(user => (
                    <UserListItem key={user._id} user={user} handleFunction={()=>handleGroup(user)}/>
                ))}
                </div> : searchResult[0]
                ))
                }
            </div>
        </Modal>
    </div>
  )
}
