import React, { useEffect, useState } from 'react';
import { Copy, Trash2, Plus, Search, BarChart3 } from 'lucide-react';
import api from '../services/api';
import { formatDateTime } from '../utils/helpers';

const ContentModal = ({ isOpen, onClose, onSave, loading }) => {
  const [formData, setFormData] = useState({
    topic: '',
    contentType: 'Social Media',
    generatedContent: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    setFormData({ topic: '', contentType: 'Social Media', generatedContent: '' });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-2xl">
        <h2 className="text-2xl font-bold mb-6">Add New Content</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Topic*</label>
            <input
              type="text"
              value={formData.topic}
              onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">Content Type*</label>
            <select
              value={formData.contentType}
              onChange={(e) => setFormData({ ...formData, contentType: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
            >
              <option value="Social Media">Social Media</option>
              <option value="Blog">Blog</option>
              <option value="Email">Email</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">Generated Content*</label>
            <textarea
              value={formData.generatedContent}
              onChange={(e) => setFormData({ ...formData, generatedContent: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 h-40"
              required
            />
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-lg transition disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save Content'}
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

export default function ContentProduction() {
  const [content, setContent] = useState([]);
  const [filteredContent, setFilteredContent] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [contentTypeFilter, setContentTypeFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [stats, setStats] = useState([]);

  useEffect(() => {
    fetchContent();
    fetchStats();
  }, []);

  useEffect(() => {
    let filtered = content;

    if (searchQuery) {
      filtered = filtered.filter(c =>
        c.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.generated_content.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (contentTypeFilter) {
      filtered = filtered.filter(c => c.content_type === contentTypeFilter);
    }

    setFilteredContent(filtered);
  }, [searchQuery, contentTypeFilter, content]);

  const fetchContent = async () => {
    try {
      setLoading(true);
      const response = await api.get('/content');
      setContent(response.data.data || []);
      setError('');
    } catch (err) {
      setError('Failed to load content');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await api.get('/content/stats');
      setStats(response.data.data || []);
    } catch (err) {
      console.error('Failed to load stats', err);
    }
  };

  const handleSaveContent = async (formData) => {
    setSaving(true);
    try {
      await api.post('/content', formData);
      setModalOpen(false);
      fetchContent();
      fetchStats();
    } catch (err) {
      alert('Failed to save content');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteContent = async (id) => {
    if (window.confirm('Are you sure you want to delete this content?')) {
      try {
        await api.delete(`/content/${id}`);
        fetchContent();
        fetchStats();
      } catch (err) {
        alert('Failed to delete content');
      }
    }
  };

  const handleCopyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert('Content copied to clipboard!');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800">Content Production</h1>
            <button
              onClick={() => setModalOpen(true)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg flex items-center gap-2 transition"
            >
              <Plus size={20} /> Add Content
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {stats.map((stat, idx) => (
              <div key={idx} className="bg-white rounded-lg shadow-md p-6">
                <p className="text-gray-600 font-semibold text-sm">{stat.content_type}</p>
                <p className="text-3xl font-bold text-indigo-600 mt-2">{stat.count_by_type}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <Search size={20} className="text-gray-400" />
              <input
                type="text"
                placeholder="Search content..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
              />
            </div>
            <select
              value={contentTypeFilter}
              onChange={(e) => setContentTypeFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
            >
              <option value="">All Types</option>
              <option value="Social Media">Social Media</option>
              <option value="Blog">Blog</option>
              <option value="Email">Email</option>
            </select>
          </div>
        </div>

        {/* Content List */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Loading content...</p>
          </div>
        ) : error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        ) : filteredContent.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <p className="text-gray-500 text-lg">No content found. Create your first content!</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {filteredContent.map((item) => (
              <div key={item.id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">{item.topic}</h3>
                    <div className="flex gap-4 mt-2">
                      <span className="text-sm bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full">
                        {item.content_type}
                      </span>
                      <span className="text-sm text-gray-500">{formatDateTime(item.created_at)}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleCopyToClipboard(item.generated_content)}
                      className="bg-blue-100 hover:bg-blue-200 text-blue-700 p-2 rounded-lg transition"
                      title="Copy to clipboard"
                    >
                      <Copy size={20} />
                    </button>
                    <button
                      onClick={() => handleDeleteContent(item.id)}
                      className="bg-red-100 hover:bg-red-200 text-red-700 p-2 rounded-lg transition"
                      title="Delete content"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4 mt-4">
                  <p className="text-gray-700 whitespace-pre-wrap">{item.generated_content}</p>
                </div>

                {item.created_by_name && (
                  <div className="text-sm text-gray-500 mt-4">
                    Created by: {item.created_by_name}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Modal */}
        <ContentModal isOpen={modalOpen} onClose={() => setModalOpen(false)} onSave={handleSaveContent} loading={saving} />
      </div>
    </div>
  );
}
