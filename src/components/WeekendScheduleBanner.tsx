import React from 'react';
import { useWeekendScheduling } from '@/hooks/useWeekendScheduling';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, Clock } from 'lucide-react';

const WeekendScheduleBanner = () => {
  const { isWeekend, nextWeekendMessage } = useWeekendScheduling();

  if (isWeekend) {
    return (
      <Card className="mb-6 bg-gradient-to-r from-green-500 to-emerald-600 text-white">
        <CardContent className="flex items-center justify-center p-4">
          <Calendar className="mr-2 w-5 h-5" />
          <span className="font-semibold">🎉 Weekend Learning Time! All lessons are now available!</span>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-6 bg-gradient-to-r from-orange-500 to-yellow-600 text-white">
      <CardContent className="flex items-center justify-center p-4">
        <Clock className="mr-2 w-5 h-5" />
        <span className="font-semibold">{nextWeekendMessage}</span>
      </CardContent>
    </Card>
  );
};

export default WeekendScheduleBanner;