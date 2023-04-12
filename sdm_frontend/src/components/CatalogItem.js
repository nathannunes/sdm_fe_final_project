import React, { useState } from 'react';
import Accordion from 'react-bootstrap/Accordion';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';

import ScheduleItem from './ScheduleItem';

import './Button.css';

const CatalogItem = (props) => {
    const [showDate, setShowDate] = useState(false);

    const showDates = () => {
        console.log("Toggle dates");
        setShowDate(!showDate);
    }

    return (
        <Accordion.Item eventKey={props.concentration}>
            <Accordion.Header>
                {props.concentration}
            </Accordion.Header>
            <Accordion.Body>
                <Table striped borderless>
                    <tbody>
                        {props.subjects.map((item) => {
                            return(
                                <React.Fragment>
                                <tr key={item.code}>
                                    <td><b>{item.code}</b>{": " + item.name}</td>
                                    <td>
                                        {/* TODO - this affects *all* date rows; need to update to only affect
                                        the rows with the associated course */}
                                        <Button bsPrefix="btn-custom" onClick={showDates}>Show Dates</Button>
                                    </td>
                                    <td>
                                        placeholder
                                    </td>
                                </tr>
                                    <ScheduleItem course={item.code}
                                        name={item.name}
                                        concentration={props.concentration}
                                        years={item.offer_date}
                                        semesters={item.course_semester}
                                        isAAdm={props.isAAdm}
                                        showDate={showDate}
                                    />
                                </React.Fragment>
                            )
                        })}
                    </tbody>
                </Table>
            </Accordion.Body>
        </Accordion.Item>
    );
};

export default CatalogItem;