import React, { useState } from 'react';
import { Calendar } from 'primereact/calendar';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import app_logo from '../images/app_logo.jpg';
import { useNavigate } from 'react-router-dom';
import BASE_URL from '../api_url.js';
import axios from 'axios';

const Login = () => {

  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const [mobno, setmobno] = useState('');
  const [pwd, setpwd] = useState('');
  const [loading, setLoading] = useState(false);
  const [text, setText] = useState('Loading');
  const [toasterShow, setToasterShow] = useState(false);
  const [toasterText, setToasterText] = useState('');


  const handleLogin = async () => {
    
    await axios.post(`${BASE_URL}/login`, { mobno, pwd:password })
      .then(({ data }) => {
        if (data.user_details === null) {
          throw "Could not login/something went wrong";
        }
        console.log(data);
        localStorage.setItem('mobno', data.user_details.mobno);
        localStorage.setItem('pwd', data.user_details.pwd);
        localStorage.setItem('user_id', data.user_details._id);        
        navigate('/home');
      })
      .catch(error => {
        console.log(error);
      });
  }

  return (
    <div className="card flex flex-col items-center justify-center bg-[#111111] h-screen p-3">
      <div className="flex flex-col justify-center items-center gap-4 p-3 w-full">
        <img src={app_logo} alt="app_logo" className='animate-pulse' width={240} />

        <InputText placeholder="Enter your mobile number" value={mobno} onChange={e => setmobno(e.target.value)} className='w-4/5' />
        <InputText placeholder="Enter your password" type="password" value={password} onChange={e => setPassword(e.target.value)} className='w-4/5' />
        <div className="flex justify-center space-x-2 w-full mt-10">
          <button
            onClick={handleLogin}
            type="button"
            className="inline-block rounded bg-primary px-6 pt-2.5 pb-2 text-xs font-semibold uppercase leading-normal text-[#111111] bg-white w-4/5 shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)]">
            Login
          </button>
        </div>
        <div onClick={() => navigate('/register')} className="text-white text-center cursor-pointer">
          Don't have an account, register!
        </div>

        <div onClick={() => navigate('/forgot_password')} className="text-white text-center cursor-pointer">
          Forgot Password!
        </div>
      </div>
    </div>
  )
}

export default Login