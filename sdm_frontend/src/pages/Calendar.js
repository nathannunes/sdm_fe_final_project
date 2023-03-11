import React, { useState } from 'react';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Offcanvas from 'react-bootstrap/Offcanvas';

import Dashboard from '../components/Dashboard';
import SelectRole from '../components/SelectRole';

import '../components/Button.css';

function Calendar() {
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
    
    return( 
        <div style={{backgroundColor: 'whitesmoke'}}>
            <h1 align="center" style={{color: "#e27f0b"}}>Academic Calendar</h1>
            <Table size="sm">
                <tbody>
                    <tr>
                        <td width="25%"><Dashboard /></td>
                        <td><SelectRole roleChange={roleChangeHandler}/></td>
                        <td width="25%" style={{verticalAlign: "middle"}}>
                            {isAAdm && <Button bsPrefix="btn-custom" onClick={showOverlay}>Add course</Button>}
                            <Offcanvas show={show} onHide={closeOverlay}>
                                <Offcanvas.Header closeButton>
                                    <Offcanvas.Title>Add Course</Offcanvas.Title>
                                </Offcanvas.Header>
                                <Offcanvas.Body>
                                </Offcanvas.Body>
                            </Offcanvas>
                        </td>
                    </tr>
                </tbody>
            </Table>
        </div>
    );
}

export default Calendar;