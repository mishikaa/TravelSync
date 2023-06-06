import AvatarIcon from '../miscellaneous/Avatar'
import './UserListItem.css'

const UserListItem = ({user, handleFunction}) => {

    return (
        <div onClick={handleFunction} className="content">
            <div className="contact-card">
              <div className="firstinfo">
                <AvatarIcon user = {user} />
                <div className="profileinfo">
                  <h4>{user.username}</h4>
                  <p>{user.email}</p>
                </div>
              </div>
            </div>
        </div>

  )
}

export default UserListItem
