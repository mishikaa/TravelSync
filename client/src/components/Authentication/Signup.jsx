import { useState } from 'react';
import './auth.css'
import {useNavigate} from 'react-router-dom'
import axios from 'axios'
import {errorPopup, successPopup} from '../popup'; //for popup messages

const Signup = (props) => {
  const [show, setShow] = useState(false)
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    profilePic: ''
  })  
  
  const [isLoading, setLoading] = useState(false)
  const navigate = useNavigate() 
  
  // Toggle password show or hide option
  const toggleShow = () => {
    setShow(prevShow => !prevShow)
  }

  const handleChange = (event) => {
    const {name, value} = event.target;
    setFormData(prevFormData => {
      return {
        ...prevFormData,
        [name]: value
      }
    })
  }

  const submitHandler = async(event) => {
    event.preventDefault() //to prevent reloading the page on submitting the form
    setLoading(true)
    
    // if any of the required fields is not filled 
    if(!formData.username || !formData.email || !formData.password || !formData.confirmPassword) {
      errorPopup('Kindly fill all the required fields!')
      
      setLoading(false) //stop the loading
      return
    }
    
    // if the entered password is not same as the confirm pasword field
    if(formData.password !== formData.confirmPassword) {
      errorPopup('Passwords do not match. Please try again!')

      setLoading(false)
      return
    }
  
    // If the data has been entered correctly
    try {
      const config = {
        headers: {
          'Content-type': "application/json"    
        }
      }
      const {data} = await axios.post(
        "/api/user",
        {username: formData.username, email: formData.email, password: formData.password, profilePic: formData.profilePic},
        config
      ); 
      successPopup('Registration successful!')
      
      localStorage.setItem('userInfo', JSON.stringify(data)) // Saving the user's info in the local storage
      setLoading(false)
      navigate('/home') // Navigate to the /home page
      }
    catch(error) {
      errorPopup(`Error Occured! ${error.response.data.message}`)
      
      setLoading(false)
    }
}

  return (
    <div className='box'>
      <form>
        <span className="text-center">Signup</span>
        <div className="input-container">
		    <input 
                type="text"
                required
                name="username"
                value={formData.username}
                onChange={handleChange}
            />
		    <label>Username <span className="required"> * </span></label>		
	    </div>
        <div className="input-container">
		    <input 
                type="email"
                required
                name="email"
                value={formData.email}
                onChange={handleChange}
            />
		    <label>Email <span className="required"> * </span></label>		
	    </div>
        <div className="input-container">
            <input 
                type={show ? "text" : "password"}
                required
                name="password"
                value={formData.password}
                onChange={handleChange}
            />
            <label>Password <span className="required"> * </span></label>		
            <img className="visibility" onClick={toggleShow} src={show ? "../assets/visibility/not-visible.png" : "../assets/visibility/visible.png"} alt="visibility_icon" />

        </div>
        <div className="input-container">
            <input 
                type= "password"
                required
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
            />
            <label>Confirm Password <span className="required"> * </span></label>		
        </div>
    
        <button 
          className="btn signup" 
          onClick={submitHandler}
          disabled={isLoading}
        >
          {/* If isLoading = true, then display the spinner */}
          {isLoading && <img className='spinner' src='../assets/spinner.gif' alt="spinner"></img>}
          Signup
        </button>
        <div>
        <span>Already have an account? <a onClick={props.handleClick}>Login</a></span>
      </div>
      </form>

    </div>
  )
}

export default Signup;
