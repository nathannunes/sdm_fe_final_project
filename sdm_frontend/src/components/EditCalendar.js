import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

import './Button.css';

const EditCalendar = (props) => {
    const [semester, setSemester] = useState(props.item.semester);
    const [dates, setDates] = useState(props.item.date);
    const [eventName, setEventName] = useState(props.item.event);

    const semesterChgHandler = (event) => {
        event.preventDefault();
        setSemester(event.target.value);
    }

    const dateChgHandler = (event) => {
        setDates(event.target.value);
    }

    const eventChgHandler = (event) => {
        setEventName(event.target.value);
    }

    const submitHandler = (event) => {
        event.preventDefault();
        props.submit({
            "id": props.item.id,
            "semester": semester,
            "date": dates,
            "event": eventName});
    }

    // TODO - this isn't the best way to do it, but this enforces the expected convention
    const semestersList={
        "semesters": [
            "Spring 2023",
            "Summer 2023",
            "Fall 2023",
            "Spring 2024",
            "Summer 2024",
            "Fall 2024"
        ]
    };

    return (
        <Form>
            <Form.Group className="mb-3" controlId={props.item.semester}>
                <Form.Label>Semester</Form.Label>
                <Form.Select onChange={semesterChgHandler}>
                    <option>{props.item.semester}</option>
                    {semestersList.semesters.map( (item) => {
                        if (item !== props.concentration) {
                            return (<option value={item} key={Math.random()}>{item}</option>);
                        }
                        return null;
                    }
                )}
                </Form.Select>
                <Form.Text>Select semester</Form.Text>
            </Form.Group>

            <Form.Group className="mb-3" controlId={props.item.date}>
                <Form.Label>Event date</Form.Label>
                <Form.Control placeholder={props.item.date} onChange={dateChgHandler} />
                <Form.Text>Enter date as MMM DD, DAY, using "-" for multi-day event</Form.Text>
            </Form.Group>

            <Form.Group className="mb-3" controlId={props.item.event}>
                <Form.Label>Event name</Form.Label>
                <Form.Control placeholder={props.item.event} onChange={eventChgHandler} />
                <Form.Text>Enter event name</Form.Text>
            </Form.Group>

            <Button bsPrefix="btn-custom" onClick={submitHandler}>Submit</Button>
        </Form>
    )

};

export default EditCalendar;