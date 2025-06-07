import React, { useState, useEffect } from 'react';
import { X, Calendar, User, Tag, Edit, Trash2, Plus } from 'lucide-react';
import { CalendarData, Event } from '../types';
import { formatDate, parseDate } from '../utils/dateUtils';

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (employeeId: string, eventTypeId: string, startDate: string, endDate: string) => void;
  onUpdate: (eventId: string, employeeId: string, eventTypeId: string, startDate: string, endDate: string) => void;
  onDelete: (eventId: string) => void;
  data: CalendarData;
  selectedDate?: Date;
  dayEvents: Event[];
}

export const EventModal: React.FC<EventModalProps> = ({
  isOpen,
  onClose,
  onSave,
  onUpdate,
  onDelete,
  data,
  selectedDate,
  dayEvents
}) => {
  const [employeeId, setEmployeeId] = useState('');
  const [eventTypeId, setEventTypeId] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [editingEventId, setEditingEventId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setEditingEventId(null);
      setShowAddForm(dayEvents.length === 0);
      setEmployeeId('');
      setEventTypeId(data.eventTypes[0]?.id || '');
      const dateStr = selectedDate ? formatDate(selectedDate) : formatDate(new Date());
      setStartDate(dateStr);
      setEndDate(dateStr);
    }
  }, [isOpen, selectedDate, data.eventTypes, dayEvents.length]);

  const handleEdit = (event: Event) => {
    setEditingEventId(event.id);
    setEmployeeId(event.employeeId);
    setEventTypeId(event.eventTypeId);
    setStartDate(event.startDate);
    setEndDate(event.endDate);
    setShowAddForm(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (employeeId && eventTypeId && startDate && endDate) {
      if (editingEventId) {
        onUpdate(editingEventId, employeeId, eventTypeId, startDate, endDate);
      } else {
        onSave(employeeId, eventTypeId, startDate, endDate);
      }
      setShowAddForm(false);
      setEditingEventId(null);
      onClose();
    }
  };

  const handleDelete = (eventId: string) => {
    onDelete(eventId);
    if (editingEventId === eventId) {
      setShowAddForm(false);
      setEditingEventId(null);
    }
  };

  const handleCancel = () => {
    setShowAddForm(false);
    setEditingEventId(null);
    setEmployeeId('');
    setEventTypeId(data.eventTypes[0]?.id || '');
    const dateStr = selectedDate ? formatDate(selectedDate) : formatDate(new Date());
    setStartDate(dateStr);
    setEndDate(dateStr);
  };

  if (!isOpen) return null;

  const selectedDateStr = selectedDate ? selectedDate.toLocaleDateString('sr-RS', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  }) : '';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-xl font-semibold">Događaji za {selectedDateStr}</h2>
            <p className="text-sm text-gray-600 mt-1">
              {dayEvents.length === 0 ? 'Nema događaja' : `${dayEvents.length} događaj${dayEvents.length > 1 ? 'a' : ''}`}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 max-h-[70vh] overflow-y-auto">
          {/* Existing Events List */}
          {dayEvents.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-4">Postojeći događaji</h3>
              <div className="space-y-3">
                {dayEvents.map(event => {
                  const employee = data.employees.find(emp => emp.id === event.employeeId);
                  const eventType = data.eventTypes.find(type => type.id === event.eventTypeId);
                  
                  if (!employee || !eventType) return null;

                  return (
                    <div key={event.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: eventType.color }}
                        />
                        <div>
                          <div className="font-medium">{employee.name}</div>
                          <div className="text-sm text-gray-600">{eventType.name}</div>
                          <div className="text-xs text-gray-500">
                            {event.startDate === event.endDate 
                              ? parseDate(event.startDate).toLocaleDateString('sr-RS')
                              : `${parseDate(event.startDate).toLocaleDateString('sr-RS')} - ${parseDate(event.endDate).toLocaleDateString('sr-RS')}`
                            }
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(event)}
                          className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(event.id)}
                          className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Add New Event Button */}
          {!showAddForm && (
            <button
              onClick={() => setShowAddForm(true)}
              className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all duration-200 flex items-center justify-center gap-2 text-gray-600 hover:text-blue-600"
            >
              <Plus className="w-5 h-5" />
              Dodaj novi događaj
            </button>
          )}

          {/* Add/Edit Event Form */}
          {showAddForm && (
            <div className="border-t pt-6">
              <h3 className="text-lg font-medium mb-4">
                {editingEventId ? 'Izmeni događaj' : 'Dodaj novi događaj'}
              </h3>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Employee Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Zaposleni
                  </label>
                  <select
                    value={employeeId}
                    onChange={(e) => setEmployeeId(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="">Izaberi zaposlenog</option>
                    {data.employees.map(employee => (
                      <option key={employee.id} value={employee.id}>
                        {employee.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Event Type Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <Tag className="w-4 h-4" />
                    Tip događaja
                  </label>
                  <select
                    value={eventTypeId}
                    onChange={(e) => setEventTypeId(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    {data.eventTypes.map(eventType => (
                      <option key={eventType.id} value={eventType.id}>
                        {eventType.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Date Range */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Datum početka
                    </label>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Datum kraja
                    </label>
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      min={startDate}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Otkaži
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    {editingEventId ? 'Ažuriraj' : 'Dodaj'} događaj
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};