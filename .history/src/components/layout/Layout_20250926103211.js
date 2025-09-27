'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { ToastContainer } from '../ui/Toast';
import { PageLoader } from '../ui/Loader';
import { cn } from '@/lib/utils';

export default function Layout({ children, currentPath, onNavigate }) {
  const { user, isAuthenticated, loading } = useAuth();
  // On desktop, sidebar should be open by default, on mobile it should be closed
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [toasts, setToasts] = useState([]);

  const handleMenuToggle = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleNavigate = (path) => {
    if (path) {
      onNavigate?.(path);
    }
    setIsSidebarOpen(false); // Close mobile sidebar on navigation
  };

  const removeToast = (id) => {
    setToasts(toasts => toasts.filter(toast => toast.id !== id));
  };

  if (loading) {
    return <PageLoader />;
  }

  if (!isAuthenticated) {
    return children;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar 
        onMenuToggle={handleMenuToggle} 
        isSidebarOpen={isSidebarOpen}
      />
      
      <div className="flex justify-center">
        <div className="w-full max-w-screen-2xl flex">
          <Sidebar 
            isOpen={isSidebarOpen}
            currentPath={currentPath}
            onNavigate={handleNavigate}
          />
          
          <main className={cn(
            'flex-1 min-h-[calc(100vh-4rem)] transition-all duration-300',
            'lg:ml-70 w-full'
          )}>
            <div className="p-4 sm:p-6 lg:p-8 max-w-full mx-auto">
              <div className="max-w-screen-xl mx-auto">
                {children}
              </div>
            </div>
          </main>
        </div>
      </div>

      <ToastContainer toasts={toasts} onClose={removeToast} />
    </div>
  );
}