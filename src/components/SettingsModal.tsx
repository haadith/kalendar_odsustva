import React, { useState } from 'react';
import { X, Plus, Trash2, Settings, Users, Calendar } from 'lucide-react';
import { CalendarData } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: CalendarData;
  onAddEmployee: (name: string) => void;
  onRemoveEmployee: (id: string) => void;
  onAddEventType: (name: string, color: string, icon: string) => void;
  onRemoveEventType: (id: string) => void;
}

const availableIcons = [
  'Sun', 'Coffee', 'Shield', 'Heart', 'Star', 'Zap', 'Clock', 'Home',
  'Briefcase', 'Plane', 'Car', 'Phone', 'Mail', 'Award', 'Gift'
];

const availableColors = [
  '#10B981', '#3B82F6', '#EF4444', '#F59E0B', '#8B5CF6', '#06B6D4',
  '#EC4899', '#84CC16', '#F97316', '#6366F1', '#14B8A6', '#EAB308'
];

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  data,
  onAddEmployee,
  onRemoveEmployee,
  onAddEventType,
  onRemoveEventType
}) => {
  const [activeTab, setActiveTab] = useState<'employees' | 'eventTypes'>('employees');
  const [newEmployeeName, setNewEmployeeName] = useState('');
  const [newEventTypeName, setNewEventTypeName] = useState('');
  const [newEventTypeColor, setNewEventTypeColor] = useState(availableColors[0]);
  const [newEventTypeIcon, setNewEventTypeIcon] = useState(availableIcons[0]);

  const handleAddEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    if (newEmployeeName.trim()) {
      onAddEmployee(newEmployeeName.trim());
      setNewEmployeeName('');
    }
  };

  const handleAddEventType = (e: React.FormEvent) => {
    e.preventDefault();
    if (newEventTypeName.trim()) {
      onAddEventType(newEventTypeName.trim(), newEventTypeColor, newEventTypeIcon);
      setNewEventTypeName('');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Podešavanja
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex border-b">
          <button
            onClick={() => setActiveTab('employees')}
            className={`flex-1 px-6 py-3 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${
              activeTab === 'employees'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Users className="w-4 h-4" />
            Zaposleni
          </button>
          <button
            onClick={() => setActiveTab('eventTypes')}
            className={`flex-1 px-6 py-3 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${
              activeTab === 'eventTypes'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Calendar className="w-4 h-4" />
            Tipovi događaja
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-96">
          {activeTab === 'employees' && (
            <div className="space-y-6">
              {/* Add Employee */}
              <form onSubmit={handleAddEmployee} className="flex gap-3">
                <input
                  type="text"
                  value={newEmployeeName}
                  onChange={(e) => setNewEmployeeName(e.target.value)}
                  placeholder="Ime zaposlenog"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Dodaj
                </button>
              </form>

              {/* Employee List */}
              <div className="space-y-2">
                {data.employees.map(employee => (
                  <div key={employee.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium">{employee.name}</span>
                    <button
                      onClick={() => onRemoveEmployee(employee.id)}
                      className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'eventTypes' && (
            <div className="space-y-6">
              {/* Add Event Type */}
              <form onSubmit={handleAddEventType} className="space-y-4">
                <input
                  type="text"
                  value={newEventTypeName}
                  onChange={(e) => setNewEventTypeName(e.target.value)}
                  placeholder="Naziv tipa događaja"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Boja</label>
                    <div className="grid grid-cols-4 gap-2">
                      {availableColors.map(color => (
                        <button
                          key={color}
                          type="button"
                          onClick={() => setNewEventTypeColor(color)}
                          className={`w-8 h-8 rounded-lg transition-all ${
                            newEventTypeColor === color ? 'ring-2 ring-gray-400 scale-110' : 'hover:scale-105'
                          }`}
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Ikonica</label>
                    <select
                      value={newEventTypeIcon}
                      onChange={(e) => setNewEventTypeIcon(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {availableIcons.map(icon => (
                        <option key={icon} value={icon}>{icon}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Dodaj tip događaja
                </button>
              </form>

              {/* Event Type List */}
              <div className="space-y-2">
                {data.eventTypes.map(eventType => (
                  <div key={eventType.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-6 h-6 rounded-full"
                        style={{ backgroundColor: eventType.color }}
                      />
                      <span className="font-medium">{eventType.name}</span>
                      <span className="text-sm text-gray-500">({eventType.icon})</span>
                    </div>
                    <button
                      onClick={() => onRemoveEventType(eventType.id)}
                      className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end p-6 border-t">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            Zatvori
          </button>
        </div>
      </div>
    </div>
  );
};