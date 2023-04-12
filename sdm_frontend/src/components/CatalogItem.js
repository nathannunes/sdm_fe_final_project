import React from 'react';
import Accordion from 'react-bootstrap/Accordion';
// import Button from 'react-bootstrap/Button';

import ScheduleItem from './ScheduleItem';

import './Button.css';

const CatalogItem = (props) => {

    return (
        <Accordion.Item eventKey={props.concentration}>
            <Accordion.Header>
                {props.concentration}
            </Accordion.Header>
            <Accordion.Body>
                {props.subjects.map((item) => {
                    return(
                        <Accordion>
                            <Accordion.Item eventKey = {item.name}>
                                    <Accordion.Header>
                                        <b>{item.code}</b>{": " + item.name}
                                        <span style={{display:"inline-block", width:"25%"}}></span>
                                        {/*placeholder for button*/}
                                    </Accordion.Header>
                                    <Accordion.Body>
                                        <Accordion>
                                        <ScheduleItem course={item.code}
                                                      name={item.name}
                                                      concentration={props.concentration}
                                                      years={item.offer_date}
                                                      semesters={item.course_semester}
                                                      isAAdm={props.isAAdm} />
                                        </Accordion>
                                    </Accordion.Body>
                            </Accordion.Item>
                        </Accordion>
                    )
                })}
            </Accordion.Body>
        </Accordion.Item>
    );
};

export default CatalogItem;