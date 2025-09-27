'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, 
  Filter, 
  Download, 
  Eye, 
  Calendar,
  DollarSign,
  CheckCircle,
  Clock,
  AlertTriangle,
  Search,
  MoreVertical
} from 'lucide-react';
import Card, { CardHeader, CardTitle, CardContent } from '../ui/Card';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Badge from '../ui/Badge';
import Modal from '../ui/Modal';
import { formatDate, formatDateTime } from '@/lib/utils';

const mockClaims = [
  {
    id: 'CLM-2024-001',
    patientName: 'Rajesh Kumar',
    patientAbhaId: '12345678901234',
    diagnosis: 'Hypertension',
    icd11Code: '8A80.0',
    claimAmount: 15000,
    submittedDate: '2024-01-15',
    status: 'approved',
    provider: 'AIIMS Delhi',
    fhirBundleId: 'bundle-001',
    confidence: 95
  },
  {
    id: 'CLM-2024-002',
    patientName: 'Priya Sharma',
    patientAbhaId: '23456789012345',
    diagnosis: 'Diabetes Type 2',
    icd11Code: '5A11.0',
    claimAmount: 8500,
    submittedDate: '2024-01-14',
    status: 'pending',
    provider: 'Max Healthcare',
    fhirBundleId: 'bundle-002',
    confidence: 87
  },
  {
    id: 'CLM-2024-003',
    patientName: 'Amit Singh',
    patientAbhaId: '34567890123456',
    diagnosis: 'Common Cold',
    icd11Code: 'CA40.0',
    claimAmount: 2500,
    submittedDate: '2024-01-13',
    status: 'rejected',
    provider: 'Fortis Hospital',
    fhirBundleId: 'bundle-003',
    confidence: 78
  },
  {
    id: 'CLM-2024-004',
    patientName: 'Sunita Devi',
    patientAbhaId: '45678901234567',
    diagnosis: 'Arthritis',
    icd11Code: 'FA20.0',
    claimAmount: 12000,
    submittedDate: '2024-01-12',
    status: 'under_review',
    provider: 'Apollo Hospital',
    fhirBundleId: 'bundle-004',
    confidence: 92
  }
];

const statusOptions = [
  { value: 'all', label: 'All Status' },
  { value: 'pending', label: 'Pending' },
  { value: 'approved', label: 'Approved' },
  { value: 'rejected', label: 'Rejected' },
  { value: 'under_review', label: 'Under Review' }
];

export default function ClaimsDashboard() {
  const [claims, setClaims] = useState(mockClaims);
  const [filteredClaims, setFilteredClaims] = useState(mockClaims);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedClaim, setSelectedClaim] = useState(null);
  const [showClaimDetails, setShowClaimDetails] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let filtered = claims;

    if (searchTerm) {
      filtered = filtered.filter(claim =>
        claim.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        claim.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        claim.diagnosis.toLowerCase().includes(searchTerm.toLowerCase()) ||
        claim.provider.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(claim => claim.status === statusFilter);
    }

    setFilteredClaims(filtered);
  }, [searchTerm, statusFilter, claims]);

  const getStatusBadge = (status) => {
    const variants = {
      approved: { variant: 'success', label: 'Approved' },
      pending: { variant: 'warning', label: 'Pending' },
      rejected: { variant: 'danger', label: 'Rejected' },
      under_review: { variant: 'info', label: 'Under Review' }
    };
    const config = variants[status] || { variant: 'default', label: status };
    return <Badge variant={config.variant} size="sm">{config.label}</Badge>;
  };

  const handleViewClaim = (claim) => {
    setSelectedClaim(claim);
    setShowClaimDetails(true);
  };

  const handleExportClaims = async () => {
    setLoading(true);
    // Simulate export process
    await new Promise(resolve => setTimeout(resolve, 2000));
    setLoading(false);
    // In real app, would trigger download
  };

  const stats = {
    total: claims.length,
    approved: claims.filter(c => c.status === 'approved').length,
    pending: claims.filter(c => c.status === 'pending').length,
    totalAmount: claims.reduce((sum, claim) => sum + claim.claimAmount, 0)
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Claims Dashboard</h1>
          <p className="text-gray-600 mt-1">Process and review insurance claims with dual-coded FHIR data</p>
        </div>
        <Button 
          onClick={handleExportClaims}
          loading={loading}
          className="flex items-center"
        >
          <Download className="w-4 h-4 mr-2" />
          Export Claims
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Claims</p>
                  <p className="text-2xl font-bold text-gray-900 mt-2">{stats.total}</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-lg">
                  <FileText className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Approved</p>
                  <p className="text-2xl font-bold text-green-600 mt-2">{stats.approved}</p>
                </div>
                <div className="p-3 bg-green-100 rounded-lg">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending</p>
                  <p className="text-2xl font-bold text-orange-600 mt-2">{stats.pending}</p>
                </div>
                <div className="p-3 bg-orange-100 rounded-lg">
                  <Clock className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Amount</p>
                  <p className="text-2xl font-bold text-gray-900 mt-2">₹{stats.totalAmount.toLocaleString()}</p>
                </div>
                <div className="p-3 bg-purple-100 rounded-lg">
                  <DollarSign className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <div className="flex-1">
              <Input
                placeholder="Search by claim ID, patient name, diagnosis, or provider..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                icon={Search}
              />
            </div>
            <div className="sm:w-48">
              <Select
                options={statusOptions}
                value={statusFilter}
                onChange={setStatusFilter}
                placeholder="Filter by status"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Claims Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="w-5 h-5 mr-2" />
            Insurance Claims
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Claim ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Patient
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Diagnosis
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Provider
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <AnimatePresence>
                  {filteredClaims.map((claim, index) => (
                    <motion.tr
                      key={claim.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-gray-50"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{claim.id}</div>
                        <div className="text-sm text-gray-500">{formatDate(claim.submittedDate)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{claim.patientName}</div>
                        <div className="text-sm text-gray-500">ABHA: {claim.patientAbhaId}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{claim.diagnosis}</div>
                        <div className="text-sm text-gray-500">ICD-11: {claim.icd11Code}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">₹{claim.claimAmount.toLocaleString()}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(claim.status)}
                        <div className="text-xs text-gray-500 mt-1">
                          {claim.confidence}% confidence
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{claim.provider}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewClaim(claim)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <button className="p-1 text-gray-400 hover:text-gray-600">
                            <MoreVertical className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>

          {filteredClaims.length === 0 && (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No claims found</h3>
              <p className="text-gray-500">
                {searchTerm || statusFilter !== 'all' 
                  ? 'Try adjusting your search or filter criteria.'
                  : 'Claims will appear here when submitted.'}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Claim Details Modal */}
      <Modal
        isOpen={showClaimDetails}
        onClose={() => setShowClaimDetails(false)}
        title="Claim Details"
        size="xl"
      >
        {selectedClaim && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Claim Information</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-500">Claim ID:</span>
                    <span className="text-sm text-gray-900">{selectedClaim.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-500">Status:</span>
                    {getStatusBadge(selectedClaim.status)}
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-500">Amount:</span>
                    <span className="text-sm font-medium text-gray-900">₹{selectedClaim.claimAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-500">Submitted:</span>
                    <span className="text-sm text-gray-900">{formatDate(selectedClaim.submittedDate)}</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Patient Information</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-500">Name:</span>
                    <span className="text-sm text-gray-900">{selectedClaim.patientName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-500">ABHA ID:</span>
                    <span className="text-sm text-gray-900">{selectedClaim.patientAbhaId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-500">Provider:</span>
                    <span className="text-sm text-gray-900">{selectedClaim.provider}</span>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Medical Coding</h3>
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm font-medium text-gray-500">Diagnosis:</span>
                    <p className="text-sm text-gray-900 mt-1">{selectedClaim.diagnosis}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">ICD-11 Code:</span>
                    <p className="text-sm text-gray-900 mt-1">{selectedClaim.icd11Code}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">FHIR Bundle ID:</span>
                    <p className="text-sm text-gray-900 mt-1">{selectedClaim.fhirBundleId}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Mapping Confidence:</span>
                    <Badge variant="info" size="sm">{selectedClaim.confidence}%</Badge>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <Button variant="outline" onClick={() => setShowClaimDetails(false)}>
                Close
              </Button>
              <Button variant="primary">
                <FileText className="w-4 h-4 mr-2" />
                View FHIR Bundle
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}