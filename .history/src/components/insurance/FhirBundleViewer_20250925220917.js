'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Code, 
  ChevronDown, 
  ChevronRight, 
  Copy, 
  Eye,
  Download,
  Search,
  Filter,
  ExternalLink,
  FileText
} from 'lucide-react';
import Card, { CardHeader, CardTitle, CardContent } from '../../ui/Card';
import Button from '../../ui/Button';
import Input from '../../ui/Input';
import Badge from '../../ui/Badge';
import { formatDateTime } from '@/lib/utils';

const mockFhirBundles = [
  {
    id: 'bundle-001',
    resourceType: 'Bundle',
    timestamp: '2024-01-15T10:30:00Z',
    patientName: 'Rajesh Kumar',
    patientId: 'patient-001',
    claimId: 'CLM-2024-001',
    entries: [
      {
        resourceType: 'Patient',
        id: 'patient-001',
        name: 'Rajesh Kumar',
        identifier: [
          { system: 'https://healthid.ndhm.gov.in', value: '12345678901234' }
        ],
        birthDate: '1978-05-15',
        gender: 'male'
      },
      {
        resourceType: 'Encounter',
        id: 'encounter-001',
        status: 'finished',
        class: { code: 'AMB', display: 'ambulatory' },
        period: { start: '2024-01-15T09:00:00Z', end: '2024-01-15T10:30:00Z' }
      },
      {
        resourceType: 'Condition',
        id: 'condition-001',
        code: {
          coding: [
            {
              system: 'http://hl7.org/fhir/sid/icd-11',
              code: '8A80.0',
              display: 'Primary headache'
            },
            {
              system: 'https://terminology.hl7.org/CodeSystem/namaste',
              code: 'NAM001',
              display: 'सिरदर्द'
            },
            {
              system: 'http://snomed.info/sct',
              code: 'C0018681',
              display: 'Headache'
            }
          ]
        },
        subject: { reference: 'Patient/patient-001' }
      },
      {
        resourceType: 'Observation',
        id: 'observation-001',
        status: 'final',
        code: {
          coding: [
            {
              system: 'http://loinc.org',
              code: '85354-9',
              display: 'Blood pressure panel'
            }
          ]
        },
        valueQuantity: { value: 140, unit: 'mmHg' }
      }
    ],
    mappingConfidence: 95,
    totalAmount: 15000
  },
  {
    id: 'bundle-002',
    resourceType: 'Bundle',
    timestamp: '2024-01-14T14:20:00Z',
    patientName: 'Priya Sharma',
    patientId: 'patient-002',
    claimId: 'CLM-2024-002',
    entries: [
      {
        resourceType: 'Patient',
        id: 'patient-002',
        name: 'Priya Sharma',
        identifier: [
          { system: 'https://healthid.ndhm.gov.in', value: '23456789012345' }
        ],
        birthDate: '1992-08-22',
        gender: 'female'
      },
      {
        resourceType: 'Condition',
        id: 'condition-002',
        code: {
          coding: [
            {
              system: 'http://hl7.org/fhir/sid/icd-11',
              code: '5A11.0',
              display: 'Type 2 diabetes mellitus'
            },
            {
              system: 'https://terminology.hl7.org/CodeSystem/namaste',
              code: 'NAM002',
              display: 'मधुमेह'
            },
            {
              system: 'http://snomed.info/sct',
              code: 'E11',
              display: 'Type 2 diabetes mellitus'
            }
          ]
        },
        subject: { reference: 'Patient/patient-002' }
      }
    ],
    mappingConfidence: 87,
    totalAmount: 8500
  }
];

export default function FhirBundleViewer() {
  const [bundles, setBundles] = useState(mockFhirBundles);
  const [filteredBundles, setFilteredBundles] = useState(mockFhirBundles);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedBundles, setExpandedBundles] = useState(new Set());
  const [expandedEntries, setExpandedEntries] = useState(new Set());
  const [selectedBundle, setSelectedBundle] = useState(null);

  useEffect(() => {
    const filtered = bundles.filter(bundle =>
      bundle.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bundle.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bundle.claimId.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredBundles(filtered);
  }, [searchTerm, bundles]);

  const toggleBundleExpanded = (bundleId) => {
    const newExpanded = new Set(expandedBundles);
    if (newExpanded.has(bundleId)) {
      newExpanded.delete(bundleId);
    } else {
      newExpanded.add(bundleId);
    }
    setExpandedBundles(newExpanded);
  };

  const toggleEntryExpanded = (entryId) => {
    const newExpanded = new Set(expandedEntries);
    if (newExpanded.has(entryId)) {
      newExpanded.delete(entryId);
    } else {
      newExpanded.add(entryId);
    }
    setExpandedEntries(newExpanded);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(JSON.stringify(text, null, 2));
  };

  const exportBundle = (bundle) => {
    const dataStr = JSON.stringify(bundle, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `fhir-bundle-${bundle.id}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const getResourceIcon = (resourceType) => {
    const icons = {
      Patient: '👤',
      Encounter: '🏥',
      Condition: '🔍',
      Observation: '📊',
      Procedure: '⚕️',
      Medication: '💊'
    };
    return icons[resourceType] || '📄';
  };

  const getResourceColor = (resourceType) => {
    const colors = {
      Patient: 'bg-blue-50 border-blue-200 text-blue-800',
      Encounter: 'bg-green-50 border-green-200 text-green-800',
      Condition: 'bg-red-50 border-red-200 text-red-800',
      Observation: 'bg-purple-50 border-purple-200 text-purple-800',
      Procedure: 'bg-orange-50 border-orange-200 text-orange-800',
      Medication: 'bg-yellow-50 border-yellow-200 text-yellow-800'
    };
    return colors[resourceType] || 'bg-gray-50 border-gray-200 text-gray-800';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">FHIR Bundle Viewer</h1>
          <p className="text-gray-600 mt-1">
            Access real-time dual-coded FHIR bundles for claims processing
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="info" size="sm">
            FHIR R4 Compliant
          </Badge>
          <Badge variant="success" size="sm">
            Real-time Access
          </Badge>
        </div>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <div className="flex-1">
              <Input
                placeholder="Search by bundle ID, patient name, or claim ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                icon={Search}
              />
            </div>
            <Button variant="outline" className="flex items-center">
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* FHIR Bundles */}
      <div className="space-y-4">
        <AnimatePresence>
          {filteredBundles.map((bundle, index) => (
            <motion.div
              key={bundle.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card>
                <CardContent className="p-6">
                  {/* Bundle Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <button
                        onClick={() => toggleBundleExpanded(bundle.id)}
                        className="flex items-center space-x-2 text-left"
                      >
                        {expandedBundles.has(bundle.id) ? (
                          <ChevronDown className="w-5 h-5 text-gray-500" />
                        ) : (
                          <ChevronRight className="w-5 h-5 text-gray-500" />
                        )}
                        <div>
                          <h3 className="font-semibold text-gray-900">{bundle.id}</h3>
                          <p className="text-sm text-gray-500">
                            {bundle.patientName} • Claim: {bundle.claimId}
                          </p>
                        </div>
                      </button>
                      <Badge variant="primary" size="sm">
                        {bundle.entries.length} resources
                      </Badge>
                      <Badge variant="success" size="sm">
                        {bundle.mappingConfidence}% confidence
                      </Badge>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-gray-900">
                        ₹{bundle.totalAmount.toLocaleString()}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(bundle)}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => exportBundle(bundle)}
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Bundle Details */}
                  <AnimatePresence>
                    {expandedBundles.has(bundle.id) && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="space-y-4"
                      >
                        <div className="pt-4 border-t border-gray-200">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm mb-6">
                            <div>
                              <span className="font-medium text-gray-500">Bundle Type:</span>
                              <p className="text-gray-900">{bundle.resourceType}</p>
                            </div>
                            <div>
                              <span className="font-medium text-gray-500">Timestamp:</span>
                              <p className="text-gray-900">{formatDateTime(bundle.timestamp)}</p>
                            </div>
                            <div>
                              <span className="font-medium text-gray-500">Patient ID:</span>
                              <p className="text-gray-900">{bundle.patientId}</p>
                            </div>
                          </div>

                          {/* Resource Entries */}
                          <div className="space-y-3">
                            <h4 className="font-semibold text-gray-900">FHIR Resources</h4>
                            {bundle.entries.map((entry, entryIndex) => {
                              const entryKey = `${bundle.id}-${entry.id}`;
                              const isExpanded = expandedEntries.has(entryKey);
                              
                              return (
                                <motion.div
                                  key={entryKey}
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  transition={{ delay: entryIndex * 0.05 }}
                                  className={`border rounded-lg p-4 ${getResourceColor(entry.resourceType)}`}
                                >
                                  <button
                                    onClick={() => toggleEntryExpanded(entryKey)}
                                    className="w-full flex items-center justify-between text-left"
                                  >
                                    <div className="flex items-center space-x-3">
                                      <span className="text-lg">{getResourceIcon(entry.resourceType)}</span>
                                      <div>
                                        <h5 className="font-medium">{entry.resourceType}</h5>
                                        <p className="text-sm opacity-75">ID: {entry.id}</p>
                                        {entry.name && (
                                          <p className="text-sm opacity-90">{entry.name}</p>
                                        )}
                                      </div>
                                    </div>
                                    {isExpanded ? (
                                      <ChevronDown className="w-4 h-4" />
                                    ) : (
                                      <ChevronRight className="w-4 h-4" />
                                    )}
                                  </button>

                                  <AnimatePresence>
                                    {isExpanded && (
                                      <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="mt-4 pt-4 border-t border-current border-opacity-20"
                                      >
                                        {/* Special handling for different resource types */}
                                        {entry.resourceType === 'Condition' && entry.code && (
                                          <div className="space-y-3">
                                            <h6 className="font-medium">Medical Coding (Dual-Coded)</h6>
                                            <div className="space-y-2">
                                              {entry.code.coding.map((code, codeIndex) => (
                                                <div key={codeIndex} className="flex items-center justify-between bg-white bg-opacity-50 rounded p-2">
                                                  <div>
                                                    <span className="font-medium">{code.display}</span>
                                                    <p className="text-sm opacity-75">
                                                      {code.system.includes('icd-11') ? 'ICD-11' :
                                                       code.system.includes('namaste') ? 'NAMASTE' :
                                                       code.system.includes('snomed') ? 'SNOMED-CT' : 'Unknown'}
                                                      : {code.code}
                                                    </p>
                                                  </div>
                                                  <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => copyToClipboard(code)}
                                                  >
                                                    <Copy className="w-3 h-3" />
                                                  </Button>
                                                </div>
                                              ))}
                                            </div>
                                          </div>
                                        )}

                                        {/* Raw JSON view */}
                                        <div className="mt-4">
                                          <div className="flex items-center justify-between mb-2">
                                            <h6 className="font-medium">Raw FHIR JSON</h6>
                                            <Button
                                              variant="ghost"
                                              size="sm"
                                              onClick={() => copyToClipboard(entry)}
                                            >
                                              <Copy className="w-3 h-3 mr-1" />
                                              Copy
                                            </Button>
                                          </div>
                                          <pre className="bg-white bg-opacity-50 rounded p-3 text-xs overflow-x-auto">
                                            {JSON.stringify(entry, null, 2)}
                                          </pre>
                                        </div>
                                      </motion.div>
                                    )}
                                  </AnimatePresence>
                                </motion.div>
                              );
                            })}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filteredBundles.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Code className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No FHIR bundles found</h3>
          <p className="text-gray-500">
            {searchTerm 
              ? 'Try adjusting your search terms.'
              : 'FHIR bundles will appear here when claims are processed.'}
          </p>
        </motion.div>
      )}
    </div>
  );
}