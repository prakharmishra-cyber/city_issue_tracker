import React, { useEffect, useState, useLayoutEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Map from 'mapmyindia-react';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { storage } from "../firebase_config.js";
import { ref, uploadBytes } from "firebase/storage";
import axios from 'axios';
import BASE_URL from  '../api_url.js';
import {Buffer} from 'buffer';
import { Toast } from 'primereact/toast';


const PostIssue = () => {

    const navigate = useNavigate();
    const [centerLat, setCenterLat] = useState(28.61);
    const [centerLng, setCenterLng] = useState(77.23);
    const [issue_image, setIssue_Image] = useState(null);
    const [marker_lat, setMarker_lat] = useState(28.61);
    const [marker_lng, setMarker_lng] = useState(77.23);
    const [marker_pos, setMarker_pos] = useState({});
    const [url, setUrl] = useState('');
    const [issue_title, setIssue_title] = useState('');
    const [issue_description, setIssue_description] = useState('');
    const InputRef = useRef();
    const [selectedDepartment, setSelectedDepartment] = useState(null);
    const departments = [
        { name: 'Electricity', code: 'ELY' },
        { name: 'Sewage', code: 'SWG' },
        { name: 'Road', code: 'RD' },
        { name: 'Cleaning', code: 'CLG' },
        { name: 'Garbage', code: 'GRB' }
    ];
    const toast = useRef(null);
    var marke_pos = {};

    useLayoutEffect(() => {
        navigator.geolocation.getCurrentPosition(function (position) {
            setCenterLat(position.coords.latitude);
            setCenterLng(position.coords.longitude);
        });
    }, []);

    const show = () => {
        toast.current.show({ severity: 'info', summary: 'Info', detail: 'Issue uploaded successfully' });
    };


    const onChangee = async(e) => {
        const files = e.target.files;
        console.log(files[0]);
        files.length > 0 && setUrl(URL.createObjectURL(files[0]));
        const temp_data = await files[0].arrayBuffer().then((output)=>output);
        setIssue_Image(temp_data);
    };

    const PostIssue = async () => {
        console.log({
            mobno:localStorage.getItem('mobno'),
            issue_image: Buffer.from(issue_image),
            issue_description,
            issue_title,
            selectedDepartment,
            marker_pos,
            likes:0,
            dislikes:0
        })
        
        
        await axios.post(`${BASE_URL}/post_an_issue`, {
            mobno:localStorage.getItem('mobno'),
            issue_image: Buffer.from(issue_image),
            issue_description,
            issue_title,
            selectedDepartment,
            marke_pos,
            likes:0,
            dislikes:0
        }).then(({data})=>{
            console.log(data);
            show();
        }).catch((error)=>{
            console.log(error);
        })
    }

    const handleRemoveImage = (e) => {
        setUrl('');
        console.log('This was clicked')
        setIssue_Image(null);

    }

    return (
        <div className='w-full flex flex-col items-center gap-1 bg-[#111111]  pt-10 pb-20'>
            <div className='w-full bg-white text-[#111111] text-center fixed z-[99999] top-0 py-2 font-medium shadow-sm shadow-white'>Post an Issue</div>
            <div className='w-[90%] flex flex-col text-white'>
                <div className='text-lg gap-1 border-b border-white p-1 my-1 flex items-center'>
                    <div>Set Issue Location </div>
                    <i className="pi pi-arrow-right animate-pulse" style={{ fontSize: '1rem' }}></i>
                </div>
                <Toast ref={toast} />
                <Map
                    title="Choose a Location"

                    markers={[
                        {
                            center: [centerLat, centerLng],
                            position: [centerLat, centerLng],
                            draggable: true,
                            title: "Marker title",
                            onClick: (e) => {
                                console.log("clicked ");
                            },
                            onDragend: (e) => {
                                console.log("dragend");
                                marke_pos = e.target.getLatLng();
                                // setMarker_pos(e.target.getLatLng());
                            }
                        }
                    ]}
                />
                <div className="text-white text-xs text-right py-1">*Drag the marker to choose the location.</div>
                <div className="w-full my-2">
                    <span className="p-float-label">
                        <InputText onChange={e => setIssue_title(e.target.value)} id="username" className='w-full' />
                        <label htmlFor="username" className='text-white'>Issue Title</label>
                    </span>
                </div>
                <InputTextarea onChange={e => setIssue_description(e.target.value)} placeholder='Describe the issue' className='my-1' rows={5} cols={30} />
                <div className=" relative  mt-2">
                    <label htmlFor="name-with-label" className="text-white bg-[#111111]">
                        Upload Supporting Images
                    </label>
                    <input
                        type="file"
                        id="name-with-label"
                        onChange={onChangee}
                        className=" rounded-lg border-transparent flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                        name="upload"
                        placeholder="Upload Paper"
                        ref={InputRef}
                        required
                    />
                    {url !== '' ?
                        (
                            <div onClick={handleRemoveImage} className=' w-[100px] relative mt-3 shadow-sm rounded-md shadow-white'>
                                <div className='absolute cursor-pointer right-[-5px] top-[-5px] text-[#111111] px-2 text-xl bg-white rounded-full'>x</div>
                                <img src={url} alt="some image" className='border opacity-40 border-gray-50 rounded-md' />
                            </div>
                        )
                        : null}
                    <div className='text-white text-md mt-2'>Choose a department</div>
                    <Dropdown value={selectedDepartment} onChange={(e) => {
                        setSelectedDepartment(e.value);
                    }} options={departments} optionLabel="name"
                        placeholder="Select a Department" className="w-full md:w-14rem" />
                    <div className="flex justify-center mt-2 w-full">
                        <Button label="Submit" className='w-full' onClick={PostIssue}/>
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

export default PostIssue