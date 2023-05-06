import './App.css';
import { Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import ForgotPassword from './components/ForgotPassword';
import "primereact/resources/themes/lara-light-indigo/theme.css";     
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";    
import Home from './components/Home';
import Feed from './components/Feed';
import Mine from './components/Mine';
import PostIssue from './components/PostIssue';
import './firebase_config.js';
import {useNavigate} from 'react-router-dom';
import { useEffect } from 'react';
import Dashboard from './components/Dashboard';

function Redirect({to}) {
  const navigate = useNavigate();
  useEffect(()=>{
    navigate(to);
  },[])
  return (
    <div>Home</div>
  )
}


function App() {
  return (
    <div className="App " >
      <Routes>
        <Route path='/' element={<Redirect to="/login"/>}/>
        <Route path="/login" element={<Login/>} />
        <Route path="/register" element={<Register/>} />
        <Route path="/forgot_password" element={<ForgotPassword/>}/>
        <Route path="/home" element={<Home/>}/>
        <Route path="/feed" element={<Feed/>}/>
        <Route path="/mine" element={<Mine/>}/>
        <Route path="/post_issue" element={<PostIssue/>}/>
        <Route path="/admin_dashboard" element={<Dashboard/>} />
      </Routes>
    </div>
  );
}

export default App;
