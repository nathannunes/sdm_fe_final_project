import React, { useState } from 'react';
import Accordion from 'react-bootstrap/Accordion';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Offcanvas from 'react-bootstrap/Offcanvas';

import EditCatalog from './EditCatalog';
import './Button.css';

const CatalogItem = (props) => {
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
        <Accordion.Item eventKey={props.concentration}>
            <Accordion.Header>
                {props.concentration}
            </Accordion.Header>
            <Accordion.Body>
                <Table striped borderless>
                    <tbody>
                        {props.subjects.map((item) => {
                            return(
                                <tr key={item.code}>
                                    <td><strong>{item.code}</strong></td>
                                    <td>{item.name}</td>
                                    <td>
                                        <Button bsPrefix="btn-custom" className="logout" onClick={showOverlay}>Modify</Button>
                                        <Offcanvas show={show} onHide={closeOverlay}>
                                            <Offcanvas.Header closeButton>
                                                <Offcanvas.Title>Modify Course: {item.code}</Offcanvas.Title>
                                            </Offcanvas.Header>
                                            <Offcanvas.Body>
                                                Note: leave placeholder text for items not changed
                                                
                                                <EditCatalog concentration={props.concentration} code={item.code} subject={item.name} submit={submitHandler} />
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
    );
};

export default CatalogItem;