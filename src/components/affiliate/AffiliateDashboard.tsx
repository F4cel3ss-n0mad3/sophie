import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AffiliateLayout from './AffiliateLayout';
import AffiliateOverview from './AffiliateOverview';
import AffiliateLinks from './AffiliateLinks';
import AffiliateEarnings from './AffiliateEarnings';
import AffiliateProfile from './AffiliateProfile';

export default function AffiliateDashboard() {
  return (
    <AffiliateLayout>
      <Routes>
        <Route path="/" element={<AffiliateOverview />} />
        <Route path="/links" element={<AffiliateLinks />} />
        <Route path="/earnings" element={<AffiliateEarnings />} />
        <Route path="/profile" element={<AffiliateProfile />} />
      </Routes>
    </AffiliateLayout>
  );
}