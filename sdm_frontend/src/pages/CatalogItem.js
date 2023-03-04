import React from 'react';
import Accordion from 'react-bootstrap/Accordion';
import Table from 'react-bootstrap/Table';

// TODO: Add button for editing

const CatalogItem = (props) => {
    return (
        <Accordion.Item eventKey={props.id}>
            <Accordion.Header>
                {props.concentration}
            </Accordion.Header>
            <Accordion.Body>
                <Table striped borderless>
                    {props.subjects.map((item) => {
                        return(
                            <tr>
                            <td><strong>{item.code}</strong></td>
                            <td>{item.name}</td>
                            <td>placeholder</td>
                        </tr>
    
                        )
                    })}
                </Table>
            </Accordion.Body>
        </Accordion.Item>
    );
};

export default CatalogItem;