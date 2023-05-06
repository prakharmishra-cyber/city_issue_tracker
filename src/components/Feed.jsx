import React, { useState } from 'react'
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getDistanceFromLatLonInKm } from '../utility/distance.js';
import axios from 'axios';
import BASE_URL from '../api_url';
import { Buffer } from 'buffer';
import { Tag } from 'primereact/tag';
import { Divider } from 'primereact/divider';
import { Inplace, InplaceDisplay, InplaceContent } from 'primereact/inplace';
import Map from 'mapmyindia-react';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import StepContent from '@mui/material/StepContent';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

const steps = [
    {
        label: 'Select campaign settings',
        description: `For each ad campaign that you create, you can control how much
                you're willing to spend on clicks and conversions, which networks
                and geographical locations you want your ads to show on, and more.`,
    },
    {
        label: 'Create an ad group',
        description:
            'An ad group contains one or more ads which target a shared set of keywords.',
    },
    {
        label: 'Create an ad',
        description: `Try out different ad text to see what brings in the most customers,
                and learn how to enhance your ads using features like ad extensions.
                If you run into any problems with your ads, find out how to tell if
                they're running and how to resolve approval issues.`,
    },
];

const Feed = () => {
    const navigate = useNavigate();
    const [issue_radi, setIssue_radi] = useState(2);
    const [unfilteredIssues, setUnfilteredIssues] = useState([]);
    const [filteredIssues, setfilteredIssues] = useState([]);
    const [centerLat, setCenterLat] = useState(28.61);
    const [centerLng, setCenterLng] = useState(77.23);
    const [issues, setIssues] = useState([]);
    const [mapVisible, setMapVisible] = useState(false);
    const [stepper_visible, setStepper_Visible] = useState(false);
    const [activeStep, setActiveStep] = useState(0);
    const [currentStatusList, setCurrentStatusList] = useState([]);

    const handleLike = async (id) => {
        const response = await axios.post(`${BASE_URL}/post_like`, {
            issue_id: id
        }).then((res) => res.data);
        getIssuesLoaded();
    }

    const handleDislike = async (id) => {
        const response = await axios.post(`${BASE_URL}/post_dislike`, {
            issue_id: id
        }).then((res) => res.data);
        getIssuesLoaded();
    }

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleReset = () => {
        setActiveStep(0);
    };

    const getIssuesLoaded = async () => {
        const response = await axios.get(`${BASE_URL}/get_all_issues`).then((res => res.data));
        console.log(response);
        setUnfilteredIssues(response);
        const temp = response.
            filter(element => getDistanceFromLatLonInKm(element.marker_pos.lat, element.marker_pos.lng, centerLat, centerLng) <= issue_radi);
        setfilteredIssues(temp);
    }

    useEffect(() => {
        getIssuesLoaded();
    }, [issue_radi]);

    useEffect(() => {
        getIssuesLoaded();
    }, []);

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(function (position) {
            setCenterLat(position.coords.latitude);
            setCenterLng(position.coords.longitude);
        });
    }, []);

    return (
        <div className=''>
            <div className=''>
                <div className='p-3 text-4xl animate-pulse pl-5 text-white'>
                    <div className='flex gap-1 items-center'>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"
                            className="w-8 h-8">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z" />
                        </svg>
                        <div>Your Feed</div>
                    </div>
                </div>

                <div className='w-full text-lg ml-3 text-white'>
                    Issue Radius : {issue_radi} k.m
                </div>

                <div className='w-full flex items-center justify-center'>
                    <select defaultValue={2} name="issue_radi" id="issue_radi" className='w-full p-2 rounded-md mx-3' onChange={e => setIssue_radi(e.target.value)}>
                        <option value={0.2}>200 m</option>
                        <option value={0.5}>500 m</option>
                        <option value={2}>2 k.m</option>
                        <option value={5}>5 k.m</option>
                        <option value={10}>10 k.m</option>
                        <option value={15}>15 k.m</option>
                    </select>
                </div>

                <div className='flex mt-4 flex-col gap-4 justify-center items-center mb-20'>
                    {
                        filteredIssues.map((element, index) => {
                            return (
                                <div key={index} className='p-3 w-[90%]  bg-white text-vlt border border-gray-200 shadow-sm rounded-lg shadow-gray-200'>
                                    <div className="flex justify-between">
                                        <div className='text-2xl'>{element.issue_title}</div>
                                        <div className='flex gap-2 '>
                                            <div onClick={() => handleLike(element._id)} className='flex hover:bg-gray-300 flex-col gap-1 items-center px-4 py-1 rounded-full border border-gray-200'>
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.633 10.5c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 012.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 00.322-1.672V3a.75.75 0 01.75-.75A2.25 2.25 0 0116.5 4.5c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 01-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 00-1.423-.23H5.904M14.25 9h2.25M5.904 18.75c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 01-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 10.203 4.167 9.75 5 9.75h1.053c.472 0 .745.556.5.96a8.958 8.958 0 00-1.302 4.665c0 1.194.232 2.333.654 3.375z" />
                                                </svg>
                                                <div className='text-xs'>{element.likes}</div>
                                            </div>
                                            <div onClick={() => handleDislike(element._id)} className='flex hover:bg-gray-300 flex-col gap-1 items-center px-4 py-1 rounded-full border border-gray-200'>
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 15h2.25m8.024-9.75c.011.05.028.1.052.148.591 1.2.924 2.55.924 3.977a8.96 8.96 0 01-.999 4.125m.023-8.25c-.076-.365.183-.75.575-.75h.908c.889 0 1.713.518 1.972 1.368.339 1.11.521 2.287.521 3.507 0 1.553-.295 3.036-.831 4.398C20.613 14.547 19.833 15 19 15h-1.053c-.472 0-.745-.556-.5-.96a8.95 8.95 0 00.303-.54m.023-8.25H16.48a4.5 4.5 0 01-1.423-.23l-3.114-1.04a4.5 4.5 0 00-1.423-.23H6.504c-.618 0-1.217.247-1.605.729A11.95 11.95 0 002.25 12c0 .434.023.863.068 1.285C2.427 14.306 3.346 15 4.372 15h3.126c.618 0 .991.724.725 1.282A7.471 7.471 0 007.5 19.5a2.25 2.25 0 002.25 2.25.75.75 0 00.75-.75v-.633c0-.573.11-1.14.322-1.672.304-.76.93-1.33 1.653-1.715a9.04 9.04 0 002.86-2.4c.498-.634 1.226-1.08 2.032-1.08h.384" />
                                                </svg>
                                                <div className='text-xs'>{element.dislikes}</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='text-gray-400 text-xs py-1'>{new Date(element.posted_on).toDateString()}</div>
                                    <div className="flex justify-between">
                                        <Tag className='p-tag' value={element.selectedDepartment.name}></Tag>
                                        {/* <div className='border border-blue-400 text-blue-400 py-2 px-2'>{element.selectedDepartment.name}</div> */}
                                        <Button onClick={() => setMapVisible(true)} className="text-xs">
                                            <i className="pi pi-map" style={{ fontSize: '1rem', color: 'white', paddingRight: '10px' }}></i>
                                            view location
                                        </Button>
                                    </div>
                                    <Divider />
                                    <Inplace>
                                        <InplaceDisplay className='bg-gray-200 p-2 rounded-md'>{element.issue_description.substring(0, 50)} <span className='text-red-600'>read more...</span></InplaceDisplay>
                                        <InplaceContent>
                                            <p className="m-0 bg-gray-200 p-2">
                                                {element.issue_description}
                                            </p>
                                        </InplaceContent>
                                    </Inplace>

                                    <img src={`data:image/jpeg;base64,${new Buffer.from(element.issue_image.data).toString('base64')}`}
                                        alt="issue_image"
                                        className='w-[90%] p-2 m-2 border border-gray-300 rounded-md'
                                    />

                                    <div className='mx-auto text-center mt-2' onClick={() => {
                                        setCurrentStatusList(element.issue_status);
                                        setStepper_Visible(true)
                                    }}>
                                        <Button icon='pi pi-globe'><span className='ml-2'>Track Issue Status</span></Button>
                                    </div>

                                    <Dialog header="Issue Location" visible={mapVisible} style={{ width: '90%' }} onHide={() => setMapVisible(false)}>
                                        <div className='w-full mt-4 flex flex-col gap-2'>
                                            <div className=''>
                                                <Map
                                                    title="Issue Location"
                                                    markers={[
                                                        {
                                                            center: [element.marker_pos.lat, element.marker_pos.lng],
                                                            position: [element.marker_pos.lat, element.marker_pos.lng],
                                                            draggable: false,
                                                            title: "Issue Position",
                                                        }
                                                    ]}
                                                />
                                            </div>
                                        </div>
                                    </Dialog>

                                    <Dialog header="Issue Status" visible={stepper_visible} style={{ width: '90%' }} onHide={() => setStepper_Visible(false)}>
                                        <div className='w-full mt-4 flex flex-col gap-2'>
                                            <Box sx={{ maxWidth: 400 }}>
                                                <Stepper activeStep={activeStep} orientation="vertical">
                                                    {currentStatusList.map((step, index) => (
                                                        <Step key={step.label}>
                                                            <StepLabel
                                                                optional={
                                                                    index === 2 ? (
                                                                        <Typography variant="caption">Last step</Typography>
                                                                    ) : null
                                                                }
                                                            >
                                                                {step.label}
                                                            </StepLabel>
                                                            <StepContent>
                                                                <Typography>{step.description}</Typography>
                                                                <Box sx={{ mb: 2 }}>
                                                                    <div className='flex gap-4 mt-2'>
                                                                        <Button

                                                                            onClick={handleNext}
                                                                            className="mt-1 mr-1"
                                                                        >
                                                                            {index === currentStatusList.length - 1 ? 'Finish' : 'Continue'}
                                                                        </Button>
                                                                        <Button
                                                                            disabled={index === 0}
                                                                            onClick={handleBack}
                                                                            className="mt-1 mr-1"
                                                                        >
                                                                            Back
                                                                        </Button>
                                                                    </div>
                                                                </Box>
                                                            </StepContent>
                                                        </Step>
                                                    ))}
                                                </Stepper>
                                                {activeStep === currentStatusList.length && (
                                                    <Paper square elevation={0} sx={{ p: 3 }}>
                                                        <Typography>All steps completed - you&apos;re finished</Typography>
                                                        <Button onClick={handleReset} className="mt-1 mr-1">
                                                            Reset
                                                        </Button>
                                                    </Paper>
                                                )}
                                            </Box>
                                        </div>
                                    </Dialog>


                                </div>
                            )
                        })
                    }
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

export default Feed