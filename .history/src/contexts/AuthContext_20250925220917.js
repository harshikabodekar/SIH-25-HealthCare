'use client';

import { createContext, useContext, useReducer, useEffect } from 'react';
import { USER_ROLES } from '@/types/constants';

const AuthContext = createContext(null);

const initialState = {
  user: null,
  isAuthenticated: false,
  loading: true,
  error: null,
};

function authReducer(state, action) {
  switch (action.type) {
    case 'LOGIN_START':
      return { ...state, loading: true, error: null };
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        loading: false,
        error: null,
      };
    case 'LOGIN_ERROR':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        loading: false,
        error: action.payload,
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        loading: false,
        error: null,
      };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    default:
      return state;
  }
}

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Check for existing session on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        const userData = localStorage.getItem('user_data');
        
        if (token && userData) {
          const user = JSON.parse(userData);
          // Validate token with backend here
          dispatch({ type: 'LOGIN_SUCCESS', payload: user });
        } else {
          dispatch({ type: 'SET_LOADING', payload: false });
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    checkAuth();
  }, []);

  const login = async (credentials) => {
    dispatch({ type: 'LOGIN_START' });
    
    try {
      // Mock API call - replace with actual authentication
      const response = await mockLogin(credentials);
      
      if (response.success) {
        const userData = {
          id: response.user.id,
          name: response.user.name,
          role: credentials.role,
          abhaId: credentials.abhaId,
          hospitalId: credentials.hospitalId,
          permissions: getRolePermissions(credentials.role),
        };
        
        localStorage.setItem('auth_token', response.token);
        localStorage.setItem('user_data', JSON.stringify(userData));
        
        dispatch({ type: 'LOGIN_SUCCESS', payload: userData });
        return { success: true };
      } else {
        throw new Error(response.error || 'Login failed');
      }
    } catch (error) {
      dispatch({ type: 'LOGIN_ERROR', payload: error.message });
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
    dispatch({ type: 'LOGOUT' });
  };

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const value = {
    ...state,
    login,
    logout,
    clearError,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Mock login function - replace with actual API call
async function mockLogin(credentials) {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Simulate different login scenarios
      if (credentials.password === 'demo123') {
        resolve({
          success: true,
          token: `mock_token_${Date.now()}`,
          user: {
            id: `user_${Date.now()}`,
            name: getMockUserName(credentials.role),
            email: `${credentials.abhaId}@example.com`,
          },
        });
      } else {
        resolve({
          success: false,
          error: 'Invalid credentials',
        });
      }
    }, 1500); // Simulate network delay
  });
}

function getMockUserName(role) {
  const names = {
    [USER_ROLES.DOCTOR]: 'Dr. Rajesh Kumar',
    [USER_ROLES.HOSPITAL]: 'AIIMS Delhi Admin',
    [USER_ROLES.INSURANCE]: 'Priya Sharma',
    [USER_ROLES.GOVERNMENT]: 'Amit Singh',
  };
  return names[role] || 'User';
}

function getRolePermissions(role) {
  const permissions = {
    [USER_ROLES.DOCTOR]: [
      'view_patients',
      'create_patients',
      'edit_patients',
      'view_mappings',
      'create_mappings',
      'view_audit_logs',
    ],
    [USER_ROLES.HOSPITAL]: [
      'view_patients',
      'create_patients',
      'edit_patients',
      'view_mappings',
      'create_mappings',
      'view_audit_logs',
      'manage_users',
    ],
    [USER_ROLES.INSURANCE]: [
      'view_claims',
      'view_fhir_bundles',
      'export_data',
      'view_mappings',
    ],
    [USER_ROLES.GOVERNMENT]: [
      'view_analytics',
      'view_reports',
      'export_reports',
    ],
  };
  return permissions[role] || [];
}