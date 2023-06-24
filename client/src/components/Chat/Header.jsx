import './Header.css'
import Notification_Menu from '../miscellaneous/Notification_Menu';
import Profile_Menu from '../miscellaneous/Profile_Menu';

const Header = () => {
  
    return (
      <header className='sidedrawer'>
        <h2 className='title'>
          TravelSync
        </h2>
        <div className='action'>
          {/* <Notification_Menu /> */}
          {/* <Profile_Menu /> */}
        </div>
      </header>
    )
}

export default Header
