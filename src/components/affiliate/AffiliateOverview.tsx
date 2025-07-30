import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useAffiliate } from '../../contexts/AffiliateContext';
import { DollarSign, TrendingUp, Link as LinkIcon, Users } from 'lucide-react';

export default function AffiliateOverview() {
  const { user } = useAuth();
  const { getAffiliateStats, referrals } = useAffiliate();

  if (!user) return null;

  const stats = getAffiliateStats(user.id);

  const recentReferrals = referrals
    .filter(r => r.affiliateId === user.id)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user.fullName}!</h1>
        <p className="text-gray-600">Here's how your affiliate program is performing</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white overflow-hidden shadow-sm rounded-xl">
          <div className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-12 w-12 bg-gradient-to-r from-green-500 to-teal-600 rounded-lg flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="ml-4 flex-1">
                <p className="text-sm font-medium text-gray-500">Total Earnings</p>
                <p className="text-2xl font-semibold text-gray-900">${stats.totalEarnings.toFixed(2)}</p>
              </div>
            </div>
            <div className="mt-4">
              <span className="inline-flex items-center text-sm font-medium text-green-600">
                All time earnings
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow-sm rounded-xl">
          <div className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-12 w-12 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-lg flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="ml-4 flex-1">
                <p className="text-sm font-medium text-gray-500">Pending Earnings</p>
                <p className="text-2xl font-semibold text-gray-900">${stats.pendingEarnings.toFixed(2)}</p>
              </div>
            </div>
            <div className="mt-4">
              <span className="inline-flex items-center text-sm font-medium text-yellow-600">
                Awaiting approval
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow-sm rounded-xl">
          <div className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-12 w-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                  <Users className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="ml-4 flex-1">
                <p className="text-sm font-medium text-gray-500">Total Referrals</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.totalReferrals}</p>
              </div>
            </div>
            <div className="mt-4">
              <span className="inline-flex items-center text-sm font-medium text-blue-600">
                Successful referrals
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow-sm rounded-xl">
          <div className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-12 w-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
                  <LinkIcon className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="ml-4 flex-1">
                <p className="text-sm font-medium text-gray-500">Conversion Rate</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.conversionRate.toFixed(1)}%</p>
              </div>
            </div>
            <div className="mt-4">
              <span className="inline-flex items-center text-sm font-medium text-purple-600">
                Click to conversion
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white shadow-sm rounded-xl">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Recent Referrals</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {recentReferrals.length > 0 ? (
            recentReferrals.map((referral) => (
              <div key={referral.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      {referral.productName}
                    </p>
                    <p className="text-sm text-gray-500">
                      {referral.customerEmail} • {new Date(referral.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      referral.status === 'approved'
                        ? 'bg-green-100 text-green-800'
                        : referral.status === 'paid'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {referral.status}
                    </span>
                    <span className="text-sm font-medium text-gray-900">
                      ${referral.commission}
                    </span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="px-6 py-8 text-center">
              <p className="text-gray-500">No referrals yet. Start sharing your affiliate links!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}