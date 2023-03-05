import React from 'react';
import { Outlet } from 'react-router-dom';
import NavBar from "../components/NavBar";

const Layout = (props) => {
    return(
        <>
            <NavBar />
            <Outlet />
        </>
    );
}

export default Layout;