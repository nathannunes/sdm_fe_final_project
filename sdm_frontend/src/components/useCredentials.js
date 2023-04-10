import { useState } from 'react';

function useCredentials() {
    const getUser = () => {
        const userString = sessionStorage.getItem('userName');

        if (userString == null) {
            return null;
        }

        const userName = JSON.parse(userString);
        return userName;

    }

    const getRole = () => {
        const roleString = sessionStorage.getItem('userRole');

        if (roleString == null) {
            return null;
        }

        const role = JSON.parse(roleString);
        return role;    
    }

    const [user, setUser] = useState(getUser());
    const [role, setRole] = useState(getRole());

    const saveUser = (userName) => {
        sessionStorage.setItem('userName', JSON.stringify(userName));
        setUser(userName);
    }

    const saveRole = (role) => {
        sessionStorage.setItem('userRole', JSON.stringify(role));
        setRole(role);
    }

    return{
        setUser: saveUser,
        setRole: saveRole,
        user,
        role
    };
}

export default useCredentials;