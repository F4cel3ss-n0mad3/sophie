import React from 'react';
import { useAffiliate } from '../../contexts/AffiliateContext';
import { DollarSign, Users, TrendingUp, Activity } from 'lucide-react';

export default function AdminOverview() {
  const { referrals, affiliateLinks } = useAffiliate();

  const stats = [
    {
      name: 'Total Revenue',
      value: `$${referrals.reduce((sum, r) => sum + r.productValue, 0).toLocaleString()}`,
      icon: DollarSign,
      change: '+12.5%',
      changeType: 'positive',
    },
    {
      name: 'Total Commissions',
      value: `$${referrals.reduce((sum, r) => sum + r.commission, 0).toLocaleString()}`,
      icon: TrendingUp,
      change: '+8.2%',
      changeType: 'positive',
    },
    {
      name: 'Active Affiliates',
      value: String(new Set(referrals.map(r => r.affiliateId)).size),
      icon: Users,
      change: '+2',
      changeType: 'positive',
    },
    {
      name: 'Total Clicks',
      value: String(affiliateLinks.reduce((sum, l) => sum + l.clicks, 0)),
      icon: Activity,
      change: '+23.1%',
      changeType: 'positive',
    },
  ];

  const recentActivity = referrals
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-gray-600">Monitor your affiliate program performance</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.name} className="bg-white overflow-hidden shadow-sm rounded-xl">
              <div className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="h-12 w-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <div className="ml-4 flex-1">
                    <p className="text-sm font-medium text-gray-500">{stat.name}</p>
                    <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                  </div>
                </div>
                <div className="mt-4">
                  <span className={`inline-flex items-center text-sm font-medium ${
                    stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {stat.change} from last month
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Activity */}
      <div className="bg-white shadow-sm rounded-xl">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {recentActivity.map((referral) => (
            <div key={referral.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    New referral: {referral.productName}
                  </p>
                  <p className="text-sm text-gray-500">
                    {referral.customerEmail} • ${referral.productValue}
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
                  <span className="text-sm text-gray-500">
                    ${referral.commission}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}