import React, { useState } from 'react';

import Login from '../components/Login';
import useToken from '../components/useToken';

import CredBadge from '../components/CredBadge';
import useCredentials from '../components/useCredentials';

function Catalog() {
    const {token, setToken} = useToken();
    const [isLoggedIn, setLogin] = useState(!!token);
    const {user, role} = useCredentials();

    const reload = (newToken) => {
      setLogin(!!newToken);
    }

    if (!isLoggedIn) {
      return(
          <div style={{backgroundColor: 'whitesmoke'}}>
             <h1 align="center" style={{color: "#e27f0b"}}>Please login to access this page</h1>
             <Login reloadPage={reload} />
          </div>
      );
    }

    return( 
        <div style={{backgroundColor: 'whitesmoke'}}>
          <h1 align="center" style={{color: "#e27f0b"}}>Placeholder: course catalog</h1>
          <CredBadge userName={user} userRole={role} />
        </div>
    );
}

export default Catalog;