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


function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/login" element={<Login/>} />
        <Route path="/register" element={<Register/>} />
        <Route path="/forgot_password" element={<ForgotPassword/>}/>
        <Route path="/home" element={<Home/>}/>
        <Route path="/feed" element={<Feed/>}/>
        <Route path="/mine" element={<Mine/>}/>
        <Route path="/post_issue" element={<PostIssue/>}/>
      </Routes>
    </div>
  );
}

export default App;
