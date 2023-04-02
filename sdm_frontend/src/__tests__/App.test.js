import { render, screen } from '@testing-library/react';
import App from '../App';

test('App renders page layout', () => {
    render(<App />);
 
    // check for navigation bar text
    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("Course Catalog")).toBeInTheDocument();
    expect(screen.getByText("Course Schedule")).toBeInTheDocument();
    expect(screen.getByText("Academic Calendar")).toBeInTheDocument();
    expect(screen.getByText("Logout")).toBeInTheDocument();
});
