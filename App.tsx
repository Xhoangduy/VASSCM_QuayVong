
import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import RegistrationList from './pages/RegistrationList';
import RegistrationCreate from './pages/RegistrationCreate';
import RegistrationDetail from './pages/RegistrationDetail';
import ManifestMatch from './pages/ManifestMatch';
import Exceptions from './pages/Exceptions';
import PTCHSearch from './pages/PTCHSearch';
import LeaderApproval from './pages/LeaderApproval';
import Settings from './pages/Settings';

const App = () => {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          
          <Route path="registrations" element={<RegistrationList />} />
          <Route path="registrations/new" element={<RegistrationCreate />} />
          <Route path="registrations/:id" element={<RegistrationDetail />} />
          
          <Route path="manifest" element={<ManifestMatch />} />
          <Route path="exceptions" element={<Exceptions />} />
          <Route path="approvals" element={<LeaderApproval />} />
          
          <Route path="ptch-request" element={<PTCHSearch />} />
          <Route path="settings" element={<Settings />} />
          
          <Route path="*" element={<div className="p-8">Trang không tồn tại (404)</div>} />
        </Route>
      </Routes>
    </HashRouter>
  );
};

export default App;
