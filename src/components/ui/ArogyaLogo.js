'use client';

import Image from 'next/image';
import { cn } from '@/lib/utils';

export default function ArogyaLogo({ 
  size = 'medium', 
  className,
  showText = true,
  textClassName = ''
}) {
  const sizeConfig = {
    small: {
      width: 32,
      height: 32,
      textSize: 'text-lg'
    },
    medium: {
      width: 40,
      height: 40,
      textSize: 'text-xl'
    },
    large: {
      width: 64,
      height: 64,
      textSize: 'text-2xl'
    },
    xl: {
      width: 120,
      height: 120,
      textSize: 'text-4xl'
    }
  };

  const config = sizeConfig[size];
  const logoSrc = size === 'xl' ? '/arogya-logo.svg' : '/arogya-logo-small.svg';

  if (!showText) {
    return (
      <Image
        src={logoSrc}
        alt="ArogyaCodes Logo"
        width={config.width}
        height={config.height}
        className={cn('object-contain', className)}
        priority
      />
    );
  }

  return (
    <div className={cn('flex items-center space-x-3', className)}>
      <Image
        src={logoSrc}
        alt="ArogyaCodes Logo"
        width={config.width}
        height={config.height}
        className="object-contain"
        priority
      />
      {showText && (
        <div className="flex flex-col">
          <span className={cn(
            'font-bold leading-tight',
            config.textSize,
            textClassName
          )}
          style={{ color: '#0d7377' }}>
            AROGYA
          </span>
          <span className={cn(
            'font-bold leading-tight -mt-1',
            config.textSize,
            textClassName
          )}
          style={{ color: '#d4a574' }}>
            CODES
          </span>
        </div>
      )}
    </div>
  );
}

// Individual logo variants for convenience
export function ArogyaLogoSmall({ className, showText = true }) {
  return <ArogyaLogo size="small" className={className} showText={showText} />;
}

export function ArogyaLogoMedium({ className, showText = true }) {
  return <ArogyaLogo size="medium" className={className} showText={showText} />;
}

export function ArogyaLogoLarge({ className, showText = true }) {
  return <ArogyaLogo size="large" className={className} showText={showText} />;
}

export function ArogyaLogoXL({ className, showText = true }) {
  return <ArogyaLogo size="xl" className={className} showText={showText} />;
}