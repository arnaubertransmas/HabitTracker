import React, { useState, useEffect, useCallback } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import axiosInstance from '../../config/axiosConfig';
import '../../assets/css/calendar.css';

// Habit and CalendarEvent interfaces remain the same
interface Habit {
  // structure of db
  _id: string;
  name: string;
  type: 'Habit' | 'Non-negotiable';
  days: string[];
  time_day: string;
  start_time: string;
  end_time: string;
  user_email: string;
}

interface CalendarEvent {
  // structure of calendar
  title: string;
  daysOfWeek: number[];
  startTime: string;
  endTime: string;
  type: string;
}

const Calendar: React.FC = () => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  const loadHabits = useCallback(async () => {
    // day name to index day
    const dayNameToIndex = {
      Sunday: 0,
      Monday: 1,
      Tuesday: 2,
      Wednesday: 3,
      Thursday: 4,
      Friday: 5,
      Saturday: 6,
    };

    try {
      setLoading(true);
      const response = await axiosInstance.get('/habit/get_habits');

      if (response.data.success) {
        const habits: Habit[] = response.data.habits;

        // formattedEvent type = CalendarEvent
        const formattedEvents: CalendarEvent[] = habits.map((habit) => ({
          title: habit.name,
          daysOfWeek: habit.days.map(
            // transform day to index if day in dayNameToIndex
            (day) => dayNameToIndex[day as keyof typeof dayNameToIndex],
          ),
          startTime: habit.start_time,
          endTime: habit.end_time,
          type: habit.type,
        }));

        setEvents(formattedEvents);
      }
    } catch (error) {
      console.error('Error loading habits:', error);
      setError('Could not load habits');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadHabits();
  }, [loadHabits]);

  return (
    <div
      style={{
        width: '100%',
        maxWidth: '1200px',
        margin: '0 0 0 225px',
        padding: '20px',
      }}
    >
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p style={{ color: 'red' }}>{error}</p>
      ) : (
        <div
          style={{
            width: '100%',
            height: 'auto',
            minHeight: '600px',
          }}
        >
          <FullCalendar
            // plugins for the calendar, view&dragNdrop
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            height="auto"
            // superior toolbar
            headerToolbar={{
              left: 'prev,next',
              center: 'title',
              right: 'dayGridMonth,dayGridWeek,timeGridDay',
            }}
            // define views of calendar
            views={{
              dayGridMonth: {
                type: 'dayGridMonth',
                duration: { months: 1 },
              },
              dayGridWeek: {
                type: 'dayGridWeek',
                duration: { week: 1 },
              },
              timeGridDay: {
                type: 'timeGridDay',
                duration: { days: 1 },
              },
            }}
            dayCellClassNames={(info_cell) => {
              const today = new Date();
              const todayWithoutTime = new Date(
                today.getFullYear(),
                today.getMonth(),
                today.getDate(),
              );

              const cellDate = new Date(info_cell.date);

              if (cellDate < todayWithoutTime) {
                return ['past-day'];
              }

              if (cellDate.getTime() === todayWithoutTime.getTime()) {
                return ['highlight-today'];
              }

              return [];
            }}
            // habits defined
            events={events}
            eventClassNames={(eventInfo) => {
              return eventInfo.event.extendedProps.type === 'Habit'
                ? ['habit-event']
                : ['non-negotiable-event'];
            }}
            eventConstraint={{
              startTime: '00:00',
              endTime: '24:00',
            }}
            eventContent={(eventInfo) => {
              return {
                html: `<span>${eventInfo.event.title}</span>`,
              };
            }}
            dateClick={(info) => {
              console.log('Date clicked:', info.dateStr);
            }}
            eventClick={(info) => {
              console.log('Event clicked:', info.event.title);
            }}
          />
        </div>
      )}
    </div>
  );
};

export default Calendar;
