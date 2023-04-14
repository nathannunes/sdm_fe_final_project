import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
import Offcanvas from 'react-bootstrap/Offcanvas';
import Accordion from 'react-bootstrap/Accordion';

import EditCalendar from './EditCalendar';
import './Button.css';

const CalendarItem = (props) => {
    const [show, setShow] = useState(false);

    const showOverlay = (event) => {
        event.preventDefault();
        console.log("modify course");
        setShow(true);
    }

    const closeOverlay = () => {
        console.log("close modify window");
        setShow(false);
    }

    const submitHandler = (newCourseInfo) => {
        // this will eventually also upddate the database in the backend
        // TODO - think about how best to link everything together
        console.log(newCourseInfo);
        setShow(false);
    }

    return(
        <Accordion.Item eventKey ={props.semester}>
            <Accordion.Header>
                <strong>{props.semester}</strong>
            </Accordion.Header>
            <Accordion.Body>
                <Table striped borderless>
                    <tbody>
                        {props.dates.map( (item) => {
                            return(
                            <tr key={item.semester + " " + item.event}>
                                <td><strong>{item.date}</strong></td>
                                <td>{item.event}</td>
                                <td>
                                {props.isAAdm && <Button bsPrefix="btn-custom" className="logout" onClick={showOverlay}>Modify</Button>}
                                <Offcanvas show={show} onHide={closeOverlay}>
                                    <Offcanvas.Header closeButton>
                                        <Offcanvas.Title>Modify Item: {item.event}</Offcanvas.Title>
                                    </Offcanvas.Header>
                                    <Offcanvas.Body>
                                        Note: leave placeholder text for items not changed
                                        
                                        <EditCalendar item={item} submit={submitHandler} />
                                    </Offcanvas.Body>
                                </Offcanvas>
                                </td>
                            </tr>
                            )
                        })}
                    </tbody>
                </Table>
            </Accordion.Body>
        </Accordion.Item>
    )
};

export default CalendarItem;