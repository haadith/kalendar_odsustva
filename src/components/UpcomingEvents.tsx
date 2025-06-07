import React from 'react';
import { CalendarDays } from 'lucide-react';
import { getUpcomingEvents } from '../utils/dateUtils';
import { CalendarData } from '../types';
import * as Icons from 'lucide-react';

interface UpcomingEventsProps {
  data: CalendarData;
  selectedEmployee: string;
}

export const UpcomingEvents: React.FC<UpcomingEventsProps> = ({ data, selectedEmployee }) => {
  const upcomingEvents = getUpcomingEvents(
    selectedEmployee 
      ? data.events.filter(event => event.employeeId === selectedEmployee)
      : data.events,
    data.employees,
    data.eventTypes
  );

  const getIcon = (iconName: string) => {
    const IconComponent = (Icons as any)[iconName];
    return IconComponent ? <IconComponent className="w-4 h-4" /> : <CalendarDays className="w-4 h-4" />;
  };

  const formatDateRange = (startDate: string, endDate: string) => {
    const start = new Date(startDate + 'T00:00:00');
    const end = new Date(endDate + 'T00:00:00');
    
    if (startDate === endDate) {
      return start.toLocaleDateString('sr-Latn-RS', { 
        day: 'numeric', 
        month: 'short' 
      });
    }
    
    return `${start.toLocaleDateString('sr-Latn-RS', { 
      day: 'numeric', 
      month: 'short' 
    })} - ${end.toLocaleDateString('sr-Latn-RS', { 
      day: 'numeric', 
      month: 'short' 
    })}`;
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <CalendarDays className="w-5 h-5" />
        Nadolazeći događaji
      </h3>
      
      {upcomingEvents.length === 0 ? (
        <p className="text-gray-500 text-sm">Nema nadolazećih događaja u sledećih 7 dana</p>
      ) : (
        <div className="space-y-3">
          {upcomingEvents.map((event, index) => (
            <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div 
                className="w-8 h-8 rounded-full flex items-center justify-center text-white flex-shrink-0 mt-0.5"
                style={{ backgroundColor: event.eventType.color }}
              >
                {getIcon(event.eventType.icon)}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="font-medium text-gray-900 truncate">
                  {event.employee.name}
                </div>
                <div className="text-sm text-gray-600 mb-1">
                  {event.eventType.name}
                </div>
                <div className="text-xs text-gray-500 font-medium">
                  {formatDateRange(event.startDate, event.endDate)}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};