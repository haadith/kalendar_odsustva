export interface Employee {
  id: string;
  name: string;
}

export interface EventType {
  id: string;
  name: string;
  color: string;
  icon: string;
}

export interface Event {
  id: string;
  employeeId: string;
  eventTypeId: string;
  startDate: string;
  endDate: string;
  title?: string;
}

export interface CalendarData {
  employees: Employee[];
  eventTypes: EventType[];
  events: Event[];
}

export interface CalendarState {
  currentDate: Date;
  selectedDate: Date | null;
  isModalOpen: boolean;
  isSettingsOpen: boolean;
  selectedEmployee: string;
  editingEvent: Event | null;
}