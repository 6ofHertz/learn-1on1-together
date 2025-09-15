import { useMemo } from 'react';

export function useWeekendScheduling() {
  const isWeekend = useMemo(() => {
    const today = new Date();
    const dayOfWeek = today.getDay();
    return dayOfWeek === 0 || dayOfWeek === 6; // Sunday = 0, Saturday = 6
  }, []);

  const daysUntilWeekend = useMemo(() => {
    const today = new Date();
    const dayOfWeek = today.getDay();
    
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      return 0; // It's already weekend
    }
    
    return 6 - dayOfWeek; // Days until Saturday
  }, []);

  const nextWeekendMessage = useMemo(() => {
    if (isWeekend) {
      return "Lessons are available now!";
    }
    
    if (daysUntilWeekend === 1) {
      return "Lessons will be available tomorrow!";
    }
    
    return `Lessons will be available in ${daysUntilWeekend} days`;
  }, [isWeekend, daysUntilWeekend]);

  return {
    isWeekend,
    daysUntilWeekend,
    nextWeekendMessage
  };
}