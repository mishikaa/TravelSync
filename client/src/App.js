import './App.css'
import {Route, Routes} from "react-router-dom";
import ChatPage from "./pages/chatpage";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';
import AuthPage from './pages/authpage';
import { HomePage } from './pages/homepage';

const App = () => {
    return (
        <div className="App">
            <ToastContainer />  
            <Routes>
                <Route exact path='/' element={ <AuthPage />} />
                <Route exact path='/home' element={ <HomePage />} />
                <Route exact path='/chats' element={ <ChatPage />}/>
            </Routes>
        </div>
    )
}

export default App;