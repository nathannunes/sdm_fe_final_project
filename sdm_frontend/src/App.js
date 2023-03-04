import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Layout from './pages/Layout';
import Home from './pages/Home';
import Calendar from './pages/Calendar';
import Schedule from './pages/Schedule';
import Catalog from './pages/Catalog';
import NoPage from './pages/NoPage';

import useToken from './components/useToken';

import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const {token, setToken} = useToken();
  const [isLoggedIn, setLogin] = useState(!!token)

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="courses" element={isLoggedIn ? <Catalog /> : <Home />} />
          <Route path="schedule" element={isLoggedIn ? <Schedule /> : <Home />} />
          <Route path="calendar" element={isLoggedIn ? <Calendar /> : <Home />} />
          <Route path="*" element={<NoPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
