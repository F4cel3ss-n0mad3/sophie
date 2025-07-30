import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

export interface Referral {
  id: string;
  affiliateId: string;
  customerEmail: string;
  productName: string;
  productValue: number;
  commission: number;
  status: 'pending' | 'approved' | 'paid';
  createdAt: string;
  paidAt?: string;
}

export interface AffiliateLink {
  id: string;
  affiliateId: string;
  url: string;
  clicks: number;
  conversions: number;
  createdAt: string;
}

export interface Commission {
  id: string;
  affiliateId: string;
  amount: number;
  status: 'pending' | 'approved' | 'paid';
  referralId: string;
  createdAt: string;
  paidAt?: string;
}

interface AffiliateContextType {
  referrals: Referral[];
  affiliateLinks: AffiliateLink[];
  commissions: Commission[];
  addReferral: (referral: Omit<Referral, 'id' | 'createdAt'>) => void;
  updateReferralStatus: (id: string, status: Referral['status']) => void;
  generateAffiliateLink: (affiliateId: string) => string;
  getAffiliateStats: (affiliateId: string) => {
    totalEarnings: number;
    pendingEarnings: number;
    totalReferrals: number;
    conversionRate: number;
  };
}

const AffiliateContext = createContext<AffiliateContextType | undefined>(undefined);

export function useAffiliate() {
  const context = useContext(AffiliateContext);
  if (context === undefined) {
    throw new Error('useAffiliate must be used within an AffiliateProvider');
  }
  return context;
}

// Mock data
const mockReferrals: Referral[] = [
  {
    id: '1',
    affiliateId: '2',
    customerEmail: 'customer1@example.com',
    productName: 'Premium Course',
    productValue: 299,
    commission: 89.7,
    status: 'approved',
    createdAt: '2024-01-15T10:30:00Z',
  },
  {
    id: '2',
    affiliateId: '2',
    customerEmail: 'customer2@example.com',
    productName: 'Starter Package',
    productValue: 99,
    commission: 29.7,
    status: 'pending',
    createdAt: '2024-01-18T14:20:00Z',
  },
];

const mockAffiliateLinks: AffiliateLink[] = [
  {
    id: '1',
    affiliateId: '2',
    url: 'https://mysite.com/?ref=john-affiliate',
    clicks: 145,
    conversions: 12,
    createdAt: '2024-01-01T00:00:00Z',
  },
];

export function AffiliateProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [referrals, setReferrals] = useState<Referral[]>(mockReferrals);
  const [affiliateLinks, setAffiliateLinks] = useState<AffiliateLink[]>(mockAffiliateLinks);
  const [commissions, setCommissions] = useState<Commission[]>([]);

  const addReferral = (referral: Omit<Referral, 'id' | 'createdAt'>) => {
    const newReferral: Referral = {
      ...referral,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    setReferrals(prev => [...prev, newReferral]);
  };

  const updateReferralStatus = (id: string, status: Referral['status']) => {
    setReferrals(prev =>
      prev.map(referral =>
        referral.id === id
          ? {
              ...referral,
              status,
              ...(status === 'paid' && { paidAt: new Date().toISOString() }),
            }
          : referral
      )
    );
  };

  const generateAffiliateLink = (affiliateId: string) => {
    const baseUrl = 'https://mysite.com';
    const affiliate = user?.slug || affiliateId;
    return `${baseUrl}/?ref=${affiliate}`;
  };

  const getAffiliateStats = (affiliateId: string) => {
    const affiliateReferrals = referrals.filter(r => r.affiliateId === affiliateId);
    const affiliateLink = affiliateLinks.find(l => l.affiliateId === affiliateId);
    
    const totalEarnings = affiliateReferrals
      .filter(r => r.status === 'paid')
      .reduce((sum, r) => sum + r.commission, 0);
    
    const pendingEarnings = affiliateReferrals
      .filter(r => r.status === 'pending' || r.status === 'approved')
      .reduce((sum, r) => sum + r.commission, 0);
    
    const totalReferrals = affiliateReferrals.length;
    const conversionRate = affiliateLink 
      ? (affiliateLink.conversions / affiliateLink.clicks) * 100 
      : 0;

    return {
      totalEarnings,
      pendingEarnings,
      totalReferrals,
      conversionRate,
    };
  };

  const value = {
    referrals,
    affiliateLinks,
    commissions,
    addReferral,
    updateReferralStatus,
    generateAffiliateLink,
    getAffiliateStats,
  };

  return <AffiliateContext.Provider value={value}>{children}</AffiliateContext.Provider>;
}