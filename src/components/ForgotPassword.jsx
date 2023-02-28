import React, { useState } from 'react';
import { Calendar } from 'primereact/calendar';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import app_logo from '../images/app_logo.jpg';
import { useNavigate } from 'react-router-dom';


const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const navigate = useNavigate();



    return (
        <div className="card flex flex-col  bg-[#111111] h-screen p-3">
            <div className="border rounded-md border-white shadow-lg shadow-white mx-auto flex flex-col justify-center items-center gap-4 p-5 w-4/5">
                <img src={app_logo} alt="app_logo" className='animate-pulse' width={240} />
                <InputText placeholder="Enter your email" value={email} onChange={e => setEmail(e.target.value)} className='w-4/5' />
                <div className="flex justify-center space-x-2 w-full mt-10">
                    <button
                        type="button"
                        className="inline-block rounded bg-primary px-6 pt-2.5 pb-2 text-xs font-semibold uppercase leading-normal text-[#111111] bg-white w-4/5 shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)]">
                        Send Password
                    </button>
                </div>
                <div onClick={() => navigate('/login')} 
                className="text-white text-center cursor-pointer mt-6">
                    Already have an account, login!
                </div>
            </div>
        </div>
    )
}

export default ForgotPassword