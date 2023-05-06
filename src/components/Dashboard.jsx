import * as React from 'react';
import { useState, useEffect, useRef } from 'react';
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Link from '@mui/material/Link';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { Typography, FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PeopleIcon from '@mui/icons-material/People';
import BarChartIcon from '@mui/icons-material/BarChart';
import LayersIcon from '@mui/icons-material/Layers';
import AssignmentIcon from '@mui/icons-material/Assignment';
import BASE_URL from '../api_url';
import axios from 'axios';
import { Buffer } from 'buffer';
import { Tag } from 'primereact/tag';
import { Divider } from 'primereact/divider';
import { Inplace, InplaceDisplay, InplaceContent } from 'primereact/inplace';
import Map from 'mapmyindia-react';
import { InputText } from 'primereact/inputtext'
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import StepContent from '@mui/material/StepContent';
import { Toast } from 'primereact/toast';


function Copyright(props) {
    return (
        <Typography variant="body2" color="text.secondary" align="center" {...props}>
            {'Copyright © '}
            <Link color="inherit" href="http://localhost:3000/login">
                city issue tracker
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}

const drawerWidth = 240;

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
    ({ theme, open }) => ({
        '& .MuiDrawer-paper': {
            position: 'relative',
            whiteSpace: 'nowrap',
            width: drawerWidth,
            transition: theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
            }),
            boxSizing: 'border-box',
            ...(!open && {
                overflowX: 'hidden',
                transition: theme.transitions.create('width', {
                    easing: theme.transitions.easing.sharp,
                    duration: theme.transitions.duration.leavingScreen,
                }),
                width: theme.spacing(7),
                [theme.breakpoints.up('sm')]: {
                    width: theme.spacing(9),
                },
            }),
        },
    }),
);

const mdTheme = createTheme();

function DashboardContent() {
    const toast = useRef(null);
    const [open, setOpen] = React.useState(true);
    const [currentPage, setCurrentPage] = React.useState('update_issue_details');
    const [currentCity, setCurrentCity] = useState('Kanpur');
    const [issues, setIssues] = useState([]);
    const [mapVisible, setMapVisible] = useState(false);
    const [stepper_visible, setStepper_Visible] = useState(false);
    const [update_status_dialog, setUpdate_status_dialog] = useState(false);
    const [label, setLabel] = useState('');
    const [description, setDescription] = useState('');
    const [currentClickedId, setCurrentClickedId] = useState(null);
    const [currentStatusList, setCurrentStatusList] = useState([]);
    const toggleDrawer = () => {
        setOpen(!open);
    };

    const get_data = async () => {
        const response = await axios.get(`${BASE_URL}/get_all_issues`).then((res => res.data));
        console.log(response);
        setIssues(response.filter(e => e.city_name.toLowerCase() === currentCity.toLowerCase()));
    }

    const handleLike = async (id) => {
        const response = await axios.post(`${BASE_URL}/post_like`, {
            issue_id: id
        }).then((res) => res.data);
        get_data()
    }

    const handleDislike = async (id) => {
        const response = await axios.post(`${BASE_URL}/post_dislike`, {
            issue_id: id
        }).then((res) => res.data);
        get_data();
    }

    const [activeStep, setActiveStep] = React.useState(0);

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleReset = () => {
        setActiveStep(0);
    };

    const handleUpdateIssueStatus = async() => {
        const resp = await axios.post(`${BASE_URL}/update_issue_status`, {
            issue_id:currentClickedId,
            label:label+'|'+(new Date()).toDateString(),
            description
        }).then(({data})=>data);
        setUpdate_status_dialog(false);
        console.log(resp);
        if(resp.message==='Status Updated Successfully') {
            toast.current.show({ severity: 'info', summary: 'Success', detail: 'Status Updated Successfully' });
        }else {
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Something went wrong' });
        }
    }

    useEffect(() => {
        get_data();
    }, []);

    useEffect(() => {
        get_data();
    }, [currentCity]);

    return (
        <ThemeProvider theme={mdTheme}>
            <Toast ref={toast} />
            <Box sx={{ display: 'flex' }}>
                <CssBaseline />
                <AppBar position="absolute" open={open}>
                    <Toolbar
                        sx={{
                            pr: '24px', // keep right padding when drawer closed
                        }}
                    >
                        <IconButton
                            edge="start"
                            color="inherit"
                            aria-label="open drawer"
                            onClick={toggleDrawer}
                            sx={{
                                marginRight: '36px',
                                ...(open && { display: 'none' }),
                            }}
                        >
                            <MenuIcon />
                        </IconButton>
                        <Typography
                            component="h1"
                            variant="h6"
                            color="inherit"
                            noWrap
                            sx={{ flexGrow: 1 }}
                        >
                            Tracker Dashboard
                        </Typography>
                        <IconButton color="inherit">
                            <Badge badgeContent={4} color="secondary">
                                <NotificationsIcon />
                            </Badge>
                        </IconButton>
                    </Toolbar>
                </AppBar>
                <Drawer variant="permanent" open={open}>
                    <Toolbar
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'flex-end',
                            px: [1],
                        }}
                    >
                        <Typography component='div' sx={{ fontSize: '18px', color: 'gray' }}>City Issue Tracker</Typography>
                        <IconButton onClick={toggleDrawer}>
                            <ChevronLeftIcon />
                        </IconButton>
                    </Toolbar>
                    <Divider />
                    <List component="nav">
                        <MainListItems setCurrentPage={setCurrentPage} />
                        {/* <Divider sx={{ my: 1 }} />
                        {secondaryListItems} */}
                    </List>
                </Drawer>
                <Box
                    component="main"
                    sx={{
                        backgroundColor: (theme) =>
                            theme.palette.mode === 'light'
                                ? theme.palette.grey[100]
                                : theme.palette.grey[900],
                        flexGrow: 1,
                        height: '100vh',
                        overflow: 'auto',
                    }}
                >
                    <Toolbar />
                    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                        <Grid container spacing={3}>

                            <Grid item xs={12}>
                                <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
                                    <div>
                                        <FormControl fullWidth>
                                            <InputLabel id="demo-simple-select-label">City</InputLabel>
                                            <Select
                                                labelId="demo-simple-select-label"
                                                id="demo-simple-select"
                                                value={currentCity}
                                                label="City"
                                                onChange={(e) => setCurrentCity(e.target.value)}
                                            >
                                                <MenuItem value={"Kanpur"}>Kanpur</MenuItem>
                                                <MenuItem value={"New Delhi"}>New Delhi</MenuItem>
                                                <MenuItem value={"Mumbai"}>Mumbai</MenuItem>
                                                <MenuItem value={"Bangalore"}>Bangalore</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </div>
                                    <div className='flex flex-row gap-4  mb-20 mt-5'>
                                    
                                        {
                                            issues.map((element, index) => {
                                                return (
                                                    <div key={index} className='p-3 w-[30%]  bg-white text-vlt border border-gray-200 shadow-sm rounded-lg shadow-gray-200'>
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

                                                        <div className='mx-auto text-center mt-2' onClick={() => {
                                                            setCurrentClickedId(element._id);
                                                            setUpdate_status_dialog(true);
                                                        }}>
                                                            <Button icon='pi pi-upload' severity='danger'><span className='ml-2'>Update Issue Status</span></Button>
                                                        </div>

                                                        <Dialog header="Update Issue Status" visible={update_status_dialog} style={{ width: '50%' }} onHide={() => setUpdate_status_dialog(false)}>
                                                        
                                                            <div className="flex flex-col justify-center items-center gap-3">
                                                                <InputText className="w-[50%]" placeholder="Enter Label" value={label} onChange={(e) => setLabel(e.target.value)} />
                                                                <InputText className="w-[50%]" placeholder="Enter Description" value={description} onChange={(e) => setDescription(e.target.value)} />
                                                                <Button icon='pi pi-upload' severity='success' onClick={()=>{        
                                                                    handleUpdateIssueStatus()
                                                                }}><span className="ml-2">Submit New Status</span></Button>
                                                            </div>
                                                        </Dialog>

                                                        <Dialog header="Issue Location" visible={mapVisible} style={{ width: '50%' }} onHide={() => setMapVisible(false)}>
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

                                                        <Dialog header="Issue Status" visible={stepper_visible} style={{ width: '50%' }} onHide={() => setStepper_Visible(false)}>
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
                                </Paper>
                            </Grid>
                        </Grid>
                        <Copyright sx={{ pt: 4 }} />
                    </Container>
                </Box>
            </Box>
        </ThemeProvider>
    );
}

export default function Dashboard() {
    return <DashboardContent />;
}

const MainListItems = ({ setCurrentPage }) => {
    return (
        <React.Fragment>
            <ListItemButton onClick={() => setCurrentPage('update_issue_details')}>
                <ListItemIcon>
                    <DashboardIcon />
                </ListItemIcon>
                <ListItemText primary="Update Issue Status" />
            </ListItemButton>
            <ListItemButton onClick={() => setCurrentPage('logout')}>
                <ListItemIcon>
                    <ShoppingCartIcon />
                </ListItemIcon>
                <ListItemText primary="Logout" />
            </ListItemButton>
        </React.Fragment>
    );
}

export const secondaryListItems = (
    <React.Fragment>
        <ListSubheader component="div" inset>
            Saved reports
        </ListSubheader>
        <ListItemButton>
            <ListItemIcon>
                <AssignmentIcon />
            </ListItemIcon>
            <ListItemText primary="Current month" />
        </ListItemButton>
        <ListItemButton>
            <ListItemIcon>
                <AssignmentIcon />
            </ListItemIcon>
            <ListItemText primary="Last quarter" />
        </ListItemButton>
        <ListItemButton>
            <ListItemIcon>
                <AssignmentIcon />
            </ListItemIcon>
            <ListItemText primary="Year-end sale" />
        </ListItemButton>
    </React.Fragment>
);

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