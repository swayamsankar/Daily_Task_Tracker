import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { SearchProvider } from './context/SearchContext';
import AppLayout from './components/common/AppLayout';
import Dashboard from './components/Dashboard/Dashboard';
import Tasks from './components/Tasks/Tasks';
import Analytics from './components/Analytics/Analytics';
import Settings from './components/Settings/Settings';
import Login from './components/Auth/Login';
import Signup from './components/Auth/Signup';
import { BottomNav } from "./components/BottomNav/BottomNav";


import './styles/global.css';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
      <div className="spinner" />
    </div>
  );
  return user ? children : <Navigate to="/login" replace />;
};

const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  return user ? <Navigate to="/" replace /> : children;
};

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
      <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />
      <Route path="/" element={<PrivateRoute><AppLayout><Dashboard /></AppLayout></PrivateRoute>} />
      <Route path="/tasks" element={<PrivateRoute><AppLayout><Tasks /></AppLayout></PrivateRoute>} />
      <Route path="/analytics" element={<PrivateRoute><AppLayout><Analytics /></AppLayout></PrivateRoute>} />
      <Route path="/settings" element={<PrivateRoute><AppLayout><Settings /></AppLayout></PrivateRoute>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

// Custom hook to detect laptop/desktop size
function useIsLaptop() {
  const [isLaptop, setIsLaptop] = React.useState(window.innerWidth >= 1024);

  React.useEffect(() => {
    function handleResize() {
      setIsLaptop(window.innerWidth >= 1024);
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return isLaptop;
}

export default function App() {
  const isLaptop = useIsLaptop();

  return (
    <>
      {/* Routes */}
      <AuthProvider>
        <BrowserRouter>
          <SearchProvider>
            <AppRoutes />
            {!isLaptop && <BottomNav />}
          </SearchProvider>
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: 'var(--bg-card)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border)',
                borderRadius: '10px',
                fontSize: '13px',
              },
              success: { iconTheme: { primary: '#00e5a0', secondary: '#fff' } },
              error: { iconTheme: { primary: '#ff4d6d', secondary: '#fff' } },
            }}
          />
        </BrowserRouter>
      </AuthProvider>
    </>
  );
}
