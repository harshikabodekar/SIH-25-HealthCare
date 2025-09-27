'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Input({
  type = 'text',
  placeholder,
  value,
  onChange,
  onFocus,
  onBlur,
  className,
  error,
  label,
  required = false,
  disabled = false,
  icon: Icon,
  rightIcon: RightIcon,
  onRightIconClick,
  autoComplete,
  suggestions = [],
  onSuggestionSelect,
  showSuggestions = false,
  loading = false,
  ...props
}) {
  const [focused, setFocused] = useState(false);
  const [showSuggestionList, setShowSuggestionList] = useState(false);
  const inputRef = useRef(null);
  const suggestionsRef = useRef(null);

  useEffect(() => {
    if (showSuggestions && suggestions.length > 0 && focused) {
      setShowSuggestionList(true);
    } else {
      setShowSuggestionList(false);
    }
  }, [showSuggestions, suggestions, focused]);

  const handleFocus = (e) => {
    setFocused(true);
    onFocus?.(e);
  };

  const handleBlur = (e) => {
    // Delay blur to allow suggestion clicks
    setTimeout(() => {
      setFocused(false);
      setShowSuggestionList(false);
      onBlur?.(e);
    }, 150);
  };

  const handleSuggestionClick = (suggestion) => {
    onSuggestionSelect?.(suggestion);
    setShowSuggestionList(false);
    inputRef.current?.focus();
  };

  return (
    <div className="relative">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      
      <div className="relative">
        {Icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            <Icon size={20} />
          </div>
        )}
        
        <motion.input
          ref={inputRef}
          type={type}
          value={value}
          onChange={onChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          disabled={disabled}
          autoComplete={autoComplete}
          className={cn(
            'w-full px-4 py-3 border border-gray-300 rounded-lg transition-all duration-200',
            'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
            'disabled:bg-gray-50 disabled:cursor-not-allowed',
            'text-black placeholder-gray-500',
            Icon && 'pl-11',
            (RightIcon || loading) && 'pr-11',
            error && 'border-red-500 focus:ring-red-500',
            className
          )}
          animate={{
            scale: focused ? 1.01 : 1,
          }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          {...props}
        />
        
        {loading && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <motion.div
              className="h-5 w-5 border-2 border-blue-500 border-t-transparent rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            />
          </div>
        )}
        
        {RightIcon && !loading && (
          <button
            type="button"
            onClick={onRightIconClick}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <RightIcon size={20} />
          </button>
        )}
      </div>

      <AnimatePresence>
        {showSuggestionList && (
          <motion.div
            ref={suggestionsRef}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto"
          >
            {suggestions.map((suggestion, index) => (
              <motion.div
                key={index}
                className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                onClick={() => handleSuggestionClick(suggestion)}
                whileHover={{ backgroundColor: '#f9fafb' }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-900">{suggestion.term}</div>
                    {suggestion.code && (
                      <div className="text-sm text-gray-500">Code: {suggestion.code}</div>
                    )}
                  </div>
                  {suggestion.confidence && (
                    <div className="text-sm text-gray-400">{suggestion.confidence}%</div>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {error && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-2 text-sm text-red-600"
        >
          {error}
        </motion.p>
      )}
    </div>
  );
}