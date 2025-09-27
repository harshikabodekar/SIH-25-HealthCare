'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, Filter, MoreVertical, User, Calendar, Phone, Mail } from 'lucide-react';
import Card, { CardHeader, CardTitle, CardContent } from '../ui/Card';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Badge from '../ui/Badge';
import Modal from '../ui/Modal';
import PatientForm from './PatientForm';
import { formatDate, debounce } from '@/lib/utils';

const mockPatients = [
  {
    id: 1,
    abhaId: '12345678901234',
    name: 'Rajesh Kumar',
    age: 45,
    gender: 'Male',
    phone: '+91 9876543210',
    email: 'rajesh.kumar@email.com',
    lastVisit: '2024-01-15',
    diagnosis: 'Hypertension',
    status: 'Active',
    mappingStatus: 'Completed',
    confidence: 95,
  },
  {
    id: 2,
    abhaId: '23456789012345',
    name: 'Priya Sharma',
    age: 32,
    gender: 'Female',
    phone: '+91 9876543211',
    email: 'priya.sharma@email.com',
    lastVisit: '2024-01-14',
    diagnosis: 'Diabetes Type 2',
    status: 'Active',
    mappingStatus: 'Pending',
    confidence: null,
  },
  {
    id: 3,
    abhaId: '34567890123456',
    name: 'Amit Singh',
    age: 28,
    gender: 'Male',
    phone: '+91 9876543212',
    email: 'amit.singh@email.com',
    lastVisit: '2024-01-13',
    diagnosis: 'Common Cold',
    status: 'Recovered',
    mappingStatus: 'Completed',
    confidence: 87,
  },
];

export default function PatientRecords({ onPatientView }) {
  const [patients, setPatients] = useState(mockPatients);
  const [filteredPatients, setFilteredPatients] = useState(mockPatients);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [showPatientForm, setShowPatientForm] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [loading, setLoading] = useState(false);

  // Debounced search
  const debouncedSearch = debounce((term) => {
    filterPatients(term, selectedStatus);
  }, 300);

  useEffect(() => {
    debouncedSearch(searchTerm);
  }, [searchTerm, selectedStatus]);

  const filterPatients = (search, status) => {
    let filtered = patients;

    if (search) {
      filtered = filtered.filter(patient =>
        patient.name.toLowerCase().includes(search.toLowerCase()) ||
        patient.abhaId.includes(search) ||
        patient.diagnosis.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (status !== 'all') {
      filtered = filtered.filter(patient => patient.status.toLowerCase() === status);
    }

    setFilteredPatients(filtered);
  };

  const handleAddPatient = () => {
    setSelectedPatient(null);
    setShowPatientForm(true);
  };

  const handleEditPatient = (patient) => {
    setSelectedPatient(patient);
    setShowPatientForm(true);
  };

  const handleSavePatient = (patientData) => {
    if (selectedPatient) {
      // Update existing patient
      setPatients(prev => prev.map(p => 
        p.id === selectedPatient.id ? { ...p, ...patientData } : p
      ));
    } else {
      // Add new patient
      const newPatient = {
        id: Date.now(),
        ...patientData,
        lastVisit: new Date().toISOString().split('T')[0],
        mappingStatus: 'Pending',
        confidence: null,
      };
      setPatients(prev => [...prev, newPatient]);
    }
    setShowPatientForm(false);
  };

  const getStatusBadge = (status) => {
    const variants = {
      'Active': 'success',
      'Recovered': 'primary',
      'Pending': 'warning',
      'Inactive': 'default',
    };
    return <Badge variant={variants[status]} size="sm">{status}</Badge>;
  };

  const getMappingStatusBadge = (status, confidence) => {
    if (status === 'Completed') {
      return (
        <div className="flex items-center space-x-2">
          <Badge variant="success" size="sm">Completed</Badge>
          {confidence && (
            <span className="text-xs text-gray-500">{confidence}%</span>
          )}
        </div>
      );
    }
    return <Badge variant="warning" size="sm">Pending</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Patient Records</h1>
          <p className="text-gray-600 mt-1">Manage patient information and medical records</p>
        </div>
        <Button onClick={handleAddPatient} className="flex items-center">
          <Plus className="w-4 h-4 mr-2" />
          Add Patient
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <div className="flex-1">
              <Input
                placeholder="Search by name, ABHA ID, or diagnosis..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                icon={Search}
              />
            </div>
            <div className="sm:w-48">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="recovered">Recovered</option>
                <option value="pending">Pending</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Patient List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        <AnimatePresence>
          {filteredPatients.map((patient, index) => (
            <motion.div
              key={patient.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card hover className="cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div 
                      className="flex items-center flex-1"
                      onClick={() => onPatientView && onPatientView(patient.id)}
                    >
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <User className="w-6 h-6 text-blue-600" />
                      </div>
                      <div className="ml-3">
                        <h3 className="font-semibold text-gray-900">{patient.name}</h3>
                        <p className="text-sm text-gray-500">
                          {patient.age} years, {patient.gender}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          onPatientView && onPatientView(patient.id);
                        }}
                      >
                        View
                      </Button>
                      <Button 
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditPatient(patient);
                        }}
                      >
                        Edit
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="w-4 h-4 mr-2" />
                      Last visit: {formatDate(patient.lastVisit)}
                    </div>
                    
                    <div className="flex items-center text-sm text-gray-600">
                      <Phone className="w-4 h-4 mr-2" />
                      {patient.phone}
                    </div>

                    <div className="pt-2 border-t border-gray-100">
                      <p className="text-sm font-medium text-gray-900 mb-2">
                        Diagnosis: {patient.diagnosis}
                      </p>
                      <div className="flex items-center justify-between">
                        {getStatusBadge(patient.status)}
                        {getMappingStatusBadge(patient.mappingStatus, patient.confidence)}
                      </div>
                    </div>

                    <div className="pt-2 border-t border-gray-100">
                      <p className="text-xs text-gray-500">
                        ABHA ID: {patient.abhaId}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filteredPatients.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No patients found</h3>
          <p className="text-gray-500 mb-6">
            {searchTerm || selectedStatus !== 'all' 
              ? 'Try adjusting your search or filter criteria.'
              : 'Get started by adding your first patient.'}
          </p>
          {!searchTerm && selectedStatus === 'all' && (
            <Button onClick={handleAddPatient}>
              <Plus className="w-4 h-4 mr-2" />
              Add First Patient
            </Button>
          )}
        </motion.div>
      )}

      {/* Patient Form Modal */}
      <Modal
        isOpen={showPatientForm}
        onClose={() => setShowPatientForm(false)}
        title={selectedPatient ? 'Edit Patient' : 'Add New Patient'}
        size="lg"
      >
        <PatientForm
          patient={selectedPatient}
          onSave={handleSavePatient}
          onCancel={() => setShowPatientForm(false)}
        />
      </Modal>
    </div>
  );
}