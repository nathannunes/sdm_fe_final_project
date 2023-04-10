import React, { useState } from 'react';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Offcanvas from 'react-bootstrap/Offcanvas';

import Dashboard from '../components/Dashboard';
import SelectRole from '../components/SelectRole';
import EditSchedule from '../components/EditSchedule';

import '../components/Button.css';
import Login from '../components/Login';
import useToken from '../components/useToken';

import CredBadge from '../components/CredBadge';
import useCredentials from '../components/useCredentials';

function Schedule() {
    const {token} = useToken();
    const [isLoggedIn, setLogin] = useState(!!token);
    const {user, role} = useCredentials();

    const reload = () => {
        const newToken = JSON.parse(sessionStorage.getItem('token'));
        setLogin(!!newToken);
        
    const [show, setShow] = useState(false);
    const [isAAdm, setAAdm] = useState(true);

    const showOverlay = (event) => {
        event.preventDefault();
        console.log("add course");
        setShow(true);
    }

    const closeOverlay = () => {
        console.log("close add window");
        setShow(false);
    }

    const submitHandler = (newCalendarItem) => {
        // this will eventually also update the database in the backend
        // TODO: add input validation to prevent bad inputs
        console.log(newCalendarItem);
        setShow(false);
    }

    const roleChangeHandler = (newRole) => {
        console.log(newRole);
        if (newRole === "Academic Administrator") {
            setAAdm(true);
        }
        else {
            setAAdm(false);
        }
    }
    
    if (!isLoggedIn) {
        return(
            <div style={{backgroundColor: 'whitesmoke'}}>
               <h1 align="center" style={{color: "#e27f0b"}}>Please login to access this page</h1>
               <Login reloadPage={reload} />
            </div>
        );
    }

    return( 
        <div style={{backgroundColor: 'whitesmoke'}}>
            <h1 align="center" style={{color: "#e27f0b"}}>Course Schedule</h1>
            <CredBadge userName={user} userRole={role} />
            <Table size="sm">
                <tbody>
                    <tr>
                        <td width="25%"><Dashboard /></td>
                        <td><SelectRole roleChange={roleChangeHandler}/></td>
                        <td width="25%" style={{verticalAlign: "middle"}}>
                            {isAAdm && <Button bsPrefix="btn-custom" onClick={showOverlay}>Add entry</Button>}
                            <Offcanvas show={show} onHide={closeOverlay}>
                                <Offcanvas.Header closeButton>
                                    <Offcanvas.Title>Add Entry</Offcanvas.Title>
                                </Offcanvas.Header>
                                <Offcanvas.Body>
                                    <EditSchedule concentration={"Select from dropdown"} code={"CPSC-"} subject={""} 
                                                  inSpring={false} inSummer={false} inFall={false} years={""}
                                                  submit={submitHandler}/>
                                </Offcanvas.Body>
                            </Offcanvas>
                        </td>
                    </tr>
                </tbody>
            </Table>
            Placeholder: Drop-down for year
            Placeholder: course schedule table
        </div>
    );
}


export default Schedule;