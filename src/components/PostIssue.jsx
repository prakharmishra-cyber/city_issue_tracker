import React, { useEffect, useState, useLayoutEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Map from 'mapmyindia-react';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Dropdown } from 'primereact/dropdown';
import { storage } from "../firebase_config.js";
import { ref, uploadBytes } from "firebase/storage";


const PostIssue = () => {

    const navigate = useNavigate();
    const [centerLat, setCenterLat] = useState(28.61);
    const [centerLng, setCenterLng] = useState(77.23);
    const [issue_image, setIssue_Image] = useState(null);
    const [url, setUrl] = useState('');
    const InputRef = useRef();
    const [selectedDepartment, setSelectedDepartment] = useState(null);
    const departments = [
        { name: 'Electricity', code: 'ELY' },
        { name: 'Sewage', code: 'SWG' },
        { name: 'Road', code: 'RD' },
        { name: 'Cleaning', code: 'CLG' },
        { name: 'Garbage', code: 'GRB' }
    ];

    useLayoutEffect(() => {
        navigator.geolocation.getCurrentPosition(function (position) {
            setCenterLat(position.coords.latitude);
            setCenterLng(position.coords.longitude);
        });
    }, []);

    const onChangee = (e) => {
        const files = e.target.files;
        console.log(files[0]);
        files.length > 0 && setUrl(URL.createObjectURL(files[0]));
        setIssue_Image(files[0]);

    };

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
                                console.log(e.target.getLatLng());
                                setCenterLat(e.target.getLatLng().lat);
                                setCenterLng(e.target.getLatLng().lng);
                            }
                        }
                    ]}
                />
                <div className="text-white text-xs text-right py-1">*Drag the marker to choose the location.</div>
                <div className="w-full my-2">
                    <span className="p-float-label">
                        <InputText id="username" className='w-full' />
                        <label htmlFor="username" className='text-white'>Issue Title</label>
                    </span>
                </div>
                <InputTextarea placeholder='Describe the issue' className='my-1' rows={5} cols={30} />
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