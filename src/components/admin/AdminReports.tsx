import React, { useState } from 'react';
import { useAffiliate } from '../../contexts/AffiliateContext';
import { Download, Calendar, TrendingUp, Users, DollarSign } from 'lucide-react';
import { useToast } from '../../hooks/useToast';

export default function AdminReports() {
  const { referrals, affiliateLinks } = useAffiliate();
  const [dateRange, setDateRange] = useState('30');
  const { showToast } = useToast();

  const exportToCSV = () => {
    const headers = ['Date', 'Affiliate ID', 'Customer Email', 'Product', 'Product Value', 'Commission', 'Status'];
    const data = referrals.map(r => [
      new Date(r.createdAt).toLocaleDateString(),
      r.affiliateId,
      r.customerEmail,
      r.productName,
      r.productValue,
      r.commission,
      r.status
    ]);

    const csvContent = [headers, ...data]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `affiliate-report-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    
    showToast('Report exported successfully', 'success');
  };

  const totalRevenue = referrals.reduce((sum, r) => sum + r.productValue, 0);
  const totalCommissions = referrals.reduce((sum, r) => sum + r.commission, 0);
  const conversionRate = affiliateLinks.reduce((sum, l) => sum + l.conversions, 0) / 
                        affiliateLinks.reduce((sum, l) => sum + l.clicks, 0) * 100 || 0;

  const monthlyData = Array.from({ length: 12 }, (_, i) => {
    const month = new Date(2024, i).toLocaleDateString('en-US', { month: 'short' });
    const monthReferrals = referrals.filter(r => 
      new Date(r.createdAt).getMonth() === i
    );
    return {
      month,
      revenue: monthReferrals.reduce((sum, r) => sum + r.productValue, 0),
      commissions: monthReferrals.reduce((sum, r) => sum + r.commission, 0),
      referrals: monthReferrals.length,
    };
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="text-gray-600">Comprehensive affiliate program insights</p>
        </div>
        <button
          onClick={exportToCSV}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all duration-200"
        >
          <Download className="h-4 w-4 mr-2" />
          Export CSV
        </button>
      </div>

      {/* Date Range Filter */}
      <div className="flex items-center space-x-4">
        <Calendar className="h-5 w-5 text-gray-400" />
        <select
          value={dateRange}
          onChange={(e) => setDateRange(e.target.value)}
          className="block w-40 pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent rounded-lg"
        >
          <option value="7">Last 7 days</option>
          <option value="30">Last 30 days</option>
          <option value="90">Last 90 days</option>
          <option value="365">Last year</option>
        </select>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white overflow-hidden shadow-sm rounded-xl p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Total Revenue</p>
              <p className="text-2xl font-semibold text-gray-900">${totalRevenue.toLocaleString()}</p>
            </div>
          </div>
        </div>
        <div className="bg-white overflow-hidden shadow-sm rounded-xl p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <TrendingUp className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Total Commissions</p>
              <p className="text-2xl font-semibold text-gray-900">${totalCommissions.toLocaleString()}</p>
            </div>
          </div>
        </div>
        <div className="bg-white overflow-hidden shadow-sm rounded-xl p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Users className="h-8 w-8 text-purple-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Conversion Rate</p>
              <p className="text-2xl font-semibold text-gray-900">{conversionRate.toFixed(1)}%</p>
            </div>
          </div>
        </div>
        <div className="bg-white overflow-hidden shadow-sm rounded-xl p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <TrendingUp className="h-8 w-8 text-orange-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Avg. Commission</p>
              <p className="text-2xl font-semibold text-gray-900">
                ${referrals.length ? (totalCommissions / referrals.length).toFixed(0) : '0'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Monthly Performance Chart */}
      <div className="bg-white shadow-sm rounded-xl p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-6">Monthly Performance</h3>
        <div className="space-y-4">
          {monthlyData.slice(-6).map((data, index) => (
            <div key={data.month} className="flex items-center space-x-4">
              <div className="w-16 text-sm font-medium text-gray-700">{data.month}</div>
              <div className="flex-1 bg-gray-200 rounded-full h-3 relative">
                <div
                  className="bg-gradient-to-r from-blue-500 to-indigo-600 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${Math.max(data.revenue / Math.max(...monthlyData.map(d => d.revenue)) * 100, 2)}%` }}
                />
              </div>
              <div className="w-20 text-sm text-gray-600">${data.revenue}</div>
              <div className="w-16 text-sm text-gray-500">{data.referrals} refs</div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white shadow-sm rounded-xl">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Recent Transactions</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Commission
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {referrals.slice(0, 10).map((referral) => (
                <tr key={referral.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(referral.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {referral.customerEmail}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {referral.productName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${referral.commission}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      referral.status === 'approved'
                        ? 'bg-green-100 text-green-800'
                        : referral.status === 'paid'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {referral.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}