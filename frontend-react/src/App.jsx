import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import { ThemeProvider } from '@/components/ThemeProvider';

import Home from './pages/Home';
import Login from './pages/Login'
import Admin from './pages/Admin';
import AdminProfile from './pages/AdminProfile';
import AdminSkills from './pages/AdminSkills';
import AdminProjects from './pages/AdminProjects';
import AdminExperience from './pages/AdminExperience';
import AdminEducation from './pages/AdminEducation';
import AdminCertificates from './pages/AdminCertificates';
import AdminMessages from './pages/AdminMessages';
import AdminLayout from './components/admin/AdminLayout';

// 🔐 simple protected route
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div className="text-center py-20">Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/Home" element={<Home />} />
      <Route path="/login" element={<Login />} />

      {/* 🔐 Admin protected */}
      <Route
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/Admin" element={<Admin />} />
        <Route path="/AdminProfile" element={<AdminProfile />} />
        <Route path="/AdminSkills" element={<AdminSkills />} />
        <Route path="/AdminProjects" element={<AdminProjects />} />
        <Route path="/AdminExperience" element={<AdminExperience />} />
        <Route path="/AdminEducation" element={<AdminEducation />} />
        <Route path="/AdminCertificates" element={<AdminCertificates />} />
        <Route path="/AdminMessages" element={<AdminMessages />} />
      </Route>

      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <QueryClientProvider client={queryClientInstance}>
          <Router>
            <AppRoutes />
          </Router>
          <Toaster />
        </QueryClientProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App;