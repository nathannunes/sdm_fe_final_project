import * as React from 'react';
import { describe, expect } from '@jest/globals';
import { render, screen } from '@testing-library/react';
import CredBadge from '../components/CredBadge';

// render the component for testing
// this will check that components are rendered as expected
describe('CredBadge render', () => {
    it('renders Credential badge component', () => {
        const user = "testuser";
        const role = "USER";
        render(<CredBadge userName={user} userRole={role} />);

        // check displayed text
        expect(screen.getByText(/User:/)).toHaveTextContent("User: " +  user);
        expect(screen.getByText(/Role:/)).toHaveTextContent("Role: " + role);
    })
});
