import React, { useState } from 'react';

import Login from '../components/Login';
import Dashboard from '../components/Dashboard';
import useToken from '../components/useToken';

function Home() {
    const {token} = useToken();
    const [isLoggedIn, setLogin] = useState(token)
 
    const reload = (newToken) => {
        setLogin(!!newToken);
    }

    return( 
        <div style={{backgroundColor: 'whitesmoke'}}>
            <h1 align="center" style={{color: "#e27f0b"}}>Welcome to Curriculum Plan Tracker</h1>
            <h3 align="center" style={{color: "#e27f0b"}}>Please log in to continue</h3>
            {!isLoggedIn && <Login reloadPage={reload} />}
            {isLoggedIn && <Dashboard />}
        </div>
    );
}

export default Home;