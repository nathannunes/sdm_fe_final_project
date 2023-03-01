import React from 'react';
import { BrowserRouter, Route, Link } from 'react-router-dom';

function NavBar() {
  return (
    <nav>
        <ul>
            <li>
                <Link to="/">Home</Link>
            </li>
            <li>
                <Link to="/courses">Course Catalog</Link>
            </li>
            <li>
                <Link to="/schedule">Course Schedule</Link>
            </li>
            <li>
                <Link to="/calendar">Academic Calendar</Link>
            </li>
        </ul>
    </nav>
  );
}

export default NavBar;