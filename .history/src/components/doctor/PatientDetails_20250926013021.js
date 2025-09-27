'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Edit, 
  Save, 
  X, 
  User, 
  Calendar, 
  MapPin, 
  Activity, 
  FileText,
  Clock,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import Card, { CardHeader, CardTitle, CardContent } from '../ui/Card';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import { formatDate } from '@/lib/utils';

export default function PatientDetails({ patientId, onBack, onEdit }) {
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  // Mock patient data - in real app would fetch by patientId
  const mockPatient = {
    id: patientId || 1,
    name: 'Rajesh Kumar',
    abhaId: '12345678901234',
    age: 45,
    gender: 'Male',
    phone: '+91 98765 43210',
    email: 'rajesh.kumar@email.com',
    address: 'B-123, Sector 15, Noida, UP 201301',
    status: 'Active',
    lastVisit: '2024-01-15',
    diagnosis: 'Hypertension, Type 2 Diabetes',
    mappingStatus: 'Completed',
    confidence: 95,
    medicalHistory: [
      {
        date: '2024-01-15',
        diagnosis: 'Hypertension',
        icd11Code: '8A80.0',
        treatment: 'Amlodipine 5mg daily',
        doctor: 'Dr. Sharma',
        confidence: 95
      },
      {
        date: '2024-01-10',
        diagnosis: 'Type 2 Diabetes',
        icd11Code: '5A11.0',
        treatment: 'Metformin 500mg twice daily',
        doctor: 'Dr. Patel',
        confidence: 92
      },
      {
        date: '2023-12-20',
        diagnosis: 'Annual Check-up',
        icd11Code: 'Z00.0',
        treatment: 'Routine examination',
        doctor: 'Dr. Singh',
        confidence: 98
      }
    ],
    vitals: {
      bloodPressure: '140/90 mmHg',
      heartRate: '78 bpm',
      temperature: '98.6°F',
      weight: '75 kg',
      height: '170 cm',
      bmi: '25.9'
    },
    codeMappings: [
      {
        originalCode: 'HTN001',
        system: 'Hospital Internal',
        mappedCode: '8A80.0',
        mappedSystem: 'ICD-11',
        confidence: 95,
        status: 'Verified',
        mappedBy: 'AI Assistant',
        reviewedBy: 'Dr. Sharma',
        date: '2024-01-15'
      },
      {
        originalCode: 'DM002',
        system: 'Hospital Internal',
        mappedCode: '5A11.0',
        mappedSystem: 'ICD-11',
        confidence: 92,
        status: 'Verified',
        mappedBy: 'AI Assistant',
        reviewedBy: 'Dr. Patel',
        date: '2024-01-10'
      }
    ]
  };

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setPatient(mockPatient);
      setLoading(false);
    }, 1000);
  }, [patientId]);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: User },
    { id: 'history', label: 'Medical History', icon: FileText },
    { id: 'mappings', label: 'Code Mappings', icon: MapPin },
    { id: 'vitals', label: 'Vitals', icon: Activity }
  ];

  const getStatusBadge = (status) => {
    const variants = {
      'Active': 'success',
      'Inactive': 'default',
      'Recovered': 'primary',
      'Pending': 'warning'
    };
    return <Badge variant={variants[status]} size="sm">{status}</Badge>;
  };

  const getMappingStatusBadge = (status, confidence) => {
    if (status === 'Verified') {
      return (
        <div className="flex items-center space-x-2">
          <Badge variant="success" size="sm">
            <CheckCircle className="w-3 h-3 mr-1" />
            Verified
          </Badge>
          {confidence && (
            <span className="text-xs text-gray-500">{confidence}%</span>
          )}
        </div>
      );
    }
    return <Badge variant="warning" size="sm">Pending Review</Badge>;
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

  if (!patient) {
    return (
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-12">
        <h3 className="text-lg font-medium text-gray-900 mb-2">Patient Not Found</h3>
        <p className="text-gray-500 mb-4">The requested patient could not be found.</p>
        <Button onClick={onBack} variant="outline">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Patient List
        </Button>
      </div>
    );
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Patient Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Full Name</label>
                    <p className="text-gray-900">{patient.name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">ABHA ID</label>
                    <p className="text-gray-900 font-mono">{patient.abhaId}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Age</label>
                    <p className="text-gray-900">{patient.age} years</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Gender</label>
                    <p className="text-gray-900">{patient.gender}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Phone</label>
                    <p className="text-gray-900">{patient.phone}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Email</label>
                    <p className="text-gray-900">{patient.email}</p>
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-sm font-medium text-gray-500">Address</label>
                    <p className="text-gray-900">{patient.address}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Current Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Patient Status</label>
                    <div className="mt-1">{getStatusBadge(patient.status)}</div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Last Visit</label>
                    <p className="text-gray-900">{formatDate(patient.lastVisit)}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Code Mapping</label>
                    <div className="mt-1">{getMappingStatusBadge(patient.mappingStatus, patient.confidence)}</div>
                  </div>
                </div>
                <div className="mt-4">
                  <label className="text-sm font-medium text-gray-500">Current Diagnosis</label>
                  <p className="text-gray-900">{patient.diagnosis}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'history':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Medical History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {patient.medicalHistory.map((entry, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="border border-gray-200 rounded-lg p-4"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-500">{formatDate(entry.date)}</span>
                          <span className="text-sm text-gray-400">•</span>
                          <span className="text-sm text-gray-600">{entry.doctor}</span>
                        </div>
                        <h4 className="font-medium text-gray-900 mb-1">{entry.diagnosis}</h4>
                        <p className="text-sm text-gray-600 mb-2">{entry.treatment}</p>
                        <div className="flex items-center space-x-2">
                          <code className="text-xs bg-gray-100 px-2 py-1 rounded">{entry.icd11Code}</code>
                          <span className="text-xs text-gray-500">{entry.confidence}% confidence</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        );

      case 'mappings':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Code Mappings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {patient.codeMappings.map((mapping, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="border border-gray-200 rounded-lg p-4"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <MapPin className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-500">Mapped on {formatDate(mapping.date)}</span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="text-xs font-medium text-gray-500">Original Code</label>
                            <div className="flex items-center space-x-2 mt-1">
                              <code className="text-sm bg-red-100 text-red-800 px-2 py-1 rounded">{mapping.originalCode}</code>
                              <span className="text-xs text-gray-500">{mapping.system}</span>
                            </div>
                          </div>
                          <div>
                            <label className="text-xs font-medium text-gray-500">Mapped Code</label>
                            <div className="flex items-center space-x-2 mt-1">
                              <code className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded">{mapping.mappedCode}</code>
                              <span className="text-xs text-gray-500">{mapping.mappedSystem}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="ml-4">
                        {getMappingStatusBadge(mapping.status, mapping.confidence)}
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>Mapped by: {mapping.mappedBy}</span>
                      <span>Reviewed by: {mapping.reviewedBy}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        );

      case 'vitals':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Latest Vitals</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Object.entries(patient.vitals).map(([key, value]) => (
                  <div key={key} className="text-center p-4 bg-gray-50 rounded-lg">
                    <Activity className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                    <label className="text-sm font-medium text-gray-500 capitalize">
                      {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                    </label>
                    <p className="text-lg font-bold text-gray-900 mt-1">{value}</p>
                  </div>
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
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">{patient.name}</h1>
            <p className="text-gray-600">ABHA ID: {patient.abhaId}</p>
          </div>
        </div>
        <Button onClick={() => onEdit(patient)} size="sm">
          <Edit className="w-4 h-4 mr-2" />
          Edit Patient
        </Button>
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