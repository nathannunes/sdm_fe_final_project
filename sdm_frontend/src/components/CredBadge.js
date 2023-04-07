import React from 'react';

import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';

const CredBadge = (props) => {
    return(
        <Card style={{width: "25%"}}>
            <Card.Body>
                <ListGroup>
                    <ListGroup.Item>User: {props.userName}</ListGroup.Item>
                    <ListGroup.Item>Role: {props.userRole}</ListGroup.Item>
                </ListGroup>
            </Card.Body>
        </Card>
    );
}

export default CredBadge;