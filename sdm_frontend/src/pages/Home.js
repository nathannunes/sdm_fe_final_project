import React from 'react';

import Dashboard from '../components/Dashboard';

function Home() {
    return( 
        <div style={{backgroundColor: 'whitesmoke'}}>
            <h1 align="center" style={{color: "#e27f0b"}}>Welcome to Curriculum Plan Tracker</h1>
            <Dashboard />
        </div>
    );
}

export default Home;