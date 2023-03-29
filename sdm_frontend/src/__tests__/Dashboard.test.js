import * as React from 'react';
import { describe, expect } from '@jest/globals';
import { render, screen } from '@testing-library/react';
import Dashboard from '../components/Dashboard';

// render the component for testing
// this will check that components are rendered as expected
describe('CredBadge render', () => {
    it('renders Credential badge component', () => {
        const credentials = {
            "user": "testuser",
            "role": "USER"
        };
        global.sessionStorage.setItem('userName',JSON.stringify(credentials.user));
        global.sessionStorage.setItem('userRole',JSON.stringify(credentials.role));
        render(<Dashboard />);

        // check displayed text
        // TODO - add more tests once dashboard page is developed
        expect(screen.getByText(/User:/)).toHaveTextContent("User: " +  credentials.user);
        expect(screen.getByText(/Role:/)).toHaveTextContent("Role: " + credentials.role);

        global.sessionStorage.clear('userName');
        global.sessionStorage.clear('userRole');
    })
});
