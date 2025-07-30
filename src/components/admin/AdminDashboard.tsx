import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import AdminLayout from './AdminLayout';
import AdminOverview from './AdminOverview';
import AdminAffiliates from './AdminAffiliates';
import AdminCommissions from './AdminCommissions';
import AdminReports from './AdminReports';

export default function AdminDashboard() {
  return (
    <AdminLayout>
      <Routes>
        <Route path="/" element={<AdminOverview />} />
        <Route path="/affiliates" element={<AdminAffiliates />} />
        <Route path="/commissions" element={<AdminCommissions />} />
        <Route path="/reports" element={<AdminReports />} />
      </Routes>
    </AdminLayout>
  );
}