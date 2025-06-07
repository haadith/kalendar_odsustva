import React from 'react';
import { CalendarData } from '../types';
import * as Icons from 'lucide-react';
import { CalendarDays } from 'lucide-react';

interface LegendProps {
  data: CalendarData;
}

export const Legend: React.FC<LegendProps> = ({ data }) => {
  const getIcon = (iconName: string) => {
    const IconComponent = (Icons as any)[iconName];
    return IconComponent ? <IconComponent className="w-3 h-3" /> : <CalendarDays className="w-3 h-3" />;
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-lg font-semibold mb-4">Legenda</h3>
      
      <div className="grid grid-cols-1 gap-2">
        {data.eventTypes.map(eventType => (
          <div key={eventType.id} className="flex items-center gap-2">
            <div 
              className="px-2 py-1 rounded-full flex items-center gap-1.5 text-white text-xs font-medium"
              style={{ backgroundColor: eventType.color }}
            >
              {getIcon(eventType.icon)}
              <span>{eventType.name}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};