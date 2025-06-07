import React from 'react';
import { Users } from 'lucide-react';
import { CalendarData } from '../types';

interface EmployeeFilterProps {
  data: CalendarData;
  selectedEmployee: string;
  onEmployeeChange: (employeeId: string) => void;
}

export const EmployeeFilter: React.FC<EmployeeFilterProps> = ({
  data,
  selectedEmployee,
  onEmployeeChange
}) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-4">
      <div className="flex items-center gap-3">
        <Users className="w-5 h-5 text-gray-600" />
        <select
          value={selectedEmployee}
          onChange={(e) => onEmployeeChange(e.target.value)}
          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white transition-all duration-200"
        >
          <option value="">Svi zaposleni</option>
          {data.employees.map(employee => (
            <option key={employee.id} value={employee.id}>
              {employee.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};