import { useState, useEffect } from 'react';
import { User, Lock, Building2, Bell, Shield, Save } from 'lucide-react';
import api from '../services/api'; // <-- Don't forget to import your API!

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('society'); 
  const [isLoading, setIsLoading] = useState(false);
  
  // State to hold the dynamic form data
  const [societyData, setSocietyData] = useState({
    name: "",
    address: "",
    registrationNumber: "",
    totalWings: "",
    totalFloors: "",
    totalFlats: "",
    amenities: []
  });
  
  const fullName = localStorage.getItem('fullName') || 'Admin User';
  const role = localStorage.getItem('role') || 'ADMIN';
  const CURRENT_SOCIETY_ID = 1; // Assuming Admin belongs to Society 1

  // 1. Fetch the actual society data when the tab loads
  useEffect(() => {
    if (activeTab === 'society') {
      fetchSocietyDetails();
    }
  }, [activeTab]);

  const fetchSocietyDetails = async () => {
    try {
      const response = await api.get(`/societies/${CURRENT_SOCIETY_ID}`);
      if (response.data) {
        setSocietyData({
          name: response.data.name || "",
          address: response.data.address || "",
          registrationNumber: response.data.registrationNumber || "",
          totalWings: response.data.totalWings || "",
          totalFloors: response.data.totalFloors || "",
          totalFlats: response.data.totalFlats || "",
          amenities: response.data.amenities || []
        });
      }
    } catch (err) {
      console.error("Failed to fetch society details:", err);
    }
  };

  // 2. Handle standard text/number input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSocietyData(prev => ({
      ...prev,
      [name]: name.includes('total') ? parseInt(value) || '' : value
    }));
  };

  // 3. Handle checking/unchecking amenities
  const handleAmenityToggle = (amenityName) => {
    setSocietyData(prev => {
      const isSelected = prev.amenities.includes(amenityName);
      return {
        ...prev,
        amenities: isSelected 
          ? prev.amenities.filter(a => a !== amenityName) // Remove if already selected
          : [...prev.amenities, amenityName] // Add if not selected
      };
    });
  };

  // 4. Submit the dynamic data to the backend
  const handleSaveSociety = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await api.put(`/societies/${CURRENT_SOCIETY_ID}`, societyData);
      alert('Society infrastructure saved successfully!');
    } catch (err) {
      alert('Failed to save settings.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // List of all possible amenities for the checkboxes
  const ALL_AMENITIES = ['Clubhouse', 'Swimming Pool', 'Gymnasium', 'Kids Play Area', 'Visitor Parking', 'Solar Power', 'CCTV Network', 'Community Hall'];

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Account & Society Settings</h1>
        <p className="text-slate-500 mt-1">Manage your profile, security, and society infrastructure.</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col md:flex-row min-h-[600px]">
        
        {/* Left Side: Settings Navigation */}
        <div className="w-full md:w-64 bg-slate-50 border-r border-slate-200 p-6 flex flex-col gap-2">
          {/* ... keeping the same sidebar buttons ... */}
          <button onClick={() => setActiveTab('profile')} className={`flex items-center w-full px-4 py-3 rounded-xl text-sm font-medium transition-colors ${activeTab === 'profile' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-200'}`}>
            <User className="w-5 h-5 mr-3" /> Personal Profile
          </button>
          <button onClick={() => setActiveTab('security')} className={`flex items-center w-full px-4 py-3 rounded-xl text-sm font-medium transition-colors ${activeTab === 'security' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-200'}`}>
            <Lock className="w-5 h-5 mr-3" /> Security & Password
          </button>
          <button onClick={() => setActiveTab('society')} className={`flex items-center w-full px-4 py-3 rounded-xl text-sm font-medium transition-colors ${activeTab === 'society' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-200'}`}>
            <Building2 className="w-5 h-5 mr-3" /> Society Structure
          </button>
          <button onClick={() => setActiveTab('notifications')} className={`flex items-center w-full px-4 py-3 rounded-xl text-sm font-medium transition-colors ${activeTab === 'notifications' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-200'}`}>
            <Bell className="w-5 h-5 mr-3" /> Notifications
          </button>
        </div>

        {/* Right Side: Active Settings Form */}
        <div className="flex-1 p-8 overflow-y-auto max-h-[800px]">
          
          {/* PROFILE TAB (Placeholder for now) */}
          {activeTab === 'profile' && (
            <div className="animate-in fade-in duration-300">
              <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center">
                <User className="w-6 h-6 text-indigo-600 mr-2"/> Personal Profile
              </h2>
              <div className="text-slate-500">Profile form here...</div>
            </div>
          )}

          {/* SECURITY TAB (Placeholder for now) */}
          {activeTab === 'security' && (
            <div className="animate-in fade-in duration-300">
              <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center">
                <Lock className="w-6 h-6 text-indigo-600 mr-2"/> Security
              </h2>
              <div className="text-slate-500">Security form here...</div>
            </div>
          )}

          {/* SOCIETY STRUCTURE TAB */}
          {activeTab === 'society' && (
            <div className="animate-in fade-in duration-300">
              <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center">
                <Building2 className="w-6 h-6 text-indigo-600 mr-2"/> Society Infrastructure & Details
              </h2>
              
              <form onSubmit={handleSaveSociety} className="space-y-8">
                
                {/* Section 1: Core Details */}
                <div>
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 border-b border-slate-100 pb-2">1. Core Registration</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Legal Society Name</label>
                      <input type="text" name="name" value={societyData.name} onChange={handleInputChange} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-600 outline-none text-slate-900" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Government Reg. Number</label>
                      <input type="text" name="registrationNumber" value={societyData.registrationNumber} onChange={handleInputChange} placeholder="e.g. MH/MUM/1234/2010" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-600 outline-none text-slate-900" />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Full Address</label>
                      <textarea name="address" value={societyData.address} onChange={handleInputChange} rows="2" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-600 outline-none text-slate-900"></textarea>
                    </div>
                  </div>
                </div>

                {/* Section 2: Physical Structure */}
                <div>
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 border-b border-slate-100 pb-2">2. Physical Layout</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Total Wings / Blocks</label>
                      <input type="number" name="totalWings" value={societyData.totalWings} onChange={handleInputChange} min="1" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-600 outline-none text-slate-900" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Total Floors (Per Wing)</label>
                      <input type="number" name="totalFloors" value={societyData.totalFloors} onChange={handleInputChange} min="1" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-600 outline-none text-slate-900" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Total Flats / Units</label>
                      <input type="number" name="totalFlats" value={societyData.totalFlats} onChange={handleInputChange} min="1" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-600 outline-none text-slate-900" />
                    </div>
                  </div>
                </div>

                {/* Section 3: Amenities */}
                <div>
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 border-b border-slate-100 pb-2">3. Managed Amenities</h3>
                  <p className="text-xs text-slate-500 mb-4">Select the facilities available in your society.</p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {ALL_AMENITIES.map((amenity, idx) => (
                      <label key={idx} className="flex items-center p-3 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors">
                        <input 
                          type="checkbox" 
                          checked={societyData.amenities.includes(amenity)}
                          onChange={() => handleAmenityToggle(amenity)}
                          className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500" 
                        />
                        <span className="ml-2 text-sm text-slate-700 font-medium">{amenity}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <button type="submit" disabled={isLoading} className="flex items-center px-8 py-3 bg-indigo-600 text-white text-sm font-bold rounded-xl hover:bg-indigo-700 transition-colors shadow-md disabled:opacity-50">
                    <Save className="w-5 h-5 mr-2" /> {isLoading ? 'Saving...' : 'Save Society Structure'}
                  </button>
                </div>

              </form>
            </div>
          )}

          {/* NOTIFICATIONS TAB (Placeholder) */}
          {activeTab === 'notifications' && (
            <div className="animate-in fade-in duration-300">
              <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center">
                <Bell className="w-6 h-6 text-indigo-600 mr-2"/> Notifications
              </h2>
              <div className="text-slate-500">Notifications form here...</div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}