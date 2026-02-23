import { useState, useEffect } from 'react';
import { Filter, Search, CheckCircle, Clock, AlertTriangle, Image as ImageIcon, Video } from 'lucide-react';
import api from '../services/api';

export default function ComplaintsPage() {
  const [complaints, setComplaints] = useState([]);
  const [filteredComplaints, setFilteredComplaints] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  const CURRENT_SOCIETY_ID = 1;

  useEffect(() => {
    fetchComplaints();
  }, []);

  useEffect(() => {
    filterData();
  }, [complaints, statusFilter, searchTerm]);

  const fetchComplaints = async () => {
    try {
      const response = await api.get(`/complaints/society/${CURRENT_SOCIETY_ID}`);
      setComplaints(response.data);
    } catch (err) {
      console.error("Failed to fetch complaints", err);
    } finally {
      setIsLoading(false);
    }
  };

  const filterData = () => {
    let result = complaints;

    // Filter by Status
    if (statusFilter !== 'ALL') {
      result = result.filter(c => c.status === statusFilter);
    }

    // Filter by Search Term
    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      result = result.filter(c => 
        c.title.toLowerCase().includes(lowerSearch) || 
        c.description.toLowerCase().includes(lowerSearch) ||
        c.user?.fullName.toLowerCase().includes(lowerSearch)
      );
    }

    setFilteredComplaints(result);
  };

  const handleResolve = async (complaintId) => {
    try {
      await api.put(`/complaints/${complaintId}/status?status=RESOLVED`);
      fetchComplaints(); // Refresh data
    } catch (err) {
      alert('Failed to resolve complaint.');
    }
  };

  // Helper to render media links nicely
  const renderMediaAttachment = (url) => {
    if (!url) return <span className="text-slate-400 text-xs italic">No media attached</span>;
    
    const isVideo = url.endsWith('.mp4') || url.endsWith('.mov');
    return (
      <a 
        href={url} 
        target="_blank" 
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-medium transition-colors"
      >
        {isVideo ? <Video className="w-3.5 h-3.5 text-indigo-600" /> : <ImageIcon className="w-3.5 h-3.5 text-indigo-600" />}
        View Evidence
      </a>
    );
  };

  if (isLoading) return <div className="p-8 text-slate-500">Loading complaints...</div>;

  return (
    <div className="h-full flex flex-col">
      {/* Header & Controls */}
      <div className="mb-6 space-y-4 sm:space-y-0 sm:flex sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Complaints Directory</h1>
        
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search Bar */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search tickets..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none w-full sm:w-64"
            />
          </div>

          {/* Filter Dropdown */}
          <div className="relative">
            <Filter className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="pl-9 pr-8 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none appearance-none bg-white font-medium text-slate-700"
            >
              <option value="ALL">All Statuses</option>
              <option value="OPEN">Open (Active)</option>
              <option value="PENDING_VERIFICATION">Pending Checks</option>
              <option value="RESOLVED">Resolved</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grid of Complaint Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 overflow-y-auto pb-8">
        {filteredComplaints.length === 0 ? (
          <div className="col-span-full py-12 text-center text-slate-500 bg-white rounded-xl border border-slate-200 border-dashed">
            No complaints found matching your criteria.
          </div>
        ) : (
          filteredComplaints.map(complaint => (
            <div key={complaint.id} className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 flex flex-col transition-all hover:shadow-md">
              
              {/* Card Header: Title & Status */}
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 leading-tight">{complaint.title}</h3>
                  <p className="text-sm text-slate-500 mt-1 flex items-center gap-2">
                    <span className="font-semibold text-slate-700">{complaint.category}</span> • 
                    Reported by {complaint.user?.fullName} (Flat {complaint.user?.flatNo})
                  </p>
                </div>
                {complaint.severity === 'EMERGENCY' && (
                   <span className="px-2.5 py-1 bg-rose-100 text-rose-700 rounded-md text-xs font-bold flex items-center whitespace-nowrap">
                     <AlertTriangle className="w-3 h-3 mr-1" /> EMERGENCY
                   </span>
                )}
              </div>

              {/* Description */}
              <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 text-sm text-slate-700 mb-4 flex-grow">
                {complaint.description}
              </div>

              {/* Footer: Media, Votes, Actions */}
              <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100">
                <div className="flex items-center gap-4">
                  {renderMediaAttachment(complaint.imageUrl)}
                  
                  <div className="text-xs font-medium text-slate-500 flex items-center">
                    👍 {complaint.upvotes} Upvotes
                  </div>
                </div>

                <div>
                  {complaint.status === 'RESOLVED' ? (
                     <span className="flex items-center text-emerald-600 text-sm font-bold">
                       <CheckCircle className="w-4 h-4 mr-1" /> Resolved
                     </span>
                  ) : (
                     <button 
                       onClick={() => handleResolve(complaint.id)}
                       className="px-4 py-2 bg-indigo-50 text-indigo-700 hover:bg-indigo-600 hover:text-white rounded-lg text-sm font-semibold transition-colors"
                     >
                       Mark Resolved
                     </button>
                  )}
                </div>
              </div>

            </div>
          ))
        )}
      </div>
    </div>
  );
}