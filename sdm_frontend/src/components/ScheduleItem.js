import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Offcanvas from 'react-bootstrap/OffCanvas';
import SplitButton from 'react-bootstrap/SplitButton';
import Dropdown from 'react-bootstrap/Dropdown';

import './Button.css';
import EditSchedule from './EditSchedule';

const ScheduleItem = (props) => {
    const [show, setShow] = useState(false);

    const showOverlay = (event) => {
        event.preventDefault();
        console.log("modify course schedule");
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

    if (props.showDate) {
        return (
            <tr key={props.years}>
                <td><SplitButton id={props.years + "btn"}
                                    variant="warning"
                                    drop="end"
                                    title={<b>{props.years}</b>}>
                        {props.semesters.map((sem) => {
                            return( <Dropdown.ItemText key={sem}>{sem}</Dropdown.ItemText> )
                        })}
                    </SplitButton>
                </td>
                <td></td>
                <td>
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
                </td>
            </tr>
        )
    }
    else { return <></> }
};

export default ScheduleItem;