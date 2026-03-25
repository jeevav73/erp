import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { marketingService, marketingMetricsService } from '../services/apiServices';

export default function MarketingMetricsManager() {
  const [campaigns, setCampaigns] = useState([]);
  const [selected, setSelected] = useState(null);
  const [metrics, setMetrics] = useState([]);
  const [form, setForm] = useState({ metric_date: '', impressions: 0, clicks: 0, conversions: 0, leads: 0, spend: 0, roi: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    try {
      setLoading(true);
      const res = await marketingService.getAllCampaigns();
      setCampaigns(res.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMetrics = async (campaignId) => {
    try {
      const res = await marketingMetricsService.getByCampaign(campaignId);
      setMetrics(res.data.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSelect = (c) => {
    setSelected(c);
    fetchMetrics(c.id);
  };

  const handleInsert = async (e) => {
    e.preventDefault();
    if (!selected) return alert('Select a campaign');
    try {
      await marketingMetricsService.insertMetric({ campaign_id: selected.id, ...form });
      setForm({ metric_date: '', impressions: 0, clicks: 0, conversions: 0, leads: 0, spend: 0, roi: 0 });
      fetchMetrics(selected.id);
    } catch (err) {
      console.error(err);
      alert('Failed to insert metric');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Marketing Metrics</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="col-span-1 bg-white p-4 rounded shadow">
            <h3 className="font-semibold mb-3">Campaigns</h3>
            {loading ? <p>Loading...</p> : (
              <ul>
                {campaigns.map(c => (
                  <li key={c.id} className={`py-2 cursor-pointer ${selected?.id === c.id ? 'font-bold' : ''}`} onClick={() => handleSelect(c)}>
                    {c.campaign_name}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="col-span-2 bg-white p-4 rounded shadow">
            <h3 className="font-semibold mb-3">Insert Metric</h3>
            <form onSubmit={handleInsert} className="grid grid-cols-2 gap-4 mb-4">
              <input type="date" value={form.metric_date} onChange={e => setForm({ ...form, metric_date: e.target.value })} required />
              <input type="number" value={form.impressions} onChange={e => setForm({ ...form, impressions: Number(e.target.value) })} placeholder="Impressions" />
              <input type="number" value={form.clicks} onChange={e => setForm({ ...form, clicks: Number(e.target.value) })} placeholder="Clicks" />
              <input type="number" value={form.conversions} onChange={e => setForm({ ...form, conversions: Number(e.target.value) })} placeholder="Conversions" />
              <input type="number" value={form.leads} onChange={e => setForm({ ...form, leads: Number(e.target.value) })} placeholder="Leads" />
              <input type="number" step="0.01" value={form.spend} onChange={e => setForm({ ...form, spend: Number(e.target.value) })} placeholder="Spend" />
              <input type="number" step="0.0001" value={form.roi} onChange={e => setForm({ ...form, roi: Number(e.target.value) })} placeholder="ROI" />
              <div className="col-span-2">
                <button className="bg-indigo-600 text-white px-4 py-2 rounded">Insert Metric</button>
              </div>
            </form>

            <h3 className="font-semibold mb-3">Metrics List</h3>
            {selected ? (
              <div>
                {metrics.length === 0 ? <p>No metrics yet</p> : (
                  <table className="w-full text-left">
                    <thead>
                      <tr><th>Date</th><th>Impr</th><th>Clicks</th><th>Conv</th><th>Leads</th><th>Spend</th></tr>
                    </thead>
                    <tbody>
                      {metrics.map(m => (
                        <tr key={m.id} className="border-t"><td>{m.metric_date}</td><td>{m.impressions}</td><td>{m.clicks}</td><td>{m.conversions}</td><td>{m.leads}</td><td>{m.spend}</td></tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            ) : <p>Select a campaign to view metrics</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
