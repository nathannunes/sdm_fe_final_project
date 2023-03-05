import React from 'react';
import Accordion from 'react-bootstrap/Accordion';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';

import './Button.css';

// TODO: Add button for editing

const CatalogItem = (props) => {
    const modifyHandler = () => {
        console.log("modify course");
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
                                    <td><Button bsPrefix="btn-custom" className="logout" onClick={modifyHandler}>Modify</Button></td>
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