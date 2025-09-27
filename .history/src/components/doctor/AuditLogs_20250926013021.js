'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  Filter, 
  Download, 
  Calendar,
  User,
  Activity,
  MapPin,
  FileText,
  Shield,
  AlertTriangle,
  CheckCircle,
  Clock,
  Eye,
  RefreshCw
} from 'lucide-react';
import Card, { CardHeader, CardTitle, CardContent } from '../ui/Card';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Badge from '../ui/Badge';
import { formatDateTime, formatDate } from '@/lib/utils';

const mockAuditLogs = [
  {
    id: 'AUDIT-001',
    timestamp: '2024-01-15T14:30:00Z',
    user: 'Dr. Rajesh Sharma',
    userRole: 'Doctor',
    action: 'Patient Record Updated',
    resource: 'Patient',
    resourceId: 'PAT-001',
    details: 'Updated diagnosis for Rajesh Kumar - Added Type 2 Diabetes',
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    status: 'Success',
    confidence: 95,
    changes: {
      field: 'diagnosis',
      oldValue: 'Hypertension',
      newValue: 'Hypertension, Type 2 Diabetes'
    }
  },
  {
    id: 'AUDIT-002',
    timestamp: '2024-01-15T13:45:00Z',
    user: 'AI Code Mapper',
    userRole: 'System',
    action: 'Code Mapping Performed',
    resource: 'CodeMapping',
    resourceId: 'MAP-002',
    details: 'Mapped HTN001 to ICD-11 code 8A80.0 with 92% confidence',
    ipAddress: '10.0.0.1',
    userAgent: 'System/1.0',
    status: 'Success',
    confidence: 92,
    changes: {
      originalCode: 'HTN001',
      mappedCode: '8A80.0',
      system: 'ICD-11'
    }
  },
  {
    id: 'AUDIT-003',
    timestamp: '2024-01-15T12:20:00Z',
    user: 'Insurance Officer',
    userRole: 'Insurance',
    action: 'Claim Approved',
    resource: 'Claim',
    resourceId: 'CLM-2024-001',
    details: 'Approved claim for ₹14,500 after review',
    ipAddress: '203.45.67.89',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    status: 'Success',
    confidence: null,
    changes: {
      status: 'approved',
      approvedAmount: 14500,
      originalAmount: 15000
    }
  },
  {
    id: 'AUDIT-004',
    timestamp: '2024-01-15T11:15:00Z',
    user: 'Dr. Priya Patel',
    userRole: 'Doctor',
    action: 'Failed Login Attempt',
    resource: 'Authentication',
    resourceId: null,
    details: 'Invalid password attempt for user: priya.patel@hospital.com',
    ipAddress: '192.168.1.105',
    userAgent: 'Mozilla/5.0 (MacOS) AppleWebKit/537.36',
    status: 'Failed',
    confidence: null,
    changes: null
  },
  {
    id: 'AUDIT-005',
    timestamp: '2024-01-15T10:30:00Z',
    user: 'Government Analyst',
    userRole: 'Government',
    action: 'Analytics Report Generated',
    resource: 'Report',
    resourceId: 'RPT-2024-001',
    details: 'Generated morbidity trends report for Q4 2023',
    ipAddress: '172.16.0.50',
    userAgent: 'Mozilla/5.0 (Linux) AppleWebKit/537.36',
    status: 'Success',
    confidence: null,
    changes: {
      reportType: 'Morbidity Trends',
      period: 'Q4 2023',
      recordsAnalyzed: 15420
    }
  },
  {
    id: 'AUDIT-006',
    timestamp: '2024-01-15T09:45:00Z',
    user: 'System Admin',
    userRole: 'Admin',
    action: 'User Account Created',
    resource: 'User',
    resourceId: 'USR-025',
    details: 'Created new doctor account for Dr. Amit Singh',
    ipAddress: '10.0.0.10',
    userAgent: 'AdminPanel/2.0',
    status: 'Success',
    confidence: null,
    changes: {
      username: 'amit.singh@hospital.com',
      role: 'Doctor',
      department: 'Cardiology'
    }
  }
];

const actionTypes = [
  { value: 'all', label: 'All Actions' },
  { value: 'Patient Record Updated', label: 'Patient Updates' },
  { value: 'Code Mapping Performed', label: 'Code Mapping' },
  { value: 'Claim Approved', label: 'Claim Actions' },
  { value: 'Failed Login Attempt', label: 'Security Events' },
  { value: 'Analytics Report Generated', label: 'Reports' },
  { value: 'User Account Created', label: 'User Management' }
];

const statusOptions = [
  { value: 'all', label: 'All Status' },
  { value: 'Success', label: 'Success' },
  { value: 'Failed', label: 'Failed' },
  { value: 'Warning', label: 'Warning' }
];

const userRoleOptions = [
  { value: 'all', label: 'All Roles' },
  { value: 'Doctor', label: 'Doctor' },
  { value: 'Insurance', label: 'Insurance' },
  { value: 'Government', label: 'Government' },
  { value: 'System', label: 'System' },
  { value: 'Admin', label: 'Admin' }
];

export default function AuditLogs() {
  const [logs, setLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [actionFilter, setActionFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [roleFilter, setRoleFilter] = useState('all');
  const [dateRange, setDateRange] = useState('today');
  const [selectedLog, setSelectedLog] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setLogs(mockAuditLogs);
      setFilteredLogs(mockAuditLogs);
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    let filtered = logs;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(log =>
        log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.resourceId?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Action filter
    if (actionFilter !== 'all') {
      filtered = filtered.filter(log => log.action === actionFilter);
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(log => log.status === statusFilter);
    }

    // Role filter
    if (roleFilter !== 'all') {
      filtered = filtered.filter(log => log.userRole === roleFilter);
    }

    // Date range filter (simplified)
    if (dateRange !== 'all') {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      
      filtered = filtered.filter(log => {
        const logDate = new Date(log.timestamp);
        
        switch (dateRange) {
          case 'today':
            return logDate >= today;
          case 'week':
            const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
            return logDate >= weekAgo;
          case 'month':
            const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
            return logDate >= monthAgo;
          default:
            return true;
        }
      });
    }

    setFilteredLogs(filtered);
  }, [searchTerm, actionFilter, statusFilter, roleFilter, dateRange, logs]);

  const getStatusBadge = (status) => {
    const variants = {
      'Success': { variant: 'success', icon: CheckCircle },
      'Failed': { variant: 'danger', icon: AlertTriangle },
      'Warning': { variant: 'warning', icon: AlertTriangle }
    };
    const config = variants[status] || { variant: 'default', icon: Clock };
    const Icon = config.icon;
    return (
      <Badge variant={config.variant} size="sm">
        <Icon className="w-3 h-3 mr-1" />
        {status}
      </Badge>
    );
  };

  const getRoleIcon = (role) => {
    const icons = {
      'Doctor': User,
      'Insurance': Shield,
      'Government': FileText,
      'System': Activity,
      'Admin': Shield
    };
    return icons[role] || User;
  };

  const getActionIcon = (action) => {
    if (action.includes('Patient')) return User;
    if (action.includes('Code Mapping')) return MapPin;
    if (action.includes('Claim')) return FileText;
    if (action.includes('Login')) return Shield;
    if (action.includes('Report')) return FileText;
    if (action.includes('User')) return User;
    return Activity;
  };

  const handleViewDetails = (log) => {
    setSelectedLog(log);
    setShowDetails(true);
  };

  const handleExportLogs = () => {
    // In real app, would trigger CSV/PDF export
    console.log('Exporting audit logs...');
  };

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      setLogs([...mockAuditLogs]);
      setLoading(false);
    }, 1000);
  };

  if (loading) {
    return (
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="h-32 bg-gray-200 rounded mb-6"></div>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Audit Logs</h1>
          <p className="text-gray-600 mt-1">
            Monitor system activities and user actions across the platform
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={handleRefresh} size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button onClick={handleExportLogs} size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
            <div className="lg:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search logs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div>
              <Select
                options={actionTypes}
                value={actionFilter}
                onChange={setActionFilter}
                placeholder="Action Type"
              />
            </div>
            <div>
              <Select
                options={statusOptions}
                value={statusFilter}
                onChange={setStatusFilter}
                placeholder="Status"
              />
            </div>
            <div>
              <Select
                options={userRoleOptions}
                value={roleFilter}
                onChange={setRoleFilter}
                placeholder="User Role"
              />
            </div>
            <div>
              <Select
                options={[
                  { value: 'all', label: 'All Time' },
                  { value: 'today', label: 'Today' },
                  { value: 'week', label: 'This Week' },
                  { value: 'month', label: 'This Month' }
                ]}
                value={dateRange}
                onChange={setDateRange}
                placeholder="Date Range"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Audit Log List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Audit Trail ({filteredLogs.length} entries)</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          {filteredLogs.length === 0 ? (
            <div className="text-center py-12">
              <Activity className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Audit Logs Found</h3>
              <p className="text-gray-500">
                {searchTerm || actionFilter !== 'all' || statusFilter !== 'all' || roleFilter !== 'all'
                  ? 'Try adjusting your search or filter criteria.'
                  : 'No audit logs are available for the selected time period.'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredLogs.map((log, index) => {
                const ActionIcon = getActionIcon(log.action);
                const RoleIcon = getRoleIcon(log.userRole);
                
                return (
                  <motion.div
                    key={log.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-start space-x-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <ActionIcon className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <h4 className="font-medium text-gray-900">{log.action}</h4>
                          {getStatusBadge(log.status)}
                          {log.confidence && (
                            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                              {log.confidence}% confidence
                            </span>
                          )}
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-500">{formatDateTime(log.timestamp)}</span>
                          <Button variant="outline" size="sm" onClick={() => handleViewDetails(log)}>
                            <Eye className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{log.details}</p>
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <div className="flex items-center space-x-1">
                          <RoleIcon className="w-3 h-3" />
                          <span>{log.user} ({log.userRole})</span>
                        </div>
                        {log.resourceId && (
                          <>
                            <span>•</span>
                            <span>Resource: {log.resourceId}</span>
                          </>
                        )}
                        <span>•</span>
                        <span>IP: {log.ipAddress}</span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Details Modal */}
      {showDetails && selectedLog && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" onClick={() => setShowDetails(false)}>
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Audit Log Details</h3>
                  <button
                    onClick={() => setShowDetails(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Timestamp</label>
                    <p className="text-gray-900">{formatDateTime(selectedLog.timestamp)}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">User</label>
                    <p className="text-gray-900">{selectedLog.user} ({selectedLog.userRole})</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Action</label>
                    <p className="text-gray-900">{selectedLog.action}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Details</label>
                    <p className="text-gray-900">{selectedLog.details}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">IP Address</label>
                    <p className="text-gray-900">{selectedLog.ipAddress}</p>
                  </div>
                  {selectedLog.changes && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Changes</label>
                      <pre className="text-sm text-gray-900 bg-gray-50 p-2 rounded mt-1">
                        {JSON.stringify(selectedLog.changes, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}