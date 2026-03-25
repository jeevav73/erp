import React, { useEffect, useState } from 'react';
import { aiService } from '../services/apiServices';
import { Copy, Loader } from 'lucide-react';
import { copyToClipboard, formatDateTime } from '../utils/helpers';

export default function AITools() {
  const [topic, setTopic] = useState('');
  const [contentType, setContentType] = useState('Social Media');
  const [generatedContent, setGeneratedContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [history, setHistory] = useState([]);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const response = await aiService.getHistory();
      setHistory(response.data.data || []);
    } catch (err) {
      console.error('Failed to fetch history', err);
    }
  };

  const handleGenerateContent = async (e) => {
    e.preventDefault();
    if (!topic.trim()) {
      setError('Please enter a topic');
      return;
    }

    try {
      setError('');
      setLoading(true);
      const response = await aiService.generateContent(topic, contentType);
      setGeneratedContent(response.data.data.generated_content);
      await fetchHistory();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to generate content');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyContent = async () => {
    if (await copyToClipboard(generatedContent)) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">AI Content Generator</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Generator Form */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-bold mb-6">Generate Content</h2>

            {error && <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">{error}</div>}

            <form onSubmit={handleGenerateContent} className="space-y-6">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Topic*</label>
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g., Digital Marketing Trends for 2024"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">Content Type*</label>
                <select
                  value={contentType}
                  onChange={(e) => setContentType(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                  disabled={loading}
                >
                  <option value="Social Media">Social Media Caption</option>
                  <option value="Blog">Blog Post</option>
                  <option value="Email">Email Campaign</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold py-3 rounded-lg transition flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader size={20} className="animate-spin" /> Generating...
                  </>
                ) : (
                  'Generate Content'
                )}
              </button>
            </form>
          </div>

          {/* Generated Content Display */}
          {generatedContent && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-gray-800">Generated Content</h3>
                <button
                  onClick={handleCopyContent}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
                >
                  <Copy size={18} /> {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 whitespace-pre-wrap text-gray-800">
                {generatedContent}
              </div>
            </div>
          )}
        </div>

        {/* History Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-8">
            <h3 className="text-lg font-bold mb-4">Generation History</h3>
            
            {history.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No history yet</p>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {history.map(item => (
                  <div
                    key={item.id}
                    onClick={() => setGeneratedContent(item.generated_content)}
                    className="p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition"
                  >
                    <p className="font-semibold text-sm text-gray-800 truncate">{item.topic}</p>
                    <p className="text-xs text-gray-600 mb-2">{item.content_type}</p>
                    <p className="text-xs text-gray-500">{formatDateTime(item.created_at)}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
