import { useState, useEffect } from 'react';
import { Search, Filter, AlertTriangle, CheckCircle, Clock, MoreVertical, Wrench } from 'lucide-react';
import api from '../services/api';

export default function ComplaintsPage() {
  const [complaints, setComplaints] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');

  // New state to track which complaint's vendor dropdown is currently open
  const [assigningVendorFor, setAssigningVendorFor] = useState(null); 

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      // Assuming Admin belongs to society 1 for now
      const [complaintsRes, vendorsRes] = await Promise.all([
        api.get('/complaints/society/1'),
        api.get('/users/role/VENDOR')
      ]);
      setComplaints(complaintsRes.data);
      setVendors(vendorsRes.data);
    } catch (err) {
      console.error("Failed to fetch data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      await api.put(`/complaints/${id}/status`, null, { params: { status: newStatus } });
      fetchData(); // Refresh the list
    } catch (err) {
      alert("Failed to update status");
    }
  };

  const handleAssignVendor = async (complaintId, vendorId) => {
    try {
      await api.put(`/complaints/${complaintId}/assign/${vendorId}`);
      setAssigningVendorFor(null); // Close the dropdown
      fetchData(); // Refresh to show IN_PROGRESS and assigned vendor
    } catch (err) {
      alert("Failed to assign vendor");
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'HIGH': return 'bg-red-100 text-red-700 border-red-200';
      case 'MEDIUM': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'LOW': return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'OPEN': return <AlertTriangle className="w-4 h-4 text-orange-500" />;
      case 'IN_PROGRESS': return <Wrench className="w-4 h-4 text-blue-500" />;
      case 'RESOLVED': return <CheckCircle className="w-4 h-4 text-emerald-500" />;
      default: return <Clock className="w-4 h-4 text-slate-400" />;
    }
  };

  const filteredComplaints = complaints.filter(c => {
    const matchesSearch = c.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          c.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'ALL' || c.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  if (isLoading) {
    return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div></div>;
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Complaints Directory</h1>
          <p className="text-slate-500 text-sm mt-1">Manage and assign resident tickets.</p>
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col md:flex-row gap-4 shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search tickets..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-600 outline-none"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-slate-400" />
          <select 
            value={filterStatus} 
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-600 outline-none cursor-pointer"
          >
            <option value="ALL">All Status</option>
            <option value="PENDING_VERIFICATION">Pending Validation</option>
            <option value="OPEN">Open</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="RESOLVED">Resolved</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredComplaints.map((complaint) => (
          <div key={complaint.id} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col h-full relative group">
            
            <div className="flex justify-between items-start mb-4">
              <span className={`px-2.5 py-1 text-xs font-bold rounded-md border ${getSeverityColor(complaint.severity)}`}>
                {complaint.severity}
              </span>
              <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-200">
                {getStatusIcon(complaint.status)}
                <span className="text-xs font-medium text-slate-700">{complaint.status.replace('_', ' ')}</span>
              </div>
            </div>

            <div className="mb-4 flex-grow">
              <h3 className="text-lg font-bold text-slate-900 mb-2 line-clamp-1">{complaint.title}</h3>
              <p className="text-sm text-slate-600 line-clamp-3 leading-relaxed">{complaint.description}</p>
            </div>

            {complaint.imageUrl && (
              <div className="mb-4 rounded-xl overflow-hidden bg-slate-100 h-32 border border-slate-200">
                {complaint.imageUrl.endsWith('.mp4') ? (
                  <video src={complaint.imageUrl} className="w-full h-full object-cover" controls muted />
                ) : (
                  <img src={complaint.imageUrl} alt="Evidence" className="w-full h-full object-cover" />
                )}
              </div>
            )}

            <div className="flex items-center justify-between text-xs text-slate-500 mb-4 pt-4 border-t border-slate-100">
              <span>Reported by: <strong className="text-slate-700">{complaint.user?.fullName || 'Unknown'}</strong></span>
              <span className="flex items-center gap-1">Upvotes: <strong className="text-indigo-600">{complaint.upvotes}</strong></span>
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex gap-2 mt-auto">
              
              {/* If OPEN, allow assigning a Vendor */}
              {complaint.status === 'OPEN' && (
                <div className="relative flex-1">
                  <button 
                    onClick={() => setAssigningVendorFor(assigningVendorFor === complaint.id ? null : complaint.id)}
                    className="w-full py-2 bg-indigo-50 text-indigo-700 rounded-lg text-sm font-semibold hover:bg-indigo-100 transition-colors flex items-center justify-center gap-2"
                  >
                    <Wrench className="w-4 h-4"/> Assign Vendor
                  </button>

                  {/* Dropdown Menu for Vendors */}
                  {assigningVendorFor === complaint.id && (
                    <div className="absolute bottom-full left-0 w-full mb-2 bg-white border border-slate-200 rounded-xl shadow-xl z-10 py-1 overflow-hidden">
                      <div className="px-3 py-2 text-xs font-bold text-slate-400 uppercase bg-slate-50 border-b border-slate-100">Select Vendor</div>
                      {vendors.length === 0 ? (
                        <div className="p-3 text-sm text-slate-500 text-center">No vendors found.</div>
                      ) : (
                        vendors.map(vendor => (
                          <button 
                            key={vendor.id}
                            onClick={() => handleAssignVendor(complaint.id, vendor.id)}
                            className="w-full text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 transition-colors"
                          >
                            {vendor.fullName} ({vendor.email})
                          </button>
                        ))
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Show Assigned Vendor if IN_PROGRESS */}
              {complaint.status === 'IN_PROGRESS' && complaint.assignedVendor && (
                <div className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 flex flex-col justify-center">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Assigned To</span>
                  <span className="text-sm font-semibold text-slate-700 truncate">{complaint.assignedVendor.fullName}</span>
                </div>
              )}

              {/* Mark Resolved Button (For OPEN or IN_PROGRESS) */}
              {(complaint.status === 'OPEN' || complaint.status === 'IN_PROGRESS') && (
                <button 
                  onClick={() => handleUpdateStatus(complaint.id, 'RESOLVED')}
                  className="flex-1 py-2 bg-emerald-500 text-white rounded-lg text-sm font-semibold hover:bg-emerald-600 transition-colors shadow-sm flex items-center justify-center gap-2"
                >
                  <CheckCircle className="w-4 h-4" /> Resolve
                </button>
              )}
            </div>

          </div>
        ))}
        {filteredComplaints.length === 0 && (
          <div className="col-span-full py-12 text-center text-slate-500 bg-white rounded-2xl border border-slate-200 border-dashed">
            No complaints found matching your criteria.
          </div>
        )}
      </div>
    </div>
  );
}