export const formatDate = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

export const parseDate = (dateStr: string): Date => {
  return new Date(dateStr + 'T00:00:00');
};

export const isToday = (date: Date): boolean => {
  const today = new Date();
  return date.toDateString() === today.toDateString();
};

export const isSameMonth = (date1: Date, date2: Date): boolean => {
  return date1.getMonth() === date2.getMonth() && date1.getFullYear() === date2.getFullYear();
};

export const isWeekend = (date: Date): boolean => {
  const day = date.getDay();
  return day === 0 || day === 6; // Sunday or Saturday
};

export const getMonthDays = (year: number, month: number): Date[] => {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const days: Date[] = [];

  // Get the Monday of the week containing the first day
  let startDate = new Date(firstDay);
  const dayOfWeek = firstDay.getDay();
  const daysToSubtract = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Monday = 0
  startDate.setDate(firstDay.getDate() - daysToSubtract);

  // Fill 42 days (6 weeks) to create a complete calendar grid
  for (let i = 0; i < 42; i++) {
    days.push(new Date(startDate));
    startDate.setDate(startDate.getDate() + 1);
  }

  return days;
};

export const getMonthName = (date: Date): string => {
  const months = [
    'Januar', 'Februar', 'Mart', 'April', 'Maj', 'Jun',
    'Jul', 'Avgust', 'Septembar', 'Oktobar', 'Novembar', 'Decembar'
  ];
  return months[date.getMonth()];
};

export const getDayName = (dayIndex: number): string => {
  const days = ['Pon', 'Uto', 'Sre', 'Čet', 'Pet', 'Sub', 'Ned'];
  return days[dayIndex];
};

export const getUpcomingEvents = (events: any[], employees: any[], eventTypes: any[]): any[] => {
  const today = new Date();
  const nextWeek = new Date();
  nextWeek.setDate(today.getDate() + 7);

  return events
    .filter(event => {
      const eventStartDate = parseDate(event.startDate);
      return eventStartDate >= today && eventStartDate <= nextWeek;
    })
    .map(event => ({
      ...event,
      employee: employees.find(emp => emp.id === event.employeeId),
      eventType: eventTypes.find(type => type.id === event.eventTypeId),
      date: parseDate(event.startDate)
    }))
    .filter(event => event.employee && event.eventType)
    .sort((a, b) => a.date.getTime() - b.date.getTime());
};

export const isDateInRange = (date: Date, startDate: string, endDate: string): boolean => {
  const checkDate = formatDate(date);
  return checkDate >= startDate && checkDate <= endDate;
};