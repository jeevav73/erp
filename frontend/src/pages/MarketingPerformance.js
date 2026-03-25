import React, { useEffect, useState } from 'react';
import { Edit2, Trash2, Plus, Search, TrendingUp } from 'lucide-react';
import api from '../services/api';
import { formatDate } from '../utils/helpers';

const CampaignModal = ({ isOpen, campaign, onClose, onSave, loading }) => {
  const [formData, setFormData] = useState({
    campaignName: '',
    campaignType: '',
    startDate: '',
    endDate: '',
    budget: '',
    status: 'Planning',
    description: ''
  });

  useEffect(() => {
    if (campaign) {
      setFormData(campaign);
    } else {
      setFormData({
        campaignName: '',
        campaignType: '',
        startDate: '',
        endDate: '',
        budget: '',
        status: 'Planning',
        description: ''
      });
    }
  }, [campaign, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-6">{campaign ? 'Edit Campaign' : 'Add Campaign'}</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Campaign Name*</label>
            <input
              type="text"
              value={formData.campaignName}
              onChange={(e) => setFormData({ ...formData, campaignName: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">Campaign Type</label>
            <input
              type="text"
              placeholder="e.g., Social Media, Email, PPC"
              value={formData.campaignType}
              onChange={(e) => setFormData({ ...formData, campaignType: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Start Date</label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-2">End Date</label>
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">Budget ($)</label>
            <input
              type="number"
              value={formData.budget}
              onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
            >
              <option value="Planning">Planning</option>
              <option value="Active">Active</option>
              <option value="Completed">Completed</option>
              <option value="Paused">Paused</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 h-24"
            />
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-lg transition disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 rounded-lg transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default function MarketingPerformance() {
  const [campaigns, setCampaigns] = useState([]);
  const [filteredCampaigns, setFilteredCampaigns] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [saving, setSaving] = useState(false);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetchCampaigns();
    fetchStats();
  }, []);

  useEffect(() => {
    let filtered = campaigns;

    if (searchQuery) {
      filtered = filtered.filter(c =>
        c.campaign_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.campaign_type?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (statusFilter) {
      filtered = filtered.filter(c => c.status === statusFilter);
    }

    setFilteredCampaigns(filtered);
  }, [searchQuery, statusFilter, campaigns]);

  const fetchCampaigns = async () => {
    try {
      setLoading(true);
      const response = await api.get('/marketing');
      setCampaigns(response.data.data || []);
      setError('');
    } catch (err) {
      setError('Failed to load campaigns');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await api.get('/marketing/stats');
      setStats(response.data.data?.[0] || {});
    } catch (err) {
      console.error('Failed to load stats', err);
    }
  };

  const handleSaveCampaign = async (formData) => {
    setSaving(true);
    try {
      if (selectedCampaign) {
        await api.put(`/marketing/${selectedCampaign.id}`, formData);
      } else {
        await api.post('/marketing', formData);
      }
      setModalOpen(false);
      setSelectedCampaign(null);
      fetchCampaigns();
      fetchStats();
    } catch (err) {
      alert('Failed to save campaign');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteCampaign = async (id) => {
    if (window.confirm('Are you sure you want to delete this campaign?')) {
      try {
        await api.delete(`/marketing/${id}`);
        fetchCampaigns();
        fetchStats();
      } catch (err) {
        alert('Failed to delete campaign');
      }
    }
  };

  const handleEditCampaign = (campaign) => {
    setSelectedCampaign(campaign);
    setModalOpen(true);
  };

  const getStatusColor = (status) => {
    const colors = {
      'Planning': 'bg-gray-100 text-gray-800',
      'Active': 'bg-green-100 text-green-800',
      'Completed': 'bg-blue-100 text-blue-800',
      'Paused': 'bg-yellow-100 text-yellow-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800">Marketing Performance</h1>
            <button
              onClick={() => {
                setSelectedCampaign(null);
                setModalOpen(true);
              }}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg flex items-center gap-2 transition"
            >
              <Plus size={20} /> New Campaign
            </button>
          </div>

          {/* Stats */}
          {stats && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-white rounded-lg shadow-md p-6">
                <p className="text-gray-600 font-semibold text-sm">Total Campaigns</p>
                <p className="text-3xl font-bold text-indigo-600 mt-2">{stats.total_campaigns}</p>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6">
                <p className="text-gray-600 font-semibold text-sm">Total Budget</p>
                <p className="text-3xl font-bold text-indigo-600 mt-2">${stats.total_budget?.toFixed(2) || '0'}</p>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6">
                <p className="text-gray-600 font-semibold text-sm">Total Conversions</p>
                <p className="text-3xl font-bold text-indigo-600 mt-2">{stats.total_conversions || 0}</p>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6">
                <p className="text-gray-600 font-semibold text-sm">Avg ROI</p>
                <p className="text-3xl font-bold text-indigo-600 mt-2">{stats.average_roi?.toFixed(2) || '0'}%</p>
              </div>
            </div>
          )}
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <Search size={20} className="text-gray-400" />
              <input
                type="text"
                placeholder="Search campaigns..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
            >
              <option value="">All Status</option>
              <option value="Planning">Planning</option>
              <option value="Active">Active</option>
              <option value="Completed">Completed</option>
              <option value="Paused">Paused</option>
            </select>
          </div>
        </div>

        {/* Campaigns List */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Loading campaigns...</p>
          </div>
        ) : error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        ) : filteredCampaigns.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <p className="text-gray-500 text-lg">No campaigns found. Create your first campaign!</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {filteredCampaigns.map((campaign) => (
              <div key={campaign.id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-800">{campaign.campaign_name}</h3>
                    <div className="flex gap-4 mt-2">
                      {campaign.campaign_type && (
                        <span className="text-sm bg-purple-100 text-purple-800 px-3 py-1 rounded-full">
                          {campaign.campaign_type}
                        </span>
                      )}
                      <span className={`text-sm px-3 py-1 rounded-full font-semibold ${getStatusColor(campaign.status)}`}>
                        {campaign.status}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditCampaign(campaign)}
                      className="bg-blue-100 hover:bg-blue-200 text-blue-700 p-2 rounded-lg transition"
                      title="Edit campaign"
                    >
                      <Edit2 size={20} />
                    </button>
                    <button
                      onClick={() => handleDeleteCampaign(campaign.id)}
                      className="bg-red-100 hover:bg-red-200 text-red-700 p-2 rounded-lg transition"
                      title="Delete campaign"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>

                {campaign.description && (
                  <p className="text-gray-600 mb-4">{campaign.description}</p>
                )}

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 pt-4 border-t">
                  <div>
                    <p className="text-gray-600 text-sm font-semibold">Budget</p>
                    <p className="text-lg font-bold text-indigo-600">${campaign.budget?.toFixed(2) || '0'}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm font-semibold">Conversions</p>
                    <p className="text-lg font-bold text-green-600">{campaign.total_conversions || 0}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm font-semibold">Leads</p>
                    <p className="text-lg font-bold text-blue-600">{campaign.total_leads || 0}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm font-semibold">Avg ROI</p>
                    <p className="text-lg font-bold text-purple-600">{campaign.avg_roi?.toFixed(2) || '0'}%</p>
                  </div>
                </div>

                {campaign.start_date && campaign.end_date && (
                  <div className="text-sm text-gray-500 mt-4">
                    {formatDate(campaign.start_date)} to {formatDate(campaign.end_date)}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Modal */}
        <CampaignModal
          isOpen={modalOpen}
          campaign={selectedCampaign}
          onClose={() => {
            setModalOpen(false);
            setSelectedCampaign(null);
          }}
          onSave={handleSaveCampaign}
          loading={saving}
        />
      </div>
    </div>
  );
}
