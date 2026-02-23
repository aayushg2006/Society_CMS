import { useState, useEffect, useRef } from 'react';
import Papa from 'papaparse';
import { Users, Upload, UserPlus, Shield, Star } from 'lucide-react';
import api from '../services/api';

export default function ResidentsPage() {
  const [residents, setResidents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [uploadStatus, setUploadStatus] = useState('');
  const fileInputRef = useRef(null);

  // Hardcoded for now; in a real app, you'd pull this from the Admin's logged-in profile
  const CURRENT_SOCIETY_ID = 1; 

  useEffect(() => {
    fetchResidents();
  }, []);

  const fetchResidents = async () => {
    try {
      const response = await api.get(`/users/society/${CURRENT_SOCIETY_ID}`);
      setResidents(response.data);
    } catch (err) {
      console.error("Failed to fetch residents", err);
    } finally {
      setIsLoading(false);
    }
  };

  // --- CSV UPLOAD LOGIC ---
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setUploadStatus('Parsing CSV...');

    Papa.parse(file, {
      header: true, // Expects CSV to have headers like: FullName, Email, FlatNo, Role
      skipEmptyLines: true,
      complete: async (results) => {
        const rows = results.data;
        let successCount = 0;
        let failCount = 0;

        setUploadStatus(`Uploading ${rows.length} residents to database...`);

        for (const row of rows) {
          try {
            // We hit the existing register API for each row.
            // We assign a default password that they can change later.
            await api.post('/users/register', {
              societyId: CURRENT_SOCIETY_ID,
              fullName: row.FullName || row.fullName || 'Unknown',
              email: row.Email || row.email,
              password: 'ResidentPassword123!', // Default password
              role: (row.Role || row.role || 'RESIDENT').toUpperCase(),
              flatNo: row.FlatNo || row.flatNo || '',
              phoneNumber: row.Phone || row.phoneNumber || ''
            });
            successCount++;
          } catch (err) {
            console.error(`Failed to upload ${row.Email}`, err);
            failCount++;
          }
        }

        setUploadStatus(`Upload Complete! Success: ${successCount}, Failed: ${failCount}`);
        fetchResidents(); // Refresh the table
        
        // Reset the file input
        if (fileInputRef.current) fileInputRef.current.value = '';
      },
      error: (error) => {
        setUploadStatus(`Error parsing CSV: ${error.message}`);
      }
    });
  };

  if (isLoading) return <div className="p-8 text-slate-500">Loading residents...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Society Residents</h1>
        
        <div className="flex gap-3">
          {/* Hidden File Input */}
          <input 
            type="file" 
            accept=".csv" 
            className="hidden" 
            ref={fileInputRef} 
            onChange={handleFileUpload} 
          />
          
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center px-4 py-2 bg-white border border-slate-200 text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-50 shadow-sm transition-colors"
          >
            <Upload className="w-4 h-4 mr-2 text-indigo-600" />
            Bulk Import CSV
          </button>

          <button className="flex items-center px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 shadow-sm transition-colors">
            <UserPlus className="w-4 h-4 mr-2" />
            Add Resident
          </button>
        </div>
      </div>

      {uploadStatus && (
        <div className="bg-indigo-50 text-indigo-700 p-4 rounded-xl mb-6 border border-indigo-100 font-medium">
          {uploadStatus}
        </div>
      )}

      {/* Residents Data Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
              <tr>
                <th className="px-6 py-4">Resident Name</th>
                <th className="px-6 py-4">Contact Info</th>
                <th className="px-6 py-4">Flat No</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Reputation Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {residents.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-slate-400">
                    No residents found. Upload a CSV to get started.
                  </td>
                </tr>
              ) : (
                residents.map((resident) => (
                  <tr key={resident.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold mr-3">
                          {resident.fullName.charAt(0)}
                        </div>
                        <span className="font-semibold text-slate-900">{resident.fullName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-slate-900">{resident.email}</p>
                      <p className="text-xs text-slate-400">{resident.phoneNumber || 'No phone added'}</p>
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-700">
                      {resident.flatNo || 'N/A'}
                    </td>
                    <td className="px-6 py-4">
                      {resident.role === 'ADMIN' ? (
                        <span className="px-2.5 py-1 bg-rose-100 text-rose-700 rounded-md text-xs font-medium flex items-center w-fit">
                          <Shield className="w-3 h-3 mr-1" /> Admin
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-md text-xs font-medium w-fit">
                          {resident.role}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center font-medium text-emerald-600">
                        <Star className="w-4 h-4 mr-1 fill-emerald-100" />
                        {resident.reputationScore}
                      </div>
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