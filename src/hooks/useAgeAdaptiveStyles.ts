import { useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export function useAgeAdaptiveStyles() {
  const { profile } = useAuth();
  
  const styles = useMemo(() => {
    const ageGroup = profile?.age_group || 'adult';
    
    switch (ageGroup) {
      case 'child':
        return {
          buttonSize: 'lg',
          fontSize: 'text-xl',
          spacing: 'p-6',
          borderRadius: 'rounded-xl',
          colors: 'bg-gradient-to-r from-purple-400 to-pink-400',
          iconSize: 'w-8 h-8'
        };
      case 'teen':
        return {
          buttonSize: 'default',
          fontSize: 'text-lg',
          spacing: 'p-4',
          borderRadius: 'rounded-lg',
          colors: 'bg-gradient-to-r from-blue-500 to-teal-400',
          iconSize: 'w-6 h-6'
        };
      case 'senior':
        return {
          buttonSize: 'lg',
          fontSize: 'text-xl',
          spacing: 'p-6',
          borderRadius: 'rounded-md',
          colors: 'bg-gradient-to-r from-emerald-500 to-blue-600',
          iconSize: 'w-8 h-8'
        };
      default: // adult
        return {
          buttonSize: 'default',
          fontSize: 'text-base',
          spacing: 'p-4',
          borderRadius: 'rounded-lg',
          colors: 'bg-gradient-to-r from-primary to-accent',
          iconSize: 'w-5 h-5'
        };
    }
  }, [profile?.age_group]);

  return styles;
}