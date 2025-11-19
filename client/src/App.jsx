import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { FeedbackProvider } from './context/FeedbackContext';
import ProtectedRoute from './components/auth/ProtectedRoute'
import PermissionGate from './components/auth/PermissionGate';
import DashboardLayout from './components/dashboard/DashboardLayout';
import LoginPage from './pages/LoginPage';
import { lazy, Suspense } from 'react';

// Lazy load heavy components
import Home from './pages/Home';
import AdministradoresPage from './pages/dashboard/AdministradoresPage';
import CrearContraseña from './pages/CrearContraseña';

const PageLoader = () => (
  <div className="flex justify-center items-center h-screen bg-white">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
  </div>
);

function App() {
  // Get user from localStorage (instead of useAuth)

  return (
    <AuthProvider>
      <FeedbackProvider>
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            {/* <Route path="/" element={<LoginPage />} /> */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/crear-contrasena" element={<CrearContraseña />} />
            <Route path="/olvide-contrasena" element={<CrearContraseña />} />

            {/* Protected dashboard routes */}
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              {/* <Route index element={<HomePage />} /> */}
        
              {/* Only show "administradores" if user has permission */}
              <Route 
                path="administradores" 
                element={
                  <PermissionGate requiredPermission="allow_handle_users">
                    <AdministradoresPage />
                  </PermissionGate>
                } 
              />
              {/* Fallback route */}
            </Route>
          </Routes>
        </BrowserRouter>
      </FeedbackProvider>
    </AuthProvider>
  );
}

export default App;
