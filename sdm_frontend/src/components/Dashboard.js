import React from 'react';

import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';

import useCredentials from './useCredentials';

function Dashboard() {
    const {user, role} = useCredentials();

    return(
        <Card style={{width: "25%"}}>
            <Card.Body>
                <ListGroup>
                    <ListGroup.Item>User: {user}</ListGroup.Item>
                    <ListGroup.Item>Role: {role}</ListGroup.Item>
                </ListGroup>
            </Card.Body>
        </Card>
    );
}

export default Dashboard;