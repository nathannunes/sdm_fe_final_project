import React, { useState } from 'react';
import Accordion from 'react-bootstrap/Accordion';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Offcanvas from 'react-bootstrap/Offcanvas';

import EditCatalog from './EditCatalog';
import './Button.css';

// TODO: Add button for editing

const CatalogItem = (props) => {
    const [show, setShow] = useState(false);

    const showOverlay = () => {
        console.log("modify course");
        setShow(true);
    }

    const closeOverlay = () => {
        console.log("close modify window");
        setShow(false);
    }

    return (
        <Accordion.Item eventKey={props.id}>
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
                                                
                                                <EditCatalog concentration={props.concentration} code={item.code} subject={item.name} />
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