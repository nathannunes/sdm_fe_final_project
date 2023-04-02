import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Layout from './pages/Layout';
import Home from './pages/Home';
import Calendar from './pages/Calendar';
import Schedule from './pages/Schedule';
import Catalog from './pages/Catalog';
import NoPage from './pages/NoPage';

import 'bootstrap/dist/css/bootstrap.min.css';
import SelectAdvisees from "./pages/SelectAdvisees/SelectAdvisees";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="selectAdvisees" element={<SelectAdvisees/>} />
          <Route path="courses" element={<Catalog />} />
          <Route path="schedule" element={<Schedule />} />
          <Route path="calendar" element={<Calendar />} />
          <Route path="*" element={<NoPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
