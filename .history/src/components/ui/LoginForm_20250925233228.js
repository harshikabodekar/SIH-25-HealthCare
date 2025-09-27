'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Shield, User, Building, Users, FileText } from 'lucide-react';
import Button from './Button';
import Input from './Input';
import Select from './Select';
import Card from './Card';
import { USER_ROLES } from '@/types/constants';

const roleOptions = [
  { 
    value: USER_ROLES.DOCTOR, 
    label: 'Doctor', 
    description: 'Individual practitioner',
    icon: User
  },
  { 
    value: USER_ROLES.HOSPITAL, 
    label: 'Hospital', 
    description: 'Healthcare institution',
    icon: Building
  },
  { 
    value: USER_ROLES.INSURANCE, 
    label: 'Insurance Officer', 
    description: 'Claims processing',
    icon: Shield
  },
  { 
    value: USER_ROLES.GOVERNMENT, 
    label: 'Government Official', 
    description: 'Policy and analytics',
    icon: FileText
  },
];

export default function LoginForm({ onLogin, loading }) {
  const [formData, setFormData] = useState({
    role: '',
    abhaId: '',
    hospitalId: '',
    password: '',
    rememberMe: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.role) {
      newErrors.role = 'Please select a role';
    }
    
    if (!formData.abhaId) {
      newErrors.abhaId = 'ABHA ID is required';
    } else if (!/^\d{14}$/.test(formData.abhaId)) {
      newErrors.abhaId = 'ABHA ID must be 14 digits';
    }
    
    if ((formData.role === USER_ROLES.DOCTOR || formData.role === USER_ROLES.HOSPITAL) && !formData.hospitalId) {
      newErrors.hospitalId = 'Hospital ID is required';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onLogin(formData);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const selectedRole = roleOptions.find(role => role.value === formData.role);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="p-8">
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="mx-auto w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mb-4"
            >
              <Shield className="w-8 h-8 text-white" />
            </motion.div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Ayush EMR System</h1>
            <p className="text-gray-600">Sign in to your account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <Select
              label="Role"
              placeholder="Select your role"
              value={formData.role}
              onChange={(value) => handleInputChange('role', value)}
              options={roleOptions}
              error={errors.role}
              required
            />

            {selectedRole && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="flex items-center p-3 bg-blue-50 rounded-lg border border-blue-200"
              >
                <selectedRole.icon className="w-5 h-5 text-blue-600 mr-3" />
                <div>
                  <p className="text-sm font-medium text-blue-900">{selectedRole.label}</p>
                  <p className="text-xs text-blue-700">{selectedRole.description}</p>
                </div>
              </motion.div>
            )}

            <Input
              label="ABHA ID"
              type="text"
              placeholder="Enter your 14-digit ABHA ID"
              value={formData.abhaId}
              onChange={(e) => handleInputChange('abhaId', e.target.value)}
              error={errors.abhaId}
              required
              maxLength={14}
            />

            {(formData.role === USER_ROLES.DOCTOR || formData.role === USER_ROLES.HOSPITAL) && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                transition={{ duration: 0.3 }}
              >
                <Input
                  label="Hospital/Clinic ID"
                  type="text"
                  placeholder="Enter your hospital or clinic ID"
                  value={formData.hospitalId}
                  onChange={(e) => handleInputChange('hospitalId', e.target.value)}
                  error={errors.hospitalId}
                  required
                />
              </motion.div>
            )}

            <Input
              label="Password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter your password"
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              error={errors.password}
              required
              rightIcon={showPassword ? EyeOff : Eye}
              onRightIconClick={() => setShowPassword(!showPassword)}
            />

            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.rememberMe}
                  onChange={(e) => handleInputChange('rememberMe', e.target.checked)}
                  className="w-4 h-4 text-blue-600 border- rounded focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-600">Remember me</span>
              </label>
              
              <button
                type="button"
                className="text-sm text-blue-600 hover:text-blue-500 font-medium"
              >
                Forgot password?
              </button>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              loading={loading}
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="text-center">
              <p className="text-sm text-gray-600">
                Need help? Contact{' '}
                <button className="text-blue-600 hover:text-blue-500 font-medium">
                  system administrator
                </button>
              </p>
            </div>
            
            <div className="mt-4 flex items-center justify-center space-x-4 text-xs text-gray-500">
              <span>🔒 ISO 22600 Compliant</span>
              <span>•</span>
              <span>FHIR R4 Ready</span>
              <span>•</span>
              <span>OAuth2 Secured</span>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}