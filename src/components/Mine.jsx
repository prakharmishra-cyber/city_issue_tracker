import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import BASE_URL from '../api_url';
import { Button } from 'primereact/button';


const Mine = () => {
    const navigate = useNavigate();
    const [user_data, setUser_data] = useState(null);
    const [address, setAddress] = useState({
        houseno: '',
        street: '',
        city: '',
        zip: ''
    });
    const [user_details, setUser_details] = useState({
        aadharNo:'',
        user_name:''
    })
    const [form_visible, setForm_visible] = useState(false);
    const [userform_visible, setUserForm_visible] = useState(false);
    const [houseno, setHouseno] = useState('');
    const [street, setStreet] = useState('');
    const [city, setCity] = useState('');
    const [zip, setZip] = useState('');
    const [user_name, setUser_name] = useState('');
    const [aadharNo, setAadharNo] = useState('');

    const get_uesr_details = async () => {
        const data = await axios.post(`${BASE_URL}/get_user_details`, {
            user_id: localStorage.getItem('user_id'),
        }).then(res => res.data);
        setUser_data(data.response);
        setAddress(data.response.address);
        setUser_details(data.response.userDetails)
        console.log(data.response);
    }

    const handleAddressUpdate = async () => {
        console.log({
            houseno, street, city, zip
        })
        await axios.post(`${BASE_URL}/update_address`, {
            user_id: localStorage.getItem('user_id'),
            user_address: {
                houseno, street, city, zip
            }
        }).then(() => {
            setForm_visible(false);
            get_uesr_details();
            console.log('Address updated successfully');
        })
    }

    const handleUserUpdate = async () => {
        console.log({
            user_name, aadharNo
        })
        await axios.post(`${BASE_URL}/update_users_details`, {
            user_id: localStorage.getItem('user_id'),
            user_details: {
                user_name, aadharNo
            }
        }).then(() => {
            setUserForm_visible(false);
            get_uesr_details();
            console.log('User Details updated successfully');
        })
    }

    const handleSignOut = () => {
        localStorage.clear();
        navigate('/login');
    }

    useEffect(() => {
        get_uesr_details();
    }, []);


    return (
        <div>
            <div className='text-white'>
                <div className='flex flex-col justify-center items-center mt-5'>
                    <div className='bg-white rounded-full shadow-sm shadow-white'>
                        <i className="pi pi-user" style={{ fontSize: '5.5rem', color: 'black', padding: '20px' }}></i>
                    </div>
                    <div className='text-2xl pt-3 mb-4 flex flex-col items-center justify-center
                     border-2 shadow-sm shadow-white border-white rounded-md px-4 py-1 mt-3'>
                        <div className='text-3xl mb-2'>{user_details && user_details.user_name}</div>
                        <div>{user_data && user_data.mobno}</div>
                    </div>
                </div>

                <Dialog header="Update Address Details" visible={form_visible} style={{ width: '90%' }} onHide={() => setForm_visible(false)}>
                    <div className='w-full mt-4 flex flex-col gap-2'>
                        <InputText
                            placeholder={address.houseno === '' ? 'enter house no.' : address.houseno}
                            onChange={e => setHouseno(e.target.value)}

                        />

                        <InputText
                            placeholder={address.street === '' ? 'enter street name' : address.street}
                            onChange={e => setStreet(e.target.value)}

                        />

                        <InputText
                            placeholder={address.city === '' ? 'enter city' : address.city}
                            onChange={e => setCity(e.target.value)}

                        />

                        <InputText
                            placeholder={address.zip === '' ? 'enter zip code' : address.zip}
                            onChange={e => setZip(e.target.value)}

                        />
                    </div>
                    <div className='mx-auto mt-2 text-center'>
                        <Button onClick={handleAddressUpdate} >Submit</Button>
                    </div>
                </Dialog>

                <Dialog header="Update Personal Details" visible={userform_visible} style={{ width: '90%' }} onHide={() => setUserForm_visible(false)}>
                    <div className='w-full mt-4 flex flex-col gap-2'>
                        <InputText
                            placeholder={user_details.user_name === '' ? 'enter user name' : user_details.user_name}
                            onChange={e => setUser_name(e.target.value)}

                        />

                        <InputText
                            placeholder={user_details.aadharNo === '' ? 'enter aadhar no.' : user_details.aadharNo}
                            onChange={e => setAadharNo(e.target.value)}

                        />
                    </div>
                    <div className='mx-auto mt-2 text-center'>
                        <Button onClick={handleUserUpdate} >Submit</Button>
                    </div>
                </Dialog>

                <div className="options flex flex-col gap-3 m-3 rounded-xl p-2 bg-white">
                    <div className='flex justify-between bg-white items-center mx-2' onClick={() => setUserForm_visible(true)}>
                        <div className='text-black flex gap-1 items-center cursor-pointer'>
                            <i className="pi pi-user" style={{ fontSize: '1.5rem', color: 'black', padding: '2px' }}></i>
                            <div>Update Personal Details</div>
                        </div>
                        <div>
                            <i className="pi pi-angle-double-right" style={{ fontSize: '1.5rem', color: 'black', padding: '5px' }}></i>
                        </div>
                    </div>

                    <div className='flex justify-between bg-white items-center mx-2' onClick={() => setForm_visible(true)}>
                        <div className='text-black flex gap-1 items-center cursor-pointer'>
                            <i className="pi pi-home" style={{ fontSize: '1.5rem', color: 'black', padding: '2px' }}></i>
                            <div>Update Address</div>
                        </div>
                        <div>
                            <i className="pi pi-angle-double-right" style={{ fontSize: '1.5rem', color: 'black', padding: '5px' }}></i>
                        </div>
                    </div>

                    <div className='flex justify-between bg-white items-center mx-2' onClick={handleSignOut}>
                        <div className='text-black flex gap-1 items-center cursor-pointer'>
                            <i className="pi pi-sign-out" style={{ fontSize: '1.5rem', color: 'black', padding: '2px' }}></i>
                            <div>Sign Out</div>
                        </div>
                        <div>
                            <i className="pi pi-angle-double-right" style={{ fontSize: '1.5rem', color: 'black', padding: '5px' }}></i>
                        </div>
                    </div>
                </div>


            </div>
            <div className="fixed bottom-0 z-10 bg-gray-50 rounded-none  flex overflow-x-hidden text-gray-600  mx-auto mt-2 border-2 border-gray-400 w-full overflow-y-hidden">
                <div className="flex flex-row justify-around items-center w-full py-2 font-normal  text-sm">
                    <div className='cursor-pointer mx-2 flex flex-col justify-center items-center'
                        onClick={() => navigate('/home')}>
                        <i className="pi pi-home" style={{ color: 'slateblue' }}></i>
                        <div>Home</div>
                    </div>

                    <div className='cursor-pointer mx-2 flex flex-col justify-center items-center'
                        onClick={() => navigate('/feed')}>
                        <i className="pi pi-list" style={{ color: 'slateblue' }}></i>
                        <div>Feed</div>
                    </div>
                    <div className='cursor-pointer mx-2 flex flex-col justify-center items-center '
                        onClick={() => navigate('/post_issue')}>
                        <i className="pi pi-send" style={{ color: 'slateblue' }}></i>
                        <div>Post Issue</div>
                    </div>

                    <div className=' cursor-pointer mx-2 flex flex-col justify-center items-center'
                        onClick={() => navigate('/mine')}>
                        <i className="pi pi-user" style={{ color: 'slateblue' }}></i>
                        <div>Mine</div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Mine