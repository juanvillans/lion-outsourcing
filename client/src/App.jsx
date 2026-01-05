import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { FeedbackProvider } from './context/FeedbackContext';
import ProtectedRoute from './components/auth/ProtectedRoute'
import PermissionGate from './components/auth/PermissionGate';
import DashboardLayout from './components/dashboard/DashboardLayout';
import LoginPage from './pages/LoginPage';
import ApplyPage from './pages/ApplyPage';
import { lazy, Suspense } from 'react';

// Lazy load heavy components
import Home from './pages/Home';
import AdministradoresPage from './pages/dashboard/AdministradoresPage';
import TrabajadoresPage from './pages/dashboard/TrabajadoresPage';
import CrearContraseña from './pages/CrearContraseña';
import AplicantesPage from './pages/dashboard/AplicantesPage';
import DetalleAplicantePage from './pages/dashboard/DetalleAplicantePage';
import DetalleTrabajadorPage from './pages/dashboard/DetalleTrabajadorPage';

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
            <Route path="/aplicar" element={<ApplyPage />} />
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
                  <PermissionGate requiredPermission="allow_admins">
                    <AdministradoresPage />
                  </PermissionGate>
                } 
              />
              <Route 
                path="trabajadores" 
                element={
                  <PermissionGate requiredPermission="allow_talents">
                    <TrabajadoresPage />
                  </PermissionGate>
                } 
              />
              <Route path="trabajadores/:id" element={<DetalleTrabajadorPage />} />              
              <Route path="aplicantes" element={<AplicantesPage />} />
              <Route path="aplicantes/:id" element={<DetalleAplicantePage />} />

              <Route path="*" element={<Navigate to="/dashboard" replace />} />
              {/* Fallback route */}
              {/* <Route path="aplicantes" element={<AplicantesPage />} />
              <Route path="aplicantes/:id" element={<DetalleAplicantePage />} />               */}
            </Route>
          </Routes>
        </BrowserRouter>
      </FeedbackProvider>
    </AuthProvider>
  );
}

export default App;
