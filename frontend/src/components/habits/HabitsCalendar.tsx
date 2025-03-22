import React, { useState, useEffect } from 'react';
import { Calendar as BigCalendar } from 'react-big-calendar';
import { dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay, addHours } from 'date-fns';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import axiosInstance from '../../config/axiosConfig';

// Configurar el calendari per utilitzar date-fns
const locales = {
  en: require('date-fns/locale/en-US'), // Idioma, pots canviar per altres locals com 'ca' per català
};
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

interface MyEvent {
  title: string;
  start: Date;
  end: Date;
  type: 'habit' | 'non-negotiable';
}

const MyCalendar: React.FC = () => {
  const [events, setEvents] = useState<MyEvent[]>([]); // Aquí emmagatzemarem els esdeveniments
  const [loading, setLoading] = useState(true); // Controlar l'estat de càrrega
  const [error, setError] = useState<string>(''); // Controlar possibles errors

  // Funció per obtenir els hàbits
  const loadHabits = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/habit/get_habits');
      if (response.data.success) {
        const habits = response.data.habits;
        const formattedEvents: MyEvent[] = habits.map((habit: any) => {
          let startDate: Date;
          let endDate: Date;

          const currentDate = new Date();
          switch (habit.time_day) {
            case 'morning':
              startDate = addHours(currentDate, 8);
              endDate = addHours(currentDate, 13);
              break;
            case 'afternoon':
              startDate = addHours(currentDate, 13);
              endDate = addHours(currentDate, 19);
              break;
            case 'night':
              startDate = addHours(currentDate, 19);
              endDate = addHours(currentDate, 22);
              break;
            default:
              startDate = currentDate;
              endDate = currentDate;
          }

          return {
            title: habit.name,
            start: startDate,
            end: endDate,
            type: habit.type,
          };
        });

        setEvents(formattedEvents); // Actualitza l'estat amb els esdeveniments
        setLoading(false);
      }
    } catch (error) {
      console.error('Error al carregar els hàbits:', error);
      setError('Could not load habits');
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHabits(); // Carregar els hàbits quan el component es monti
  }, []);

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        marginLeft: '200px',
        marginTop: '50px',
      }}
    >
      <div
        style={{
          width: '80%',
          maxWidth: '1200px',
          height: '900px',
        }}
      >
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p>{error}</p>
        ) : (
          <BigCalendar
            localizer={localizer}
            events={events} // Passa els esdeveniments formatats al calendari
            startAccessor="start"
            endAccessor="end"
            style={{ height: '100%' }}
          />
        )}
      </div>
    </div>
  );
};

export default MyCalendar;
