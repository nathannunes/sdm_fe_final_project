import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
import Offcanvas from 'react-bootstrap/Offcanvas';
import Accordion from 'react-bootstrap/Accordion';

import Login from '../components/Login';
import Dashboard from '../components/Dashboard';
import SelectRole from '../components/SelectRole';
import useToken from '../components/useToken';

import CalendarItem from '../components/CalendarItem';
import EditCalendar from '../components/EditCalendar';
import '../components/Button.css';

const dummy_data = {
    "Summer 2023": [
        {
            "id": 5,
            "semester": "Summer 2023",
            "date": "Sep 9, Mon - Sep 10, Tue",
            "event": "Late enrollment"
        }
    ],
    "Spring 2023": [
        {
            "id": 1,
            "semester": "Spring 2023",
            "date": "Jan 9, Mon - Jan 10, Tue",
            "event": "Late enrollment"
        },
        {
            "id": 2,
            "semester": "Spring 2023",
            "date": "Jan 9, Mon",
            "event": "Orientation"
        },
        {
            "id": 3,
            "semester": "Spring 2023",
            "date": "Mar 20, Mon - Mar 24, Fri",
            "event": "Spring break"
        }
    ]
};

function Calendar() {
    const {token} = useToken();
    const [isLoggedIn, setLogin] = useState(!!token);
    const [show, setShow] = useState(false);
    const [isAAdm, setAAdm] = useState(true);
    const [calData, setCalData] = useState(dummy_data);
    const [updateToggle, setToggle] = useState(false);

    const reload = () => {
        const newToken = JSON.parse(sessionStorage.getItem('token'));
        setLogin(!!newToken);
    }

    const showOverlay = (event) => {
        event.preventDefault();
        console.log("add course");
        setShow(true);
    }

    const closeOverlay = () => {
        console.log("close add window");
        setShow(false);
    }

    const submitHandler = (newCalInfo) => {
        // TODO - need to do input validation
        console.log(newCalInfo);
        setShow(false);

        // call to update API
        if(isLoggedIn) {
            console.log('logged in, updating data');
            const url = "soc/academic/saveAcademicCalendar";
            fetch(url, { 
                headers: {
                    "Authorization": "Bearer " + token,
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": true
                },
                method: "POST",
                body: JSON.stringify(newCalInfo)
            }).then((response) => {
                if (response.status === 200) {
                    return(response.json());
                }
            }).then((data) => {
                console.log('returned data');
                if (data !== "undefined") {
                    console.log(data);
                    setToggle( (prev) => !prev );
                }
            }).catch(function (error){
                console.log(error);
                // TODO - properly notify user of error
            });
        }
    }

    // this will eventually be removed/moved to system administration-related component
    const roleChangeHandler = (newRole) => {
        console.log(newRole);
        if (newRole === "Academic Administrator") {
            setAAdm(true);
        }
        else {
            setAAdm(false);
        }
    }

    // this will only get data from the API when the listed variables are changed
    useEffect( () => {
        console.log('loaded');
        if(isLoggedIn) {
            console.log('logged in, fetching data');
            const url = "soc/academic/getAcademicCalendar";
            fetch(url, { 
                headers: {
                    "Authorization": "Bearer " + token
                }
            }).then((response) => {
                if (response.status === 200) {
                    return(response.json());
                }
            }).then((data) => {
                console.log('setting data');
                console.log(data);
                setCalData(data);
            }).catch(function (error){
                console.log(error);
                // TODO - properly notify user of error
            });
        }
    }, [updateToggle]);

    if (!isLoggedIn) {
        return(
            <div style={{backgroundColor: 'whitesmoke'}}>
               <h1 align="center"  style={{color: "#e27f0b"}}>Please login to access this page</h1>
               <Login reloadPage={reload} />
            </div>
        );
    }

    return( 
        <div align="center">
            <h1 align="center" style={{color: "#e27f0b"}}>Academic Calendar</h1> 
            <Table size="sm">
                <tbody>
                    <tr key="header">
                        <td width="55%"><Dashboard /></td>
                        <td><SelectRole roleChange={roleChangeHandler}/></td>
                        <td width="25%" style={{verticalAlign: "middle"}}>
                            {isAAdm && <Button bsPrefix="btn-custom" onClick={showOverlay}>Add item</Button>}
                            <Offcanvas show={show} onHide={closeOverlay}>
                                <Offcanvas.Header closeButton>
                                    <Offcanvas.Title>Add Item</Offcanvas.Title>
                                </Offcanvas.Header>
                                <Offcanvas.Body>
                                <EditCalendar item={{
                                        "id": Math.random(),
                                        "semester": "Select from dropdown",
                                        "date": "",
                                        "event": ""
                                    }} 
                                    submit={submitHandler} />
                                </Offcanvas.Body>
                            </Offcanvas>
                        </td>
                    </tr>
                </tbody>
            </Table>
            <Accordion>
                { Object.keys(calData).map((key) => {
                    const data = calData[key];

                    return(
                        <CalendarItem semester={key} dates={data} isAAdm={isAAdm} submit={submitHandler}/>
                    )
                })}
            </Accordion>
        </div>
    );
}

export default Calendar;