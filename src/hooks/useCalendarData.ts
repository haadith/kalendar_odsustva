import { useState, useEffect } from 'react';
import { CalendarData } from '../types';
import { defaultData } from '../data/defaultData';

const API_URL = '/api/calendar';

export const useCalendarData = () => {
  const [data, setData] = useState<CalendarData>(defaultData);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(API_URL)
      .then(res => {
        if (!res.ok) throw new Error('Failed to load');
        return res.json();
      })
      .then(json => setData(json))
      .catch(err => {
        console.error('Error loading data:', err);
        setData(defaultData);
      })
      .finally(() => setLoading(false));
  }, []);

  const saveData = (newData: CalendarData) => {
    setData(newData);
    fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newData)
    }).catch(err => console.error('Error saving data:', err));
  };

  const addEmployee = (name: string) => {
    const newEmployee = {
      id: Date.now().toString(),
      name
    };
    const newData = {
      ...data,
      employees: [...data.employees, newEmployee]
    };
    saveData(newData);
  };

  const removeEmployee = (id: string) => {
    const newData = {
      ...data,
      employees: data.employees.filter(emp => emp.id !== id),
      events: data.events.filter(event => event.employeeId !== id)
    };
    saveData(newData);
  };

  const addEventType = (name: string, color: string, icon: string) => {
    const newEventType = {
      id: Date.now().toString(),
      name,
      color,
      icon
    };
    const newData = {
      ...data,
      eventTypes: [...data.eventTypes, newEventType]
    };
    saveData(newData);
  };

  const removeEventType = (id: string) => {
    const newData = {
      ...data,
      eventTypes: data.eventTypes.filter(type => type.id !== id),
      events: data.events.filter(event => event.eventTypeId !== id)
    };
    saveData(newData);
  };

  const addEvent = (employeeId: string, eventTypeId: string, startDate: string, endDate: string) => {
    const newEvent = {
      id: Date.now().toString(),
      employeeId,
      eventTypeId,
      startDate,
      endDate
    };
    const newData = {
      ...data,
      events: [...data.events, newEvent]
    };
    saveData(newData);
  };

  const updateEvent = (eventId: string, employeeId: string, eventTypeId: string, startDate: string, endDate: string) => {
    const newData = {
      ...data,
      events: data.events.map(event =>
        event.id === eventId
          ? { ...event, employeeId, eventTypeId, startDate, endDate }
          : event
      )
    };
    saveData(newData);
  };

  const removeEvent = (id: string) => {
    const newData = {
      ...data,
      events: data.events.filter(event => event.id !== id)
    };
    saveData(newData);
  };

  return {
    data,
    loading,
    addEmployee,
    removeEmployee,
    addEventType,
    removeEventType,
    addEvent,
    updateEvent,
    removeEvent
  };
};