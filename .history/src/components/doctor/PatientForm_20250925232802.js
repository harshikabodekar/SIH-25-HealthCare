'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Select from '../ui/Select';
import { ModalFooter } from '../ui/Modal';

const genderOptions = [
  { value: 'Male', label: 'Male' },
  { value: 'Female', label: 'Female' },
  { value: 'Other', label: 'Other' },
];

const statusOptions = [
  { value: 'Active', label: 'Active' },
  { value: 'Recovered', label: 'Recovered' },
  { value: 'Pending', label: 'Pending' },
  { value: 'Inactive', label: 'Inactive' },
];

export default function PatientForm({ patient, onSave, onCancel }) {
  const [loading, setLoading] = useState(false);
  const [consent, setConsent] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset
  } = useForm({
    defaultValues: {
      name: '',
      abhaId: '',
      age: '',
      gender: '',
      phone: '',
      email: '',
      address: '',
      diagnosis: '',
      status: 'Active',
      notes: '',
    }
  });

  useEffect(() => {
    if (patient) {
      reset({
        name: patient.name || '',
        abhaId: patient.abhaId || '',
        age: patient.age || '',
        gender: patient.gender || '',
        phone: patient.phone || '',
        email: patient.email || '',
        address: patient.address || '',
        diagnosis: patient.diagnosis || '',
        status: patient.status || 'Active',
        notes: patient.notes || '',
      });
      setConsent(true); // Assume consent for existing patients
    }
  }, [patient, reset]);

  const onSubmit = async (data) => {
    if (!consent) {
      alert('Patient consent is required to proceed.');
      return;
    }

    setLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    onSave(data);
    setLoading(false);
  };

  const validateABHA = (value) => {
    if (!/^\d{14}$/.test(value)) {
      return 'ABHA ID must be exactly 14 digits';
    }
    return true;
  };

  const validatePhone = (value) => {
    if (!/^\+91\s\d{10}$/.test(value)) {
      return 'Phone must be in format: +91 XXXXXXXXXX';
    }
    return true;
  };

  return (
    <motion.form 
      onSubmit={handleSubmit(onSubmit)}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Full Name"
          {...register('name', { required: 'Name is required' })}
          error={errors.name?.message}
          required
        />

        <Input
          label="ABHA ID"
          {...register('abhaId', { 
            required: 'ABHA ID is required',
            validate: validateABHA
          })}
          error={errors.abhaId?.message}
          placeholder="14-digit ABHA ID"
          maxLength={14}
          required
        />

        <Input
          label="Age"
          type="number"
          {...register('age', { 
            required: 'Age is required',
            min: { value: 1, message: 'Age must be positive' },
            max: { value: 120, message: 'Please enter a valid age' }
          })}
          error={errors.age?.message}
          required
        />

        <div>
          <Select
            label="Gender"
            options={genderOptions}
            value={watch('gender')}
            onChange={(value) => setValue('gender', value)}
            required
          />
          {errors.gender && (
            <p className="mt-1 text-sm text-red-600">{errors.gender.message}</p>
          )}
        </div>

        <Input
          label="Phone Number"
          {...register('phone', { 
            required: 'Phone number is required',
            validate: validatePhone
          })}
          error={errors.phone?.message}
          placeholder="+91 XXXXXXXXXX"
          required
        />

        <Input
          label="Email"
          type="email"
          {...register('email', { 
            required: 'Email is required',
            pattern: {
              value: /^\S+@\S+$/i,
              message: 'Please enter a valid email'
            }
          })}
          error={errors.email?.message}
          required
        />
      </div>

      <div className="space-y-4">
        <Input
          label="Address"
          {...register('address')}
          error={errors.address?.message}
          placeholder="Full address"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Primary Diagnosis"
            {...register('diagnosis', { required: 'Diagnosis is required' })}
            error={errors.diagnosis?.message}
            required
          />

          <div>
            <Select
              label="Status"
              options={statusOptions}
              value={watch('status')}
              onChange={(value) => setValue('status', value)}
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Clinical Notes
          </label>
          <textarea
            {...register('notes')}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter clinical notes, observations, or additional information..."
          />
        </div>
      </div>

      {/* Consent Section */}
      <motion.div 
        className="p-4 bg-blue-50 rounded-lg border border-blue-200"
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
      >
        <div className="flex items-start">
          <input
            type="checkbox"
            id="consent"
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mt-1"
          />
          <label htmlFor="consent" className="ml-3 text-sm text-blue-900">
            <span className="font-medium">Patient Data Consent</span>
            <p className="mt-1 text-blue-800">
              I confirm that the patient has provided consent for their health data to be processed, 
              stored, and shared in accordance with healthcare privacy regulations and FHIR R4 standards.
              This includes consent for code mapping between NAMASTE, ICD-11, and other medical terminologies.
            </p>
          </label>
        </div>
      </motion.div>

      <ModalFooter>
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          loading={loading}
          disabled={!consent}
        >
          {loading ? 'Saving...' : (patient ? 'Update Patient' : 'Add Patient')}
        </Button>
      </ModalFooter>
    </motion.form>
  );
}