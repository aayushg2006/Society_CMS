import { useState, useEffect } from 'react';
import { CheckCircle, Clock, AlertTriangle, AlertCircle } from 'lucide-react';
import api from '../services/api';

export default function DashboardPage() {
  const [complaints, setComplaints] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch complaints when the page loads
  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      // For this step, we are fetching complaints for Society ID 1.
      const response = await api.get('/complaints/society/1');
      setComplaints(response.data);
    } catch (err) {
      setError('Failed to load complaints from the server.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResolve = async (complaintId) => {
    try {
      // Call the Java backend to update the status
      await api.put(`/complaints/${complaintId}/status?status=RESOLVED`);
      // Refresh the list to show the new status
      fetchComplaints();
    } catch (err) {
      alert('Failed to update complaint status.');
    }
  };

  // Calculate dynamic stats for the top cards
  const totalComplaints = complaints.length;
  const resolvedCount = complaints.filter(c => c.status === 'RESOLVED').length;
  const pendingCount = complaints.filter(c => c.status === 'PENDING_VERIFICATION').length;
  const activeCount = complaints.filter(c => c.status === 'OPEN').length;

  // Helper to color-code the status badges
  const getStatusBadge = (status) => {
    switch (status) {
      case 'RESOLVED':
        return <span className="px-3 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700 flex items-center gap-1"><CheckCircle className="w-3 h-3"/> Resolved</span>;
      case 'OPEN':
        return <span className="px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-700 flex items-center gap-1"><AlertCircle className="w-3 h-3"/> Active Ticket</span>;
      case 'PENDING_VERIFICATION':
        return <span className="px-3 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-700 flex items-center gap-1"><Clock className="w-3 h-3"/> Pending AI/Votes</span>;
      default:
        return <span className="px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700">{status}</span>;
    }
  };

  // Helper to color-code the severity
  const getSeverityBadge = (severity) => {
    return severity === 'EMERGENCY' || severity === 'HIGH' 
      ? <span className="text-rose-600 font-bold flex items-center gap-1"><AlertTriangle className="w-4 h-4"/> {severity}</span>
      : <span className="text-slate-600 font-medium">{severity}</span>;
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-full text-slate-500">Loading society data...</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Society Overview</h1>
      
      {error && (
        <div className="bg-rose-50 text-rose-600 p-4 rounded-xl mb-6 border border-rose-100">
          {error}
        </div>
      )}

      {/* Dynamic Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-sm font-medium text-slate-500 mb-1">Total Reports</h3>
          <p className="text-3xl font-bold text-slate-900">{totalComplaints}</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-emerald-200 shadow-sm bg-emerald-50/30">
          <h3 className="text-sm font-medium text-emerald-700 mb-1">Resolved</h3>
          <p className="text-3xl font-bold text-emerald-900">{resolvedCount}</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-indigo-200 shadow-sm bg-indigo-50/30">
          <h3 className="text-sm font-medium text-indigo-700 mb-1">Active Tickets</h3>
          <p className="text-3xl font-bold text-indigo-900">{activeCount}</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-amber-200 shadow-sm bg-amber-50/30">
          <h3 className="text-sm font-medium text-amber-700 mb-1">Pending Checks</h3>
          <p className="text-3xl font-bold text-amber-900">{pendingCount}</p>
        </div>
      </div>

      {/* Complaint Data Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50/50">
          <h2 className="text-lg font-semibold text-slate-800">Recent Complaints</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
              <tr>
                <th className="px-6 py-4">Issue Title</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Severity</th>
                <th className="px-6 py-4">Reported By</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {complaints.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-slate-400">
                    No complaints found for this society.
                  </td>
                </tr>
              ) : (
                complaints.map((complaint) => (
                  <tr key={complaint.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-semibold text-slate-900">{complaint.title}</p>
                      <p className="text-xs text-slate-400 mt-1 truncate max-w-xs">{complaint.description}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 bg-slate-100 rounded-md text-xs font-medium text-slate-600">
                        {complaint.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">{getSeverityBadge(complaint.severity)}</td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-slate-700">{complaint.user?.fullName}</p>
                      <p className="text-xs text-slate-400">Flat: {complaint.user?.flatNo || 'N/A'}</p>
                    </td>
                    <td className="px-6 py-4">{getStatusBadge(complaint.status)}</td>
                    <td className="px-6 py-4 text-right">
                      {complaint.status !== 'RESOLVED' && (
                        <button 
                          onClick={() => handleResolve(complaint.id)}
                          className="px-3 py-1.5 bg-indigo-600 text-white text-xs font-medium rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
                        >
                          Mark Resolved
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}