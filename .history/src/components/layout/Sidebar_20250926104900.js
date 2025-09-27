'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard,
  Users,
  FileText,
  Activity,
  Shield,
  BarChart3,
  Search,
  History,
  MapPin,
  ClipboardList,
  Download,
  TrendingUp,
  Filter,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { USER_ROLES } from '@/types/constants';
import { cn } from '@/lib/utils';

const menuItems = {
  [USER_ROLES.DOCTOR]: [
    { 
      icon: LayoutDashboard, 
      label: 'Dashboard', 
      href: '/doctor/dashboard',
      badge: null
    },
    { 
      icon: Users, 
      label: 'Patient Records', 
      href: '/doctor/patients',
      badge: null
    },
    { 
      icon: MapPin, 
      label: 'Code Mapping', 
      href: '/doctor/mapping',
      badge: 'New'
    },
    { 
      icon: History, 
      label: 'Audit Logs', 
      href: '/doctor/audit',
      badge: null
    },
  ],
  [USER_ROLES.HOSPITAL]: [
    { 
      icon: LayoutDashboard, 
      label: 'Dashboard', 
      href: '/hospital/dashboard',
      badge: null
    },
    { 
      icon: Users, 
      label: 'Patient Records', 
      href: '/hospital/patients',
      badge: null
    },
    { 
      icon: MapPin, 
      label: 'Code Mapping', 
      href: '/hospital/mapping',
      badge: null
    },
    { 
      icon: History, 
      label: 'Audit Logs', 
      href: '/hospital/audit',
      badge: null
    },
    { 
      icon: Activity, 
      label: 'System Health', 
      href: '/hospital/health',
      badge: null
    },
  ],
  [USER_ROLES.INSURANCE]: [
    { 
      icon: LayoutDashboard, 
      label: 'Dashboard', 
      href: '/insurance/dashboard',
      badge: null
    },
    { 
      icon: ClipboardList, 
      label: 'Claims', 
      href: '/insurance/claims',
      badge: '12'
    },
    { 
      icon: FileText, 
      label: 'FHIR Bundles', 
      href: '/insurance/fhir',
      badge: null
    },
    { 
      icon: Download, 
      label: 'Export Data', 
      href: '/insurance/export',
      badge: null
    },
  ],
  [USER_ROLES.GOVERNMENT]: [
    { 
      icon: LayoutDashboard, 
      label: 'Dashboard', 
      href: '/government/dashboard',
      badge: null
    },
    { 
      icon: BarChart3, 
      label: 'Analytics', 
      href: '/government/analytics',
      badge: null
    },
    { 
      icon: TrendingUp, 
      label: 'Trends', 
      href: '/government/trends',
      badge: null
    },
    { 
      icon: Download, 
      label: 'Reports', 
      href: '/government/reports',
      badge: null
    },
  ],
};

export default function Sidebar({ isOpen, currentPath, onNavigate }) {
  const { user } = useAuth();
  const items = menuItems[user?.role] || [];
  
  // On desktop (lg+), sidebar should always be open
  const isVisible = isOpen;

  return (
    <>
      {/* Backdrop for mobile */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-20 bg-black bg-opacity-50 lg:hidden"
            onClick={() => onNavigate(null)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        className={cn(
          // Mobile styles: fixed positioning with transform
          'fixed top-16 left-0 z-30 w-64 h-[calc(100vh-4rem)] bg-white border-r border-gray-200 shadow-sm transition-transform duration-300',
          // Desktop styles: static positioning, always visible
          'lg:translate-x-0 lg:static lg:z-0 lg:shadow-none lg:block',
          // Mobile visibility based on isOpen state
          isOpen ? 'translate-x-0' : '-translate-x-full',
          // Desktop override: always visible
          'lg:translate-x-0'
        )}
      >
        <div className="flex flex-col h-full">
          {/* Search */}
          <div className="p-4 border-b border-gray-600">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search..."
                className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto">
            {items.map((item, index) => {
              const Icon = item.icon;
              const isActive = currentPath === item.href;
              
              return (
                <motion.button
                  key={item.href}
                  onClick={() => onNavigate(item.href)}
                  className={cn(
                    'w-full flex items-center justify-between px-3 py-3 text-left rounded-lg transition-all duration-200',
                    'hover:bg-blue-50 hover:text-blue-700 group',
                    isActive ? 'bg-blue-100 text-blue-700 shadow-sm' : 'text-gray-700'
                  )}
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="flex items-center">
                    <Icon className={cn(
                      'w-5 h-5 mr-3',
                      isActive ? 'text-blue-600' : 'text-gray-500 group-hover:text-blue-600'
                    )} />
                    <span className="font-medium">{item.label}</span>
                  </div>
                  
                  <div className="flex items-center">
                    {item.badge && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className={cn(
                          'px-2 py-1 text-xs font-medium rounded-full',
                          item.badge === 'New' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-blue-100 text-blue-800'
                        )}
                      >
                        {item.badge}
                      </motion.span>
                    )}
                    <ChevronRight className={cn(
                      'w-4 h-4 ml-2 opacity-0 group-hover:opacity-100 transition-opacity',
                      isActive && 'opacity-100'
                    )} />
                  </div>
                </motion.button>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200">
            <div className="text-center">
              <p className="text-xs text-gray-500 mb-2">Ayush EMR System</p>
              <div className="flex items-center justify-center space-x-2 text-xs text-gray-400">
                <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                <span>System Online</span>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}