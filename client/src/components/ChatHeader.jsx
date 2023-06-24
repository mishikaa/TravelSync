import React from 'react'
import { ChatState } from '../Context_API/chatProvider'
import { getSender } from '../config/chatLogic'
import Profile_Menu from './miscellaneous/Profile_Menu'
import { UpdateGroupModal } from './Group/UpdateGroupModal'

const styles = {
    container: {
        display: "flex",
        width: "100%",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "#e0aaff",
        borderRadius: "5px 5px 0 0",
        paddingBottom: "0.5rem",
        paddingTop: "0.5rem",
        height: "40px"
    },
    title: {
        padding: "0.5rem"
    }
}

export const ChatHeader = ({fetchMessages}) => {
    const {user, selectedChat} = ChatState()

    return (
    <div style={styles.container}>
        {
            !selectedChat.isGroupChat ? 
                <>
                    <h3 style={styles.title} className='sender'>
                        {getSender(user, selectedChat.users).username}
                    </h3>
                    {/* <Profile_Menu style={styles.profile} sender={getSender(user, selectedChat.users)}/> */}
                </>
             :
                <h3 style={styles.title}>{selectedChat.chatName}</h3>
        }
        {selectedChat.isGroupChat &&
        <UpdateGroupModal fetchMessages={fetchMessages}/>
        }
    </div>
  )
}
