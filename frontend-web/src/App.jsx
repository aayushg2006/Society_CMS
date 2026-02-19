import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import Layout from './components/Layout';

// A simple component to protect routes (forces login)
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" replace />;
};

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      
      {/* Any route wrapped in this Layout will have the Sidebar and Header */}
      <Route 
        path="/" 
        element={
          <PrivateRoute>
            <Layout />
          </PrivateRoute>
        }
      >
        {/* Default route redirects to dashboard */}
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
        
        {/* We will build these pages later */}
        <Route path="complaints" element={<div className="text-slate-500">Complaints Page Coming Soon</div>} />
        <Route path="users" element={<div className="text-slate-500">Users Page Coming Soon</div>} />
        <Route path="settings" element={<div className="text-slate-500">Settings Page Coming Soon</div>} />
      </Route>
    </Routes>
  );
}

export default App;