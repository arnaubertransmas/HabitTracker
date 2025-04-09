import React, { useState, useEffect, useCallback } from 'react';
import { Container, Row, Col, Spinner, Alert } from 'react-bootstrap';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { getHabits } from '../../services/habitService';
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
  const [selectedDate, setSelectedDate] = useState<string | undefined>(
    undefined,
  );

  const mapFrequencyToDays = (frequency: string, habitDays?: number[]) => {
    // habitDays = arr(Int) w weekday Indexes (0-6)

    // if frequency is daily, return all indexes
    if (frequency.toLowerCase() === 'daily') {
      return [0, 1, 2, 3, 4, 5, 6];
    }

    // return days if user has selected them specifically
    if (habitDays && habitDays.length > 0) {
      return habitDays;
    }

    // if frequency doesn't match any of the above, return empty array
    return [];
  };

  const loadHabits = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getHabits();

      if (!response) {
        setError('Could not load habits');
        return;
      }

      const habits: HabitInterface[] = response;

      const formattedEvents = habits.map((habit) => ({
        title: habit.name,
        startTime: habit.start_time,
        endTime: habit.end_time,
        daysOfWeek: mapFrequencyToDays(habit.frequency, habit.days), // map days
        extendedProps: { type: habit.type || 'Habit' }, // we use this later to assign different classes
      }));

      setEvents(formattedEvents);
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

  // Modal handlers
  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);
  const handleShowDetail = (habitName: string) => {
    setSelectedHabit(habitName);
    setShowDetailModal(true);
  };

  return (
    <Container fluid className="px-lg-5 ms-5">
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
                // pluggins for calendar
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                initialView="dayGridWeek" // main view
                events={events}
                headerToolbar={{
                  left: 'prev,next',
                  center: 'title',
                  right: 'dayGridMonth,dayGridWeek,timeGridDay',
                }}
                eventClassNames={(eventInfo) => {
                  // assign class depending of type
                  return eventInfo.event.extendedProps.type === 'Non-negotiable'
                    ? ['non-negotiable-event']
                    : ['habit-event'];
                }}
                eventContent={(eventInfo) => {
                  return {
                    html: `<span class="event-title">${eventInfo.event.title}</span>`,
                  };
                }}
                dateClick={(info) => {
                  setSelectedDate(info.dateStr); // Saves selected date
                  handleShowModal();
                }}
                eventClick={(info) => {
                  setSelectedDate(info.event.startStr); // pass selected date to event
                  handleShowDetail(info.event.title);
                }}
              />
            </div>
          )}

          <CreateHabit
            show={showModal}
            handleClose={handleCloseModal}
            loadHabits={loadHabits}
            habitToEdit={null}
          />
          {selectedHabit && (
            <DetailHabit
              habitName={selectedHabit}
              show={showDetailModal}
              handleClose={() => setShowDetailModal(false)}
              loadHabits={loadHabits}
              selectedDate={selectedDate}
            />
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default Calendar;
