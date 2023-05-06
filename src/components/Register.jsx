import React, {useState} from 'react';
import { Calendar } from 'primereact/calendar';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import app_logo from '../images/app_logo.jpg';
import { useNavigate } from 'react-router-dom';
import BASE_URL from '../api_url.js';
import axios from 'axios';


const Register = () => {
  const [mobno, setmobno] = useState('');
  const [password, setPassword] = useState('');
  const [cpassword, setCpassword] = useState('');

  const navigate = useNavigate();

  const handleRegister = async() => {
    await axios.post(`${BASE_URL}/register`, {
      mobno,
      pwd:password
    }).then(({data})=>{
      console.log(data);
      localStorage.setItem('mobno', data.mobno);
      localStorage.setItem('pwd', data.pwd);
      localStorage.setItem('user_id', data._id);
    }).catch(()=>{
      console.log('Something went wrong!');
    })
    navigate('/home');
  }

  return (
    <div className="card flex flex-col items-center justify-center bg-[#111111] h-screen p-3">
      <div className="flex flex-col justify-center items-center gap-4 p-3 w-full">
        <img src={app_logo} alt="app_logo" className='animate-pulse' width={240} />
        
        <InputText placeholder="Enter your phone number" value={mobno} onChange={e => setmobno(e.target.value)} className='w-4/5' />
        <InputText placeholder="Enter your password" type="password" value={password} onChange={e => setPassword(e.target.value)} className='w-4/5' />
        <InputText placeholder="Confirm your password" type="password" value={cpassword} onChange={e => setCpassword(e.target.value)} className='w-4/5' />
        <div className="flex justify-center space-x-2 w-full mt-10">
          <button
            onClick={handleRegister}
            type="button"
            className="inline-block rounded bg-primary px-6 pt-2.5 pb-2 text-xs font-semibold uppercase leading-normal text-[#111111] bg-white w-4/5 shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)]">
            Register
          </button>
        </div>
        <div onClick={()=>navigate('/login')} className="text-white text-center cursor-pointer">
          Already have an account, Login!
        </div>
      </div>
    </div>
  )
}

export default Register