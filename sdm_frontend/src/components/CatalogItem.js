import React from 'react';
import Accordion from 'react-bootstrap/Accordion';
import Table from 'react-bootstrap/Table';

import './Button.css';

const CatalogItem = (props) => {

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