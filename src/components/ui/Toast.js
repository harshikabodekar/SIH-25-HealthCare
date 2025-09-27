'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

const toastVariants = {
  success: {
    icon: CheckCircle,
    className: 'bg-green-50 border-green-200 text-green-800',
    iconColor: 'text-green-500',
  },
  error: {
    icon: AlertCircle,
    className: 'bg-red-50 border-red-200 text-red-800',
    iconColor: 'text-red-500',
  },
  warning: {
    icon: AlertTriangle,
    className: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    iconColor: 'text-yellow-500',
  },
  info: {
    icon: Info,
    className: 'bg-blue-50 border-blue-200 text-blue-800',
    iconColor: 'text-blue-500',
  },
};

export default function Toast({
  id,
  type = 'info',
  title,
  message,
  duration = 5000,
  onClose,
  className,
}) {
  const variant = toastVariants[type];
  const Icon = variant.icon;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 50, scale: 0.3 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.5 }}
      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      className={cn(
        'relative flex items-start p-4 border rounded-lg shadow-lg max-w-md w-full',
        variant.className,
        className
      )}
      role="alert"
      aria-live="polite"
    >
      <div className={cn('flex-shrink-0', variant.iconColor)}>
        <Icon size={20} />
      </div>
      
      <div className="ml-3 flex-1">
        {title && (
          <p className="text-sm font-medium">
            {title}
          </p>
        )}
        {message && (
          <p className={cn('text-sm', title && 'mt-1')}>
            {message}
          </p>
        )}
      </div>
      
      <button
        onClick={() => onClose(id)}
        className="ml-4 flex-shrink-0 text-current opacity-70 hover:opacity-100 transition-opacity"
        aria-label="Close notification"
      >
        <X size={16} />
      </button>
      
      {duration > 0 && (
        <motion.div
          className="absolute bottom-0 left-0 h-1 bg-current opacity-30 rounded-b-lg"
          initial={{ width: '100%' }}
          animate={{ width: '0%' }}
          transition={{ duration: duration / 1000, ease: 'linear' }}
          onAnimationComplete={() => onClose(id)}
        />
      )}
    </motion.div>
  );
}

// Toast Container Component
export function ToastContainer({ toasts = [], onClose }) {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-4">
      <AnimatePresence>
        {toasts.map((toast) => (
          <Toast key={toast.id} {...toast} onClose={onClose} />
        ))}
      </AnimatePresence>
    </div>
  );
}