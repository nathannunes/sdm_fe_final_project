import React from 'react';
import {useNavigate} from 'react-router-dom';

import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';

import './navbar.css';

function NavBar(props) {
    const navigate = useNavigate();

    const logoutHandler = (props) =>
    {
        console.log("logout");
        sessionStorage.clear('token');
        sessionStorage.clear('userName');
        sessionStorage.clear('userRole');
        navigate('/');
        window.location.reload(false);
    }

    return (
        <Navbar className="navbar-custom"
                variant="dark"
                expand="md">
            <Container>
                <Navbar.Brand to="/">CPT</Navbar.Brand>

                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link href="/">Home</Nav.Link>
                        <Nav.Link href="/courses">Course Catalog</Nav.Link>
                        <Nav.Link href="/selectAdvisees">Select Advisees</Nav.Link>
                        <Nav.Link href="/schedule">Course Schedule</Nav.Link>
                        <Nav.Link href="/calendar">Academic Calendar</Nav.Link>
                        <Nav><Button bsPrefix="btn-custom" className="logout" onClick={logoutHandler}>Logout</Button></Nav>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
  );
}

export default NavBar;