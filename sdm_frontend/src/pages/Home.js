import React from 'react';

import Login from '../components/Login';

function Home() {
    return( 
        <div style={{backgroundColor: 'whitesmoke'}}>
            <h1 align="center"  style={{color: "#e27f0b"}}>Welcome to Curriculum Plan Tracker</h1>
            <Login />
        </div>
    );
}

export default Home;