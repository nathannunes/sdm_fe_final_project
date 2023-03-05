import React from 'react';

import CredBadge from './CredBadge';
import useCredentials from './useCredentials';

function Dashboard() {
    const {user, role} = useCredentials();

    return(
        <div style={{backgroundColor: 'whitesmoke'}}>
            <CredBadge userName={user} userRole={role} />
        </div>
    );
}

export default Dashboard;