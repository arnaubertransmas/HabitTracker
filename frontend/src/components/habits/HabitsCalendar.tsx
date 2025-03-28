import React, { useState, useEffect, useCallback } from 'react';
import { Container, Row, Col, Spinner, Alert } from 'react-bootstrap';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import axiosInstance from '../../config/axiosConfig';
import CreateHabit from './CreateHabit';
import DetailHabit from './DetailHabit';
import HabitInterface from '../../types/habit';
import '../../assets/css/calendar.css';
import '../../assets/css/spinner.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const Calendar: React.FC = () => {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [showModal, setShowModal] = useState(false);
  const [selectedHabit, setSelectedHabit] = useState<string | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const loadHabits = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/habit/get_habits');

      if (response.data.success) {
        const habits: HabitInterface[] = response.data.habits;

        // transform habits to events
        const formattedEvents = habits.map((habit) => {
          return {
            title: habit.name,
            daysOfWeek: habit.days,
            allDay: false,
            extendedProps: {
              type: habit.type || 'Habit',
              frequency: habit.frequency,
            },
          };
        });

        // save state of habits as events
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

  // modal create habit + detail
  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);
  const handleShowDetail = (habitName: string) => {
    setSelectedHabit(habitName);
    setShowDetailModal(true);
  };

  return (
    <Container fluid className="px-lg-5">
      <Row>
        <Col xs={12}>
          {loading ? (
            <div className="spinner-container">
              <Spinner animation="border" role="status" />
            </div>
          ) : error ? (
            <Alert variant="danger">{error}</Alert>
          ) : (
            <div className="calendar-wrapper">
              <FullCalendar
                // plugins for fullCalendar
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                initialView={'dayGridMonth'}
                height="auto"
                headerToolbar={{
                  left: 'prev,next',
                  center: 'title',
                  right: 'dayGridMonth,dayGridWeek,timeGridDay',
                }}
                views={{
                  // calendar views
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
                  // assign css classes to calendar days
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
                // show only events at the calendar
                events={events}
                eventClassNames={(eventInfo) => {
                  // differiencete from diff types
                  return eventInfo.event.extendedProps.type === 'Non-negotiable'
                    ? ['non-negotiable-event']
                    : ['habit-event'];
                }}
                // text shown at event card
                eventContent={(eventInfo) => {
                  return {
                    html: ` <span class="event-title">${eventInfo.event.title}</span> `,
                  };
                }}
                dateClick={() => {
                  handleShowModal();
                }}
                eventClick={(info) => {
                  handleShowDetail(info.event.title);
                }}
              />
            </div>
          )}

          {/* Create + Detail habit props */}
          <CreateHabit
            show={showModal}
            handleClose={handleCloseModal}
            loadHabits={loadHabits}
          />
          {selectedHabit && (
            <DetailHabit
              habitName={selectedHabit}
              show={showDetailModal}
              handleClose={() => setShowDetailModal(false)}
            />
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default Calendar;
