'use client';

import { useState } from 'react';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/layout/Layout';
import LoginForm from '@/components/ui/LoginForm';

// Doctor/Hospital Components
import DoctorDashboard from '@/components/doctor/Dashboard';
import PatientRecords from '@/components/doctor/PatientRecords';
import PatientDetails from '@/components/doctor/PatientDetails';
import CodeMapping from '@/components/doctor/CodeMapping';
import AuditLogs from '@/components/doctor/AuditLogs';

// Insurance Components
import ClaimsDashboard from '@/components/insurance/ClaimsDashboard';
import ClaimDetails from '@/components/insurance/ClaimDetails';
import FhirBundleViewer from '@/components/insurance/FhirBundleViewer';

// Government Components
import GovernmentAnalytics from '@/components/government/AnalyticsDashboard';

import { USER_ROLES } from '@/types/constants';

function AppContent() {
  const { user, isAuthenticated, login, loading } = useAuth();
  const [currentPath, setCurrentPath] = useState('/dashboard');
  const [loginLoading, setLoginLoading] = useState(false);
  const [selectedPatientId, setSelectedPatientId] = useState(null);
  const [selectedClaimId, setSelectedClaimId] = useState(null);

  const handleLogin = async (credentials) => {
    setLoginLoading(true);
    const result = await login(credentials);
    setLoginLoading(false);
    
    if (result.success) {
      // Set default path based on role
      const defaultPaths = {
        [USER_ROLES.DOCTOR]: '/doctor/dashboard',
        [USER_ROLES.HOSPITAL]: '/hospital/dashboard',
        [USER_ROLES.INSURANCE]: '/insurance/dashboard',
        [USER_ROLES.GOVERNMENT]: '/government/dashboard',
      };
      setCurrentPath(defaultPaths[credentials.role] || '/dashboard');
    }
  };

  const handleNavigate = (path) => {
    setCurrentPath(path);
  };

  const renderCurrentPage = () => {
    if (!isAuthenticated || !user) return null;

    // Doctor/Hospital Routes
    if (user.role === USER_ROLES.DOCTOR || user.role === USER_ROLES.HOSPITAL) {
      switch (currentPath) {
        case '/doctor/dashboard':
        case '/hospital/dashboard':
          return <DoctorDashboard />;
        case '/doctor/patients':
        case '/hospital/patients':
          return <PatientRecords />;
        case '/doctor/mapping':
        case '/hospital/mapping':
          return <CodeMapping />;
        case '/doctor/audit':
        case '/hospital/audit':
          return (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Audit Logs</h3>
              <p className="text-gray-500">Audit log component coming soon...</p>
            </div>
          );
        default:
          return <DoctorDashboard />;
      }
    }

    // Insurance Routes
    if (user.role === USER_ROLES.INSURANCE) {
      switch (currentPath) {
        case '/insurance/dashboard':
          return <ClaimsDashboard />;
        case '/insurance/claims':
          return <ClaimsDashboard />;
        case '/insurance/fhir':
          return <FhirBundleViewer />;
        case '/insurance/export':
          return (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Export Data</h3>
              <p className="text-gray-500">Export functionality coming soon...</p>
            </div>
          );
        default:
          return <ClaimsDashboard />;
      }
    }

    // Government Routes
    if (user.role === USER_ROLES.GOVERNMENT) {
      switch (currentPath) {
        case '/government/dashboard':
        case '/government/analytics':
          return <GovernmentAnalytics />;
        case '/government/trends':
          return (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Trend Analysis</h3>
              <p className="text-gray-500">Advanced trend analysis coming soon...</p>
            </div>
          );
        case '/government/reports':
          return (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Reports</h3>
              <p className="text-gray-500">Report generation coming soon...</p>
            </div>
          );
        default:
          return <GovernmentAnalytics />;
      }
    }

    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900 mb-2">Welcome to Ayush EMR</h3>
        <p className="text-gray-500">Select a menu item to get started.</p>
      </div>
    );
  };

  if (!isAuthenticated) {
    return <LoginForm onLogin={handleLogin} loading={loginLoading} />;
  }

  return (
    <Layout currentPath={currentPath} onNavigate={handleNavigate}>
      {renderCurrentPage()}
    </Layout>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}