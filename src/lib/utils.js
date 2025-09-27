import { clsx } from "clsx";

export function cn(...inputs) {
  return clsx(inputs);
}

export const formatDate = (date) => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(date));
};

export const formatDateTime = (date) => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date));
};

export const generateAuditId = () => {
  return `AUD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

export const getConfidenceColor = (confidence) => {
  if (confidence >= 90) return 'text-green-600';
  if (confidence >= 70) return 'text-orange-500';
  return 'text-red-500';
};

export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};