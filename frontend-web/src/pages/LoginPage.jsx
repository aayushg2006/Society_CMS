import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Building2, Lock, Mail, ShieldCheck, Zap, Users } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await api.post('/users/login', {
        email: email,
        password: password
      });

      localStorage.setItem('token', response.data.token);
      localStorage.setItem('role', response.data.role);
      localStorage.setItem('fullName', response.data.fullName);

      navigate('/dashboard');
      
    } catch (err) {
      setError(err.response?.data || 'Invalid credentials. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex font-sans bg-slate-50">
      
      {/* Left Panel: Branding & Features (Hidden on smaller screens) */}
      <div className="hidden lg:flex lg:w-1/2 bg-slate-900 flex-col justify-between p-12 relative overflow-hidden">
        {/* Subtle background decoration */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
           <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-indigo-500 blur-3xl"></div>
           <div className="absolute bottom-10 right-10 w-72 h-72 rounded-full bg-blue-500 blur-3xl"></div>
        </div>

        <div className="relative z-10 flex items-center">
          <Building2 className="w-10 h-10 text-indigo-500 mr-4" />
          <span className="text-white font-bold text-2xl tracking-wide">Society SaaS</span>
        </div>

        <div className="relative z-10 max-w-lg">
          <h1 className="text-4xl font-extrabold text-white leading-tight mb-6">
            Modernize your <br/>
            <span className="text-indigo-400">housing society</span> management.
          </h1>
          
          <div className="space-y-6 mt-10">
            <div className="flex items-center text-slate-300">
              <div className="bg-slate-800 p-2 rounded-lg mr-4">
                <ShieldCheck className="w-6 h-6 text-indigo-400" />
              </div>
              <p className="text-sm">AI-Powered spam detection for resident complaints</p>
            </div>
            <div className="flex items-center text-slate-300">
              <div className="bg-slate-800 p-2 rounded-lg mr-4">
                <Users className="w-6 h-6 text-indigo-400" />
              </div>
              <p className="text-sm">Community trust layer and reputation scoring</p>
            </div>
            <div className="flex items-center text-slate-300">
              <div className="bg-slate-800 p-2 rounded-lg mr-4">
                <Zap className="w-6 h-6 text-indigo-400" />
              </div>
              <p className="text-sm">Real-time status tracking and vendor assignment</p>
            </div>
          </div>
        </div>

        <div className="relative z-10 text-slate-500 text-sm">
          &copy; 2026 Society SaaS. All rights reserved.
        </div>
      </div>

      {/* Right Panel: Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-slate-100 p-8">
          
          <div className="text-center mb-8 lg:hidden">
             <Building2 className="w-12 h-12 text-indigo-600 mx-auto mb-4" />
             <h2 className="text-2xl font-bold text-slate-900">Society SaaS</h2>
          </div>

          <div className="mb-8 text-center lg:text-left">
            <h2 className="text-2xl font-bold text-slate-900">Welcome back</h2>
            <p className="text-slate-500 mt-2 text-sm">Please enter your admin credentials to continue.</p>
          </div>

          {error && (
            <div className="bg-rose-50 text-rose-600 px-4 py-3 rounded-xl text-sm mb-6 border border-rose-100 flex items-center">
              <AlertTriangle className="w-4 h-4 mr-2" />
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="email"
                  required
                  className="block w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all outline-none text-slate-900"
                  placeholder="admin@society.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="password"
                  required
                  className="block w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all outline-none text-slate-900"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center items-center py-3 px-4 rounded-xl shadow-md text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all disabled:opacity-70"
            >
              {isLoading ? (
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : 'Sign In'}
            </button>
          </form>
          
        </div>
      </div>
    </div>
  );
}

// Quick helper icon for the error message
function AlertTriangle(props) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
      <line x1="12" y1="9" x2="12" y2="13"></line>
      <line x1="12" y1="17" x2="12.01" y2="17"></line>
    </svg>
  );
}