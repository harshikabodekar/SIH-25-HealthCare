'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  FileText, 
  Download, 
  CheckCircle, 
  Clock, 
  AlertTriangle,
  User,
  Calendar,
  DollarSign,
  MapPin,
  Building,
  Activity,
  Eye
} from 'lucide-react';
import Card, { CardHeader, CardTitle, CardContent } from '../ui/Card';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import { formatDate, formatDateTime } from '@/lib/utils';

export default function ClaimDetails({ claimId, onBack, onApprove, onReject }) {
  const [claim, setClaim] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [fhirBundle, setFhirBundle] = useState(null);

  // Mock claim data - in real app would fetch by claimId
  const mockClaim = {
    id: claimId || 'CLM-2024-001',
    patientName: 'Rajesh Kumar',
    patientAbhaId: '12345678901234',
    patientAge: 45,
    patientGender: 'Male',
    diagnosis: 'Hypertension',
    icd11Code: '8A80.0',
    claimAmount: 15000,
    approvedAmount: 14500,
    submittedDate: '2024-01-15',
    processedDate: '2024-01-18',
    status: 'approved',
    provider: 'AIIMS Delhi',
    providerCode: 'AIIMS-DEL-001',
    fhirBundleId: 'bundle-001',
    confidence: 95,
    treatmentDetails: {
      admissionDate: '2024-01-10',
      dischargeDate: '2024-01-15',
      roomType: 'General Ward',
      doctorName: 'Dr. Rajesh Sharma',
      department: 'Cardiology',
      procedures: [
        {
          code: 'ECG001',
          name: 'Electrocardiogram',
          amount: 2000,
          date: '2024-01-10'
        },
        {
          code: 'BLOOD001',
          name: 'Blood Tests',
          amount: 3500,
          date: '2024-01-11'
        },
        {
          code: 'MED001',
          name: 'Medications',
          amount: 9500,
          date: '2024-01-12'
        }
      ]
    },
    documents: [
      {
        type: 'Medical Certificate',
        uploadDate: '2024-01-15',
        status: 'Verified',
        url: '#'
      },
      {
        type: 'Prescription',
        uploadDate: '2024-01-15',
        status: 'Verified',
        url: '#'
      },
      {
        type: 'Lab Reports',
        uploadDate: '2024-01-15',
        status: 'Verified',
        url: '#'
      }
    ],
    auditTrail: [
      {
        action: 'Claim Submitted',
        user: 'System',
        timestamp: '2024-01-15T10:30:00Z',
        details: 'Claim automatically submitted from provider system'
      },
      {
        action: 'Initial Review',
        user: 'AI Assistant',
        timestamp: '2024-01-15T10:35:00Z',
        details: 'Automated validation passed with 95% confidence'
      },
      {
        action: 'Code Mapping Verified',
        user: 'Dr. System Mapper',
        timestamp: '2024-01-15T11:00:00Z',
        details: 'ICD-11 code mapping verified and approved'
      },
      {
        action: 'Claim Approved',
        user: 'Insurance Officer',
        timestamp: '2024-01-18T14:30:00Z',
        details: 'Claim approved for ₹14,500 (processing fee deducted)'
      }
    ]
  };

  const mockFhirBundle = {
    resourceType: 'Bundle',
    id: 'bundle-001',
    type: 'document',
    timestamp: '2024-01-15T10:30:00Z',
    entry: [
      {
        resource: {
          resourceType: 'Patient',
          id: 'patient-001',
          identifier: [
            {
              system: 'https://abha.gov.in',
              value: '12345678901234'
            }
          ],
          name: [
            {
              family: 'Kumar',
              given: ['Rajesh']
            }
          ],
          gender: 'male',
          birthDate: '1979-01-01'
        }
      },
      {
        resource: {
          resourceType: 'Condition',
          id: 'condition-001',
          subject: {
            reference: 'Patient/patient-001'
          },
          code: {
            coding: [
              {
                system: 'http://hl7.org/fhir/sid/icd-11',
                code: '8A80.0',
                display: 'Hypertension'
              }
            ]
          }
        }
      }
    ]
  };

  useEffect(() => {
    // Simulate API calls
    setTimeout(() => {
      setClaim(mockClaim);
      setFhirBundle(mockFhirBundle);
      setLoading(false);
    }, 1000);
  }, [claimId]);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: FileText },
    { id: 'treatment', label: 'Treatment Details', icon: Activity },
    { id: 'documents', label: 'Documents', icon: FileText },
    { id: 'fhir', label: 'FHIR Bundle', icon: MapPin },
    { id: 'audit', label: 'Audit Trail', icon: Clock }
  ];

  const getStatusBadge = (status) => {
    const variants = {
      approved: { variant: 'success', label: 'Approved', icon: CheckCircle },
      pending: { variant: 'warning', label: 'Pending', icon: Clock },
      rejected: { variant: 'danger', label: 'Rejected', icon: AlertTriangle },
      under_review: { variant: 'info', label: 'Under Review', icon: Clock }
    };
    const config = variants[status] || { variant: 'default', label: status, icon: Clock };
    const Icon = config.icon;
    return (
      <Badge variant={config.variant} size="sm">
        <Icon className="w-3 h-3 mr-1" />
        {config.label}
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="h-64 bg-gray-200 rounded"></div>
              <div className="h-48 bg-gray-200 rounded"></div>
            </div>
            <div className="h-96 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!claim) {
    return (
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-12">
        <h3 className="text-lg font-medium text-gray-900 mb-2">Claim Not Found</h3>
        <p className="text-gray-500 mb-4">The requested claim could not be found.</p>
        <Button onClick={onBack} variant="outline">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Claims List
        </Button>
      </div>
    );
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Patient Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Patient Name</label>
                      <p className="text-gray-900">{claim.patientName}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">ABHA ID</label>
                      <p className="text-gray-900 font-mono">{claim.patientAbhaId}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-500">Age</label>
                        <p className="text-gray-900">{claim.patientAge} years</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Gender</label>
                        <p className="text-gray-900">{claim.patientGender}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Provider Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Healthcare Provider</label>
                      <p className="text-gray-900">{claim.provider}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Provider Code</label>
                      <p className="text-gray-900 font-mono">{claim.providerCode}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Treating Doctor</label>
                      <p className="text-gray-900">{claim.treatmentDetails.doctorName}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Department</label>
                      <p className="text-gray-900">{claim.treatmentDetails.department}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Claim Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <DollarSign className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                    <label className="text-sm font-medium text-gray-500">Claim Amount</label>
                    <p className="text-lg font-bold text-gray-900">₹{claim.claimAmount.toLocaleString()}</p>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                    <label className="text-sm font-medium text-gray-500">Approved Amount</label>
                    <p className="text-lg font-bold text-gray-900">₹{claim.approvedAmount.toLocaleString()}</p>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <Calendar className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                    <label className="text-sm font-medium text-gray-500">Submitted Date</label>
                    <p className="text-lg font-bold text-gray-900">{formatDate(claim.submittedDate)}</p>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <MapPin className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                    <label className="text-sm font-medium text-gray-500">AI Confidence</label>
                    <p className="text-lg font-bold text-gray-900">{claim.confidence}%</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'treatment':
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Treatment Period</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Admission Date</label>
                    <p className="text-gray-900">{formatDate(claim.treatmentDetails.admissionDate)}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Discharge Date</label>
                    <p className="text-gray-900">{formatDate(claim.treatmentDetails.dischargeDate)}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Room Type</label>
                    <p className="text-gray-900">{claim.treatmentDetails.roomType}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Procedures & Charges</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {claim.treatmentDetails.procedures.map((procedure, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div>
                        <h4 className="font-medium text-gray-900">{procedure.name}</h4>
                        <p className="text-sm text-gray-500">Code: {procedure.code} • Date: {formatDate(procedure.date)}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-gray-900">₹{procedure.amount.toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                  <div className="border-t pt-4">
                    <div className="flex items-center justify-between font-medium text-lg">
                      <span>Total Amount</span>
                      <span>₹{claim.claimAmount.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'documents':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Supporting Documents</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {claim.documents.map((doc, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <FileText className="w-8 h-8 text-blue-600" />
                      <div>
                        <h4 className="font-medium text-gray-900">{doc.type}</h4>
                        <p className="text-sm text-gray-500">Uploaded: {formatDate(doc.uploadDate)}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Badge variant={doc.status === 'Verified' ? 'success' : 'warning'} size="sm">
                        {doc.status}
                      </Badge>
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4 mr-2" />
                        View
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        );

      case 'fhir':
        return (
          <Card>
            <CardHeader>
              <CardTitle>FHIR Bundle</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Bundle ID: {claim.fhirBundleId}</p>
                    <p className="text-sm text-gray-500">Type: Document Bundle</p>
                  </div>
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Download Bundle
                  </Button>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <pre className="text-xs text-gray-700 overflow-x-auto">
                    {JSON.stringify(fhirBundle, null, 2)}
                  </pre>
                </div>
              </div>
            </CardContent>
          </Card>
        );

      case 'audit':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Audit Trail</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {claim.auditTrail.map((entry, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start space-x-4 p-4 border border-gray-200 rounded-lg"
                  >
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Clock className="w-4 h-4 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-medium text-gray-900">{entry.action}</h4>
                        <span className="text-sm text-gray-500">{formatDateTime(entry.timestamp)}</span>
                      </div>
                      <p className="text-sm text-gray-600 mb-1">{entry.details}</p>
                      <p className="text-xs text-gray-500">By: {entry.user}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={onBack} size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Claim {claim.id}</h1>
            <div className="flex items-center space-x-4 mt-1">
              <p className="text-gray-600">{claim.patientName}</p>
              <div>{getStatusBadge(claim.status)}</div>
            </div>
          </div>
        </div>
        {claim.status === 'pending' && (
          <div className="flex items-center space-x-2">
            <Button variant="outline" onClick={() => onReject(claim)} size="sm">
              <AlertTriangle className="w-4 h-4 mr-2" />
              Reject
            </Button>
            <Button onClick={() => onApprove(claim)} size="sm">
              <CheckCircle className="w-4 h-4 mr-2" />
              Approve
            </Button>
          </div>
        )}
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="w-4 h-4 mr-2" />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        {renderTabContent()}
      </motion.div>
    </div>
  );
}