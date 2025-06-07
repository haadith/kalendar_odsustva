import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { getMonthDays, getMonthName, getDayName, isToday, isSameMonth, isWeekend, formatDate, isDateInRange } from '../utils/dateUtils';
import { CalendarData, Event } from '../types';

interface CalendarProps {
  data: CalendarData;
  selectedEmployee: string;
  onDayClick: (date: Date, events: Event[]) => void;
  onEventClick: (event: Event, date: Date) => void;
}

export const Calendar: React.FC<CalendarProps> = ({ 
  data, 
  selectedEmployee, 
  onDayClick, 
  onEventClick 
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isAnimating, setIsAnimating] = useState(false);

  const monthDays = getMonthDays(currentDate.getFullYear(), currentDate.getMonth());

  const navigateMonth = (direction: 'prev' | 'next') => {
    setIsAnimating(true);
    setTimeout(() => {
      const newDate = new Date(currentDate);
      if (direction === 'prev') {
        newDate.setMonth(newDate.getMonth() - 1);
      } else {
        newDate.setMonth(newDate.getMonth() + 1);
      }
      setCurrentDate(newDate);
      setIsAnimating(false);
    }, 150);
  };

  const getEventsForDate = (date: Date): Event[] => {
    const dateStr = formatDate(date);
    return data.events.filter(event => {
      if (selectedEmployee && event.employeeId !== selectedEmployee) {
        return false;
      }
      return isDateInRange(date, event.startDate, event.endDate);
    });
  };

  const handleDayClick = (date: Date) => {
    const events = getEventsForDate(date);
    onDayClick(date, events);
  };

  const handleEventClick = (e: React.MouseEvent, event: Event, date: Date) => {
    e.stopPropagation();
    onEventClick(event, date);
  };

  const handleMoreEventsClick = (e: React.MouseEvent, date: Date) => {
    e.stopPropagation();
    const events = getEventsForDate(date);
    onDayClick(date, events);
  };

  const renderEvent = (event: Event, date: Date) => {
    const employee = data.employees.find(emp => emp.id === event.employeeId);
    const eventType = data.eventTypes.find(type => type.id === event.eventTypeId);
    
    if (!employee || !eventType) return null;

    return (
      <div
        key={event.id}
        className="text-xs px-1.5 py-0.5 rounded-md text-white font-medium cursor-pointer hover:opacity-80 transition-all duration-200 truncate shadow-sm"
        style={{ backgroundColor: eventType.color }}
        onClick={(e) => handleEventClick(e, event, date)}
        title={`${employee.name} - ${eventType.name}`}
      >
        {employee.name}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => navigateMonth('prev')}
          className="p-2 hover:bg-gray-100 rounded-lg transition-all duration-200 hover:scale-105"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        
        <h2 className={`text-xl font-semibold transition-opacity duration-150 ${isAnimating ? 'opacity-50' : 'opacity-100'}`}>
          {getMonthName(currentDate)} {currentDate.getFullYear()}
        </h2>
        
        <button
          onClick={() => navigateMonth('next')}
          className="p-2 hover:bg-gray-100 rounded-lg transition-all duration-200 hover:scale-105"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Days header */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {Array.from({ length: 7 }, (_, i) => (
          <div key={i} className="text-center text-sm font-medium text-gray-500 py-2">
            {getDayName(i)}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className={`grid grid-cols-7 gap-1 transition-opacity duration-150 ${isAnimating ? 'opacity-50' : 'opacity-100'}`}>
        {monthDays.map((date, index) => {
          const events = getEventsForDate(date);
          const isCurrentMonth = isSameMonth(date, currentDate);
          const isTodayDate = isToday(date);
          const isWeekendDate = isWeekend(date);
          const visibleEvents = events.slice(0, 3);
          const remainingCount = events.length - 3;

          return (
            <div
              key={index}
              className={`
                min-h-[90px] p-2 border border-gray-100 rounded-lg cursor-pointer transition-all duration-200 
                hover:shadow-md hover:scale-105 hover:border-gray-300 hover:bg-gray-25
                ${isCurrentMonth ? 'bg-white' : 'bg-gray-50'}
                ${isTodayDate ? 'ring-2 ring-blue-500 bg-blue-50 shadow-md' : ''}
                ${isWeekendDate && isCurrentMonth ? 'bg-gray-25' : ''}
                ${!isCurrentMonth ? 'opacity-60' : ''}
              `}
              onClick={() => handleDayClick(date)}
            >
              <div className={`
                text-sm font-medium mb-1.5 
                ${isTodayDate ? 'text-blue-600 font-bold' : ''}
                ${isCurrentMonth ? 'text-gray-900' : 'text-gray-400'}
                ${isWeekendDate && isCurrentMonth ? 'text-gray-600' : ''}
              `}>
                {date.getDate()}
              </div>
              
              <div className="space-y-1">
                {visibleEvents.map(event => renderEvent(event, date))}
                {remainingCount > 0 && (
                  <div 
                    className="text-xs text-blue-600 px-1.5 py-0.5 bg-blue-50 rounded-md cursor-pointer hover:bg-blue-100 transition-colors font-medium"
                    onClick={(e) => handleMoreEventsClick(e, date)}
                  >
                    +{remainingCount} još
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};