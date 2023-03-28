import * as React from 'react';
import { describe, expect } from '@jest/globals';
import { render, screen, act, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Login from '../components/Login';

// render the component for testing
// this will check that components are rendered as expected
describe('Login', () => {
    it('renders Login component', () => {
        render(<Login />);

        // check displayed text
        expect(screen.getByText(/Login/)).toBeInTheDocument();
        expect(screen.getByText(/Email/)).toBeInTheDocument();
        expect(screen.getByText(/Password/)).toBeInTheDocument();
        expect(screen.getByText(/New user/)).toBeInTheDocument();
        expect(screen.getByText(/Submit/)).toBeInTheDocument();

        // check components
        expect(screen.getByRole("textbox")).toBeInTheDocument();
        expect(screen.getByRole("checkbox")).toBeInTheDocument();
        expect(screen.getByRole("button")).toBeInTheDocument();
    })

    it('checks API call response: register', () => {
        fetch.resetMocks(); // TODO - move to before each?

        const mockRegisterResponse = {
            "token": "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ0ZXN0dXNlcjUiLCJpYXQiOjE2Nzc4NTEyNTcsImV4cCI6MTY3Nzg1MjY5N30.pJWgqDbTyk2EfVHmCUnpRNKIqmot1L2FXI4WrAL363I",
            "user": {
                "id": 4,
                "username": "testuser",
                "password": "$2a$10$ybLjCupo6sFdvGM.WOgXK.zySPjIVVUP9xcDfrAHBi3VnnOB4ZytS",
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

        const reloadMock = jest.fn().mockName("reload mock");
        render(<Login reloadPage={reloadMock}/>);

        // TODO - move to before each?
        let consoleOutput = [];
        const log = console.log;
        const mockedLog = output => consoleOutput.push(output);
        console.log = mockedLog;

        act( () => {
            userEvent.type(screen.getByRole('textbox'), 'testuser');
            userEvent.click(screen.getByRole('checkbox'));
            userEvent.click(screen.getByRole('button'));
        });

        waitFor( () => {
            screen.getByRole('header');
        });

        expect(consoleOutput).toContain('In submit handler');
        expect(consoleOutput).toContain('contact registration service');

        // TODO - move to after each?
        console.log = log;
        jest.restoreAllMocks();
    })
})