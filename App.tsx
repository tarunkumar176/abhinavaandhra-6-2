
import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './src/contexts/AuthContext';
import ProtectedRoute from './src/components/admin/ProtectedRoute';
import Layout from './src/components/common/Layout';

const HomePage = lazy(() => import('./src/components/user/HomePage'));
const PaperView = lazy(() => import('./src/components/user/PaperView'));
const AdminLogin = lazy(() => import('./src/components/admin/AdminLogin'));
const AdminDashboard = lazy(() => import('./src/components/admin/AdminDashboard'));
const UploadPage = lazy(() => import('./src/components/admin/UploadPage'));

// Page components
const About = lazy(() => import('./src/components/pages/About'));
const Contact = lazy(() => import('./src/components/pages/Contact'));
const PrivacyPolicy = lazy(() => import('./src/components/pages/PrivacyPolicy'));
const TermsConditions = lazy(() => import('./src/components/pages/TermsConditions'));

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Suspense fallback={<div className="flex items-center justify-center h-screen bg-gray-100 text-primary">Loading...</div>}>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<HomePage />} />
              <Route path="paper/:date" element={<PaperView />} />
              
              {/* Page Routes */}
              <Route path="about" element={<About />} />
              <Route path="contact" element={<Contact />} />
              <Route path="privacy-policy" element={<PrivacyPolicy />} />
              <Route path="terms-conditions" element={<TermsConditions />} />
              <Route path="archive" element={<About />} />
              <Route path="disclaimer" element={<PrivacyPolicy />} />
              <Route path="copyright" element={<TermsConditions />} />
            </Route>
            
            <Route path="/admin" element={<AdminLogin />} />
            
            <Route path="/admin/dashboard" element={
              <ProtectedRoute>
                <Layout isAdmin>
                  <AdminDashboard />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/admin/upload" element={
              <ProtectedRoute>
                <Layout isAdmin>
                  <UploadPage />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
