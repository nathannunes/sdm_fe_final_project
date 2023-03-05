import React, { useState } from 'react';

import Login from '../components/Login';
import useToken from '../components/useToken';

function Catalog() {
    const {token, setToken} = useToken();
    const [isLoggedIn, setLogin] = useState(!!token)

    const reload = (newToken) => {
      setLogin(!!newToken);
    }

    if (!isLoggedIn) {
      return(
          <div style={{backgroundColor: 'whitesmoke'}}>
             <h1 align="center"  style={{color: "#e27f0b"}}>Please login to access this page</h1>
             <Login reloadPage={reload} />
          </div>
      );
    }

    return( <h1>Placeholder: course catalog</h1> )
}

export default Catalog;