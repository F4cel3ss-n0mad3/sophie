import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useAffiliate } from '../../contexts/AffiliateContext';
import { Copy, ExternalLink, Plus, Eye, QrCode } from 'lucide-react';
import { useToast } from '../../hooks/useToast';

export default function AffiliateLinks() {
  const { user } = useAuth();
  const { generateAffiliateLink, affiliateLinks } = useAffiliate();
  const [newLinkName, setNewLinkName] = useState('');
  const { showToast } = useToast();

  if (!user) return null;

  const primaryLink = generateAffiliateLink(user.id);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    showToast('Link copied to clipboard!', 'success');
  };

  const handleCreateLink = () => {
    if (!newLinkName.trim()) return;
    
    // In a real app, this would create a new tracked link
    showToast('Custom link creation feature coming soon!', 'info');
    setNewLinkName('');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Affiliate Links</h1>
        <p className="text-gray-600">Generate and manage your affiliate links</p>
      </div>

      {/* Primary Link */}
      <div className="bg-white shadow-sm rounded-xl p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Primary Affiliate Link</h2>
        <div className="flex items-center space-x-4">
          <div className="flex-1 bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-600 mb-1">Your primary affiliate link:</p>
            <p className="font-mono text-sm text-gray-900 break-all">{primaryLink}</p>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => copyToClipboard(primaryLink)}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              title="Copy link"
            >
              <Copy className="h-5 w-5" />
            </button>
            <button
              onClick={() => window.open(primaryLink, '_blank')}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              title="Open link"
            >
              <ExternalLink className="h-5 w-5" />
            </button>
            <button
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              title="Generate QR Code"
            >
              <QrCode className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Link Performance */}
      <div className="bg-white shadow-sm rounded-xl p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Link Performance</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Link
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Clicks
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Conversions
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Conversion Rate
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {affiliateLinks.filter(link => link.affiliateId === user.id).map((link) => (
                <tr key={link.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-mono text-gray-900">{link.url}</div>
                    <div className="text-sm text-gray-500">
                      Created {new Date(link.createdAt).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {link.clicks}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {link.conversions}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {link.clicks > 0 ? ((link.conversions / link.clicks) * 100).toFixed(1) : '0'}%
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button
                      onClick={() => copyToClipboard(link.url)}
                      className="text-blue-600 hover:text-blue-900 transition-colors"
                    >
                      <Copy className="h-4 w-4" />
                    </button>
                    <button className="text-green-600 hover:text-green-900 transition-colors">
                      <Eye className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Custom Link */}
      <div className="bg-white shadow-sm rounded-xl p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Create Custom Link</h2>
        <div className="flex items-center space-x-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Enter link name or campaign"
              value={newLinkName}
              onChange={(e) => setNewLinkName(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
          <button
            onClick={handleCreateLink}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 transition-all duration-200"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Link
          </button>
        </div>
        <p className="text-sm text-gray-500 mt-2">
          Custom links help you track performance of different campaigns or traffic sources.
        </p>
      </div>

      {/* Tips */}
      <div className="bg-gradient-to-r from-green-50 to-teal-50 border border-green-200 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-green-900 mb-3">Promotion Tips</h3>
        <ul className="space-y-2 text-sm text-green-800">
          <li>• Share your links on social media platforms where your audience is active</li>
          <li>• Write honest reviews and include your affiliate link</li>
          <li>• Create valuable content that naturally incorporates your affiliate products</li>
          <li>• Use different links for different channels to track performance</li>
          <li>• Always disclose your affiliate relationship to maintain trust</li>
        </ul>
      </div>
    </div>
  );
}