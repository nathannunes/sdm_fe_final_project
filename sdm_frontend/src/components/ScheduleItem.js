import React, { useState } from 'react';
import Accordion from 'react-bootstrap/Accordion';
import Button from 'react-bootstrap/Button';
import Offcanvas from 'react-bootstrap/OffCanvas';

import './Button.css';
import EditSchedule from './EditSchedule';

const ScheduleItem = (props) => {
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

    return (
        <div>
            {props.years.map((year) => {
                return (
                <Accordion.Item eventKey={props.course + " " + year}>
                    <Accordion.Header>
                        <b>{year}</b>
                        <span style={{display:"inline-block", width:"75%"}}></span>
                        {props.isAAdm && <Button bsPrefix="btn-custom" className="logout" onClick={showOverlay}>Modify</Button>}
                        <Offcanvas show={show} onHide={closeOverlay}>
                            <Offcanvas.Header closeButton>
                                <Offcanvas.Title>Modify Course Schedule: {props.course}</Offcanvas.Title>
                            </Offcanvas.Header>
                            <Offcanvas.Body>
                                Note: leave placeholder text for items not changed

                                <EditSchedule concentration={props.concentration}
                                    code={props.course}
                                    subject={props.name}
                                    inSpring={props.semesters.includes("SPR")}
                                    inSummer={props.semesters.includes("SUM")}
                                    inFall={props.semesters.includes("FALL")}
                                    years={props.years.toString()}
                                    submit={submitHandler}/>
                            </Offcanvas.Body>
                        </Offcanvas>
                    </Accordion.Header>
                    <Accordion.Body>
                        {props.semesters.map((sem) => {
                            return(
                                <li>{sem}</li>
                            )
                        })}
                    </Accordion.Body>
                </Accordion.Item>
                )
            })}
        </div>
    )
};

export default ScheduleItem;