import React, { useState } from 'react';

import jwt_decode from 'jwt-decode';

import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';

import useToken from './useToken';
import useCredentials from './useCredentials';

import './Card.css';
import './Button.css';

const Login = (props) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isRegister, setIsRegister] = useState(false);

    const {setToken} = useToken();
    const {setUser, setRole} = useCredentials();
    
    let url="";

    const submitHandler = (event) => {
        event.preventDefault();

        console.log("In submit handler");
        console.log(email);
        console.log(password);
        console.log(isRegister);

        if (isRegister) {
            // set url to register server
            console.log("contact registration service");
            url = "soc/auth/register";                
        }
        else {
            // set url to login server
            console.log("contact login service");
            url = "soc/auth/login";
        }

        let bodyContent = { "username" : email,
        "password" : password };

        fetch(url, {
            headers: { 
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": true
            },
            method: "POST",
            body: JSON.stringify(bodyContent)
            }).then((response) => {
                if (response.status === 200) {
                    if (isRegister) return response.json();

                    const newToken = response.headers.get("authorization");
                    console.log(newToken);
                    const decodedJwt = jwt_decode(newToken);
                    setToken(newToken)
                    setUser(decodedJwt.sub)
                    return(response.json());
                }
            }).then((data) => {
                let role;
                if (isRegister) {
                    const decodedJwt = jwt_decode(data.token);
                    setToken(data.token);
                    setUser(decodedJwt.sub);
                    role = data.user.role[0].authority
                }
                else {
                    role = data.role[0].authority;
                }

                setRole(role);
                props.reloadPage();
            }).catch(function (error){
                console.log(error);
            });
    }

    const emailHandler = (event) => {
        setEmail(event.target.value);
    }

    const passwordHandler = (event) => {
        setPassword(event.target.value);
    }

    const registerHandler = (event) => {
        setIsRegister(prevState => !prevState);
    }

    return (
        <div align="center">
        <Card className="text-center" bsPrefix="card-custom" style={{ width: '45%' }}>
            <Card.Header as="h5" style={{backgroundColor: "#411988", color: "white", width: '100%'}}>Login</Card.Header>
            <Card.Body>
                <Form>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Email address (@clemson.edu)</Form.Label>
                        <Form.Control type="email" placeholder="Enter email" onChange={emailHandler}/>
                        <Form.Text className="text-muted">
                        </Form.Text>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formBasicPassword">
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password" placeholder="Password" onChange={passwordHandler}/>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicCheckbox">
                        <Form.Check type="checkbox" label="New user, register me" onClick={registerHandler} />
                    </Form.Group>
                    <Button bsPrefix="btn-custom" type="submit" onClick={submitHandler}>
                        Submit
                    </Button>
                </Form>
            </Card.Body>
        </Card>
        </div>
    );
}

export default Login;