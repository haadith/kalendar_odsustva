import React, { useState } from 'react';
import { Settings } from 'lucide-react';
import { Calendar } from './components/Calendar';
import { UpcomingEvents } from './components/UpcomingEvents';
import { Legend } from './components/Legend';
import { EventModal } from './components/EventModal';
import { SettingsModal } from './components/SettingsModal';
import { EmployeeFilter } from './components/EmployeeFilter';
import { useCalendarData } from './hooks/useCalendarData';
import { Event } from './types';

function App() {
  const {
    data,
    loading,
    addEmployee,
    removeEmployee,
    addEventType,
    removeEventType,
    addEvent,
    updateEvent,
    removeEvent
  } = useCalendarData();

  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [dayEvents, setDayEvents] = useState<Event[]>([]);

  const handleDayClick = (date: Date, events: Event[]) => {
    setSelectedDate(date);
    setDayEvents(events);
    setIsEventModalOpen(true);
  };

  const handleEventClick = (event: Event, date: Date) => {
    setSelectedDate(date);
    // Find all events for this day
    const allDayEvents = data.events.filter(e => {
      const eventDate = new Date(e.startDate + 'T00:00:00');
      const clickedDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
      return eventDate.getTime() === clickedDate.getTime() || 
             (eventDate <= clickedDate && new Date(e.endDate + 'T00:00:00') >= clickedDate);
    });
    setDayEvents(allDayEvents);
    setIsEventModalOpen(true);
  };

  const handleEventSave = (employeeId: string, eventTypeId: string, startDate: string, endDate: string) => {
    addEvent(employeeId, eventTypeId, startDate, endDate);
  };

  const handleEventUpdate = (eventId: string, employeeId: string, eventTypeId: string, startDate: string, endDate: string) => {
    updateEvent(eventId, employeeId, eventTypeId, startDate, endDate);
  };

  const handleEventDelete = (eventId: string) => {
    removeEvent(eventId);
    // Update dayEvents to remove the deleted event
    setDayEvents(prev => prev.filter(event => event.id !== eventId));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-gray-600">Učitavanje...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Kalendar zaposlenih</h1>
            <p className="text-gray-600 mt-1">Praćenje odsustava, odmora i dežurstava</p>
          </div>
          <button
            onClick={() => setIsSettingsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-white text-gray-700 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 border hover:scale-105"
          >
            <Settings className="w-5 h-5" />
            Podešavanja
          </button>
        </div>

        {/* Employee Filter */}
        <div className="mb-6">
          <EmployeeFilter
            data={data}
            selectedEmployee={selectedEmployee}
            onEmployeeChange={setSelectedEmployee}
          />
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendar */}
          <div className="lg:col-span-2">
            <Calendar
              data={data}
              selectedEmployee={selectedEmployee}
              onDayClick={handleDayClick}
              onEventClick={handleEventClick}
            />
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Upcoming Events */}
            <UpcomingEvents
              data={data}
              selectedEmployee={selectedEmployee}
            />

            {/* Legend */}
            <Legend data={data} />
          </div>
        </div>

        {/* Modals */}
        <EventModal
          isOpen={isEventModalOpen}
          onClose={() => setIsEventModalOpen(false)}
          onSave={handleEventSave}
          onUpdate={handleEventUpdate}
          onDelete={handleEventDelete}
          data={data}
          selectedDate={selectedDate || undefined}
          dayEvents={dayEvents}
        />

        <SettingsModal
          isOpen={isSettingsModalOpen}
          onClose={() => setIsSettingsModalOpen(false)}
          data={data}
          onAddEmployee={addEmployee}
          onRemoveEmployee={removeEmployee}
          onAddEventType={addEventType}
          onRemoveEventType={removeEventType}
        />
      </div>
    </div>
  );
}

export default App;