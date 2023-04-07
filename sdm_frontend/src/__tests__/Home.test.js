import * as React from 'react';
import { describe, expect } from '@jest/globals';
import { render, screen } from '@testing-library/react';
import Home from '../pages/Home';

// render the component for testing
// this will check that components are rendered as expected
describe('Home render', () => {
    it('renders Home page: not logged in', () => {
        render(<Home />);

        // should display the Login page: repeat tests for Login
        expect(screen.getByText(/Welcome to Curriculum Plan Tracker/)).toBeInTheDocument();
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

    it('renders Home page: logged in', () => {
        const credentials = {
            "token": "abc",
            "user": "testuser",
            "role": "USER"
        };
        global.sessionStorage.setItem('token',JSON.stringify(credentials.token));
        global.sessionStorage.setItem('userName',JSON.stringify(credentials.user));
        global.sessionStorage.setItem('userRole',JSON.stringify(credentials.role));
        render(<Home />);

        // should display the Dashboard page: repeat tests for Dashboard
        expect(screen.getByText(/Welcome to Curriculum Plan Tracker/)).toBeInTheDocument();
        // TODO - add more tests once dashboard page is developed
        expect(screen.getByText(/User:/)).toHaveTextContent("User: " +  credentials.user);
        expect(screen.getByText(/Role:/)).toHaveTextContent("Role: " + credentials.role);

        global.sessionStorage.clear('token');
        global.sessionStorage.clear('userName');
        global.sessionStorage.clear('userRole');
    })
});
