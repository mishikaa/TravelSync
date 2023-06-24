import { useState } from 'react';
import './auth.css'
import {useNavigate} from 'react-router-dom'
import axios from 'axios'
import {errorPopup, successPopup} from '../popup'; //for popup messages
import {motion} from 'framer-motion';


const Login = (props) => {
  const [show, setShow] = useState(false) //for password
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    profilePic: ''
  })  
  const [isLoading, setLoading] = useState(false)
  
  const navigate = useNavigate()

  const handleChange = (event) => {
    const {name, value} = event.target;
    setFormData(prevFormData => {
      return {
        ...prevFormData,
        [name]: value
      }
    })
  } 

  const toggleShow = () => {
    setShow(prevShow => !prevShow)
  }
  
  const submitHandler = async(event) => {
    event.preventDefault()
    setLoading(true)


    if(!formData.email || !formData.password) {
      errorPopup('Kindly fill all the required fields!')
      
      setLoading(false)
      return
    }
 
    // console.log(formData.email, formData.password)

  try {
    const config = {
      headers: {
        'Content-type': "application/json"    
      }
    };

    const {data} = await axios.post(
      "/api/user/login",
      {email: formData.email, password: formData.password, profilePic: formData.profilePic},
      config
    ); 
    
    // console.log(JSON.stringify(data))

    successPopup('Login successful!')

    localStorage.setItem('userInfo', JSON.stringify(data))
    setLoading(false)
    navigate('/chats') //Navigate to /chats once logged in
    }
    catch(error) {
      errorPopup(`Error Occured! ${error.response.data.message}`)
      
      setLoading(false)
    }
  };

  return (
    <div className='box'>
      <form>
        <span className="text-center">login</span>
        <div className="input-container">
		    <input 
                type="email"
                required
                name="email"
                onChange={handleChange}
                value={formData.email}
            />
		    <label>Email <span className="required">*</span></label>		
	    </div>
        <div className="input-container">
            <input
                type={show ? "text" : "password"}
                required
                name="password"
                onChange={handleChange}
                value={formData.password}
            />
            <label>
              Password 
              <span className="required"> * </span>
            </label>		
            <img className="visibility" onClick={toggleShow} src={show ? "../assets/visibility/not-visible.png" : "../assets/visibility/visible.png"} alt="visibility_icon" />
        </div>
        <motion.button 
          whileHover={{
             scale: 1.01,
             textShadow: "0px 0px 8px rgb(255,255,255)"
          }}
          className="btn login" 
          onClick={submitHandler}
          disabled={isLoading}
        >
          {isLoading && <img className='spinner' src='../assets/spinner.gif' alt="spinner"></img>}
          Login
        </motion.button>
        <motion.button 
          whileHover={{
           scale: 1.01,
           textShadow: "0px 0px 8px rgb(255,255,255)"
          }}
          className="btn guestLogin"
          onClick={(event) => {
            event.preventDefault()
            setFormData({
              email : "guest123@example.com",
              password: "qwertyasd"
            })
          }}
          disabled={isLoading}
        >
          Get Guest User Credentials
        </motion.button>
        <div>
          <span>Don't have an account? <a onClick={props.handleClick}>Signup</a></span>
        </div>
      </form>
    </div>
  )
}

export default Login;
