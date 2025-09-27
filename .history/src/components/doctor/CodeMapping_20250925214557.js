'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  ArrowRight, 
  ArrowLeftRight, 
  CheckCircle, 
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Copy,
  ExternalLink,
  Info
} from 'lucide-react';
import Card, { CardHeader, CardTitle, CardContent } from '../../ui/Card';
import Button from '../../ui/Button';
import Input from '../../ui/Input';
import Badge from '../../ui/Badge';
import Modal, { ModalFooter } from '../../ui/Modal';
import { formatDateTime, generateAuditId, getConfidenceColor } from '@/lib/utils';

const mockMappings = [
  {
    id: 1,
    namaste: {
      code: 'NAM001',
      term: 'सिरदर्द',
      description: 'Common headache in Ayurvedic context',
      category: 'Neurological'
    },
    icd11: {
      code: '8A80.0',
      term: 'Primary headache',
      description: 'Headache disorder, primary',
      category: 'Diseases of the nervous system'
    },
    biomed: {
      code: 'C0018681',
      term: 'Headache',
      description: 'Pain located in the head or upper neck',
      category: 'Signs and Symptoms'
    },
    confidence: 94,
    status: 'verified',
    lastUpdated: '2024-01-15T10:30:00Z',
    mappedBy: 'Dr. Rajesh Kumar'
  },
  {
    id: 2,
    namaste: {
      code: 'NAM002',
      term: 'पेट में दर्द',
      description: 'Abdominal pain in traditional medicine',
      category: 'Digestive'
    },
    icd11: {
      code: 'MD90.0',
      term: 'Abdominal pain',
      description: 'Pain in abdomen',
      category: 'Symptoms, signs or clinical findings'
    },
    biomed: {
      code: 'C0000737',
      term: 'Abdominal Pain',
      description: 'Sensation of discomfort, distress, or agony in the abdominal region',
      category: 'Signs and Symptoms'
    },
    confidence: 98,
    status: 'verified',
    lastUpdated: '2024-01-14T15:45:00Z',
    mappedBy: 'Dr. Priya Sharma'
  },
  {
    id: 3,
    namaste: {
      code: 'NAM003',
      term: 'बुखार',
      description: 'Fever in Ayurvedic terminology',
      category: 'General'
    },
    icd11: {
      code: 'MG50.0',
      term: 'Fever',
      description: 'Elevated body temperature',
      category: 'General symptoms'
    },
    biomed: {
      code: 'C0015967',
      term: 'Fever',
      description: 'Abnormal elevation of body temperature',
      category: 'Signs and Symptoms'
    },
    confidence: 89,
    status: 'pending_review',
    lastUpdated: '2024-01-13T09:20:00Z',
    mappedBy: 'System Auto-mapping'
  }
];

const mockSuggestions = [
  { 
    term: 'सिरदर्द (Headache)', 
    code: 'NAM001', 
    confidence: 94,
    description: 'Common headache in Ayurvedic context'
  },
  { 
    term: 'पेट में दर्द (Stomach Pain)', 
    code: 'NAM002', 
    confidence: 98,
    description: 'Abdominal pain in traditional medicine'
  },
  { 
    term: 'बुखार (Fever)', 
    code: 'NAM003', 
    confidence: 89,
    description: 'Fever in Ayurvedic terminology'
  },
];

export default function CodeMapping() {
  const [mappings, setMappings] = useState(mockMappings);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredMappings, setFilteredMappings] = useState(mockMappings);
  const [expandedMapping, setExpandedMapping] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedMapping, setSelectedMapping] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);

  useEffect(() => {
    if (searchTerm.length > 2) {
      setSearchLoading(true);
      // Simulate API call for suggestions
      setTimeout(() => {
        setSuggestions(mockSuggestions.filter(s => 
          s.term.toLowerCase().includes(searchTerm.toLowerCase())
        ));
        setSearchLoading(false);
      }, 500);
    } else {
      setSuggestions([]);
    }
  }, [searchTerm]);

  useEffect(() => {
    const filtered = mappings.filter(mapping =>
      mapping.namaste.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mapping.namaste.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mapping.icd11.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mapping.biomed.term.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredMappings(filtered);
  }, [searchTerm, mappings]);

  const handleSuggestionSelect = (suggestion) => {
    setSearchTerm(suggestion.term);
    setSuggestions([]);
  };

  const handleConfirmMapping = (mapping) => {
    setSelectedMapping(mapping);
    setShowConfirmModal(true);
  };

  const handleMappingConfirm = () => {
    if (selectedMapping) {
      const auditId = generateAuditId();
      const updatedMapping = {
        ...selectedMapping,
        status: 'verified',
        lastUpdated: new Date().toISOString(),
        auditId,
        version: '1.0'
      };
      
      setMappings(prev => prev.map(m => 
        m.id === selectedMapping.id ? updatedMapping : m
      ));
    }
    setShowConfirmModal(false);
    setSelectedMapping(null);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    // Could show toast notification here
  };

  const toggleExpanded = (mappingId) => {
    setExpandedMapping(expandedMapping === mappingId ? null : mappingId);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Code Mapping</h1>
          <p className="text-gray-600 mt-1">
            Map NAMASTE terms to ICD-11 and Biomedical codes with confidence scoring
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="info" size="sm">
            <Info className="w-3 h-3 mr-1" />
            FHIR R4 Compliant
          </Badge>
        </div>
      </div>

      {/* Search Bar */}
      <Card>
        <CardContent className="p-4">
          <Input
            placeholder="Search NAMASTE terms for mapping..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            icon={Search}
            loading={searchLoading}
            suggestions={suggestions}
            showSuggestions={suggestions.length > 0}
            onSuggestionSelect={handleSuggestionSelect}
          />
        </CardContent>
      </Card>

      {/* Mapping Results */}
      <div className="space-y-4">
        <AnimatePresence>
          {filteredMappings.map((mapping, index) => (
            <motion.div
              key={mapping.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card hover>
                <CardContent className="p-6">
                  {/* Main Mapping Display */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <Badge variant={mapping.status === 'verified' ? 'success' : 'warning'}>
                        {mapping.status === 'verified' ? 'Verified' : 'Pending Review'}
                      </Badge>
                      <span className={`text-sm font-medium ${getConfidenceColor(mapping.confidence)}`}>
                        {mapping.confidence}% confidence
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleExpanded(mapping.id)}
                      >
                        {expandedMapping === mapping.id ? (
                          <>
                            <ChevronUp className="w-4 h-4 mr-1" />
                            Less
                          </>
                        ) : (
                          <>
                            <ChevronDown className="w-4 h-4 mr-1" />
                            More
                          </>
                        )}
                      </Button>
                      {mapping.status !== 'verified' && (
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => handleConfirmMapping(mapping)}
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Confirm
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Code Mapping Flow */}
                  <div className="flex items-center justify-between space-x-4">
                    {/* NAMASTE */}
                    <div className="flex-1 p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-blue-900">NAMASTE</h4>
                        <button
                          onClick={() => copyToClipboard(mapping.namaste.code)}
                          className="p-1 text-blue-600 hover:text-blue-800"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-lg font-medium text-blue-900 mb-1">
                        {mapping.namaste.term}
                      </p>
                      <p className="text-sm text-blue-700">
                        Code: {mapping.namaste.code}
                      </p>
                    </div>

                    <ArrowRight className="text-gray-400 flex-shrink-0" />

                    {/* ICD-11 */}
                    <div className="flex-1 p-4 bg-green-50 rounded-lg border border-green-200">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-green-900">ICD-11</h4>
                        <button
                          onClick={() => copyToClipboard(mapping.icd11.code)}
                          className="p-1 text-green-600 hover:text-green-800"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-lg font-medium text-green-900 mb-1">
                        {mapping.icd11.term}
                      </p>
                      <p className="text-sm text-green-700">
                        Code: {mapping.icd11.code}
                      </p>
                    </div>

                    <ArrowRight className="text-gray-400 flex-shrink-0" />

                    {/* Biomedical */}
                    <div className="flex-1 p-4 bg-purple-50 rounded-lg border border-purple-200">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-purple-900">Biomedical</h4>
                        <button
                          onClick={() => copyToClipboard(mapping.biomed.code)}
                          className="p-1 text-purple-600 hover:text-purple-800"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-lg font-medium text-purple-900 mb-1">
                        {mapping.biomed.term}
                      </p>
                      <p className="text-sm text-purple-700">
                        Code: {mapping.biomed.code}
                      </p>
                    </div>
                  </div>

                  {/* Expanded Details */}
                  <AnimatePresence>
                    {expandedMapping === mapping.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-6 pt-6 border-t border-gray-200"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div>
                            <h5 className="font-semibold text-gray-900 mb-2">NAMASTE Details</h5>
                            <p className="text-sm text-gray-600 mb-2">{mapping.namaste.description}</p>
                            <Badge variant="primary" size="xs">{mapping.namaste.category}</Badge>
                          </div>
                          <div>
                            <h5 className="font-semibold text-gray-900 mb-2">ICD-11 Details</h5>
                            <p className="text-sm text-gray-600 mb-2">{mapping.icd11.description}</p>
                            <Badge variant="success" size="xs">{mapping.icd11.category}</Badge>
                          </div>
                          <div>
                            <h5 className="font-semibold text-gray-900 mb-2">Biomedical Details</h5>
                            <p className="text-sm text-gray-600 mb-2">{mapping.biomed.description}</p>
                            <Badge variant="info" size="xs">{mapping.biomed.category}</Badge>
                          </div>
                        </div>
                        
                        <div className="mt-4 pt-4 border-t border-gray-100">
                          <div className="flex items-center justify-between text-sm text-gray-500">
                            <span>Last updated: {formatDateTime(mapping.lastUpdated)}</span>
                            <span>Mapped by: {mapping.mappedBy}</span>
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

      {filteredMappings.length === 0 && searchTerm && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No mappings found</h3>
          <p className="text-gray-500">
            Try searching with different terms or check the NAMASTE terminology database.
          </p>
        </motion.div>
      )}

      {/* Confirmation Modal */}
      <Modal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        title="Confirm Code Mapping"
        size="lg"
      >
        {selectedMapping && (
          <div className="space-y-6">
            <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <div className="flex items-center">
                <AlertCircle className="w-5 h-5 text-yellow-600 mr-2" />
                <p className="text-sm text-yellow-800">
                  Please review the mapping details carefully before confirming. 
                  This action will create an audit trail entry.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Mapping Summary</h4>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="font-medium">NAMASTE:</span>
                    <p>{selectedMapping.namaste.term} ({selectedMapping.namaste.code})</p>
                  </div>
                  <div>
                    <span className="font-medium">ICD-11:</span>
                    <p>{selectedMapping.icd11.term} ({selectedMapping.icd11.code})</p>
                  </div>
                  <div>
                    <span className="font-medium">Biomedical:</span>
                    <p>{selectedMapping.biomed.term} ({selectedMapping.biomed.code})</p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Audit Information</h4>
                <div className="bg-gray-50 p-3 rounded text-sm">
                  <p><span className="font-medium">Audit ID:</span> {generateAuditId()}</p>
                  <p><span className="font-medium">Version:</span> 1.0</p>
                  <p><span className="font-medium">Confidence:</span> {selectedMapping.confidence}%</p>
                  <p><span className="font-medium">Timestamp:</span> {formatDateTime(new Date())}</p>
                </div>
              </div>
            </div>

            <ModalFooter>
              <Button
                variant="outline"
                onClick={() => setShowConfirmModal(false)}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleMappingConfirm}
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Confirm Mapping
              </Button>
            </ModalFooter>
          </div>
        )}
      </Modal>
    </div>
  );
}