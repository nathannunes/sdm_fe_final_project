import React, { useState } from 'react';

import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';

import './Card.css';
import './Button.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isRegister, setIsRegister] = useState(false);

    let url="";
    let response=null;

    const submitHandler = (event) => {
        event.preventDefault();

        console.log("In submit handler");
        console.log(email);
        console.log(password);
        console.log(isRegister);

        if (isRegister) {
            // set url to register server
            console.log("contact registration service");
            url = "https://locathost:8080/api/auth/register";                
        }
        else {
            // set url to login server
            console.log("contact login service");
            url = "https://locathost:8080/api/auth/login";
        
        fetch(url, {
            headers: { 
                "Content-Type": "application/json" 
            },
            method: "POST",
            body: {
                "username" : "testuser",
                "password" : "1234"
            }
            }).then((response) => {
                if (response.status === 200) {
                    if (isRegister) return response.json();
                    console.log(response.headers.get("authorization"));
                }
            }).then((data) => {
                console.log(data.token);
            });

            if(isRegister){
                response = {
                    "token": "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ0ZXN0dXNlcjUiLCJpYXQiOjE2Nzc4NTEyNTcsImV4cCI6MTY3Nzg1MjY5N30.pJWgqDbTyk2EfVHmCUnpRNKIqmot1L2FXI4WrAL363I",
                    "user": {
                        "id": 4,
                        "username": email,
                        "password": password,
                        "enabled": true,
                        "role": [
                            {
                                "id": 0,
                                "authority": "USER",
                                "user": null
                            }
                        ],
                        "accountNonExpired": true,
                        "accountNonLocked": true,
                    }
                };
            }
            else {
                response = {
                    "token": "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ0ZXN0dXNlcjUiLCJpYXQiOjE2Nzc4NTEyNTcsImV4cCI6MTY3Nzg1MjY5N30.pJWgqDbTyk2EfVHmCUnpRNKIqmot1L2FXI4WrAL363I",
                    "user": {
                        "id": 4,
                        "username": email,
                        "password": password,
                        "enabled": true,
                        "role": [
                            {
                                "id": 0,
                                "authority": "USER",
                                "user": null
                            }
                        ],
                        "accountNonExpired": true,
                        "accountNonLocked": true,
                        "credentialsNonExpired": true
                    }
                };
            }
        }


    }

    const emailHandler = (event) => {
        event.preventDefault();
        setEmail(event.target.value);
    }

    const passwordHandler = (event) => {
        event.preventDefault();
        setPassword(event.target.value);
    }

    const registerHandler = (event) => {
        event.preventDefault();
        setIsRegister(event.target.value);
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
                        <Form.Check type="checkbox" label="New user, register me" onChange={registerHandler} />
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