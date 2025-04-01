import React, { useEffect, useState } from 'react';
import { Modal, Container, Row, Col, Badge } from 'react-bootstrap';
import {
  completeHabit,
  deleteHabit,
  getHabit,
} from '../../services/habitService';
import HabitInterface from '../../types/habit';
import { Button } from 'react-bootstrap';

interface DetailHabitProps {
  // habitDetail props
  habitName: string;
  show: boolean;
  handleClose: () => void;
  loadHabits: () => Promise<void>;
}

const DetailHabit: React.FC<DetailHabitProps> = ({
  habitName,
  show,
  handleClose,
  loadHabits,
}) => {
  const [habit, setHabit] = useState<HabitInterface | null>(null);
  const [complete, setComplete] = useState<boolean>(false);

  // convert index to name
  const daysIndToFN = (days: number[] | undefined) => {
    if (!days || days.length === 0) return 'No days set'; // Handle undefined or empty

    // if its doublewrapped, grab the one from inside
    const flatDays = Array.isArray(days[0]) ? days[0] : days;

    const dayNames = [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ];
    return flatDays
      .map((dayIndex) => dayNames[dayIndex] || 'Invalid day')
      .join(', ');
  };

  const handleComplete = async (habitName: string) => {
    try {
      if (habit) {
        // Call the API to mark the habit as complete
        const success = await completeHabit(habit.name, loadHabits);

        if (success) {
          // Fetch the latest habit data from the server to ensure we have the most up-to-date information
          const updatedHabitData = await getHabit(habitName);

          // Update the local state with the latest data
          setHabit(updatedHabitData);

          // Set complete to true to hide the Complete button
          setComplete(true);
        }
      }
    } catch (error) {
      console.error('Error marking habit as complete:', error);
    }
  };

  const isCompletedToday = (habit: HabitInterface | null) => {
    if (!habit || !habit.completed) return false;

    const today = new Date().toISOString().split('T')[0]; // Get YYYY-MM-DD format
    return habit.completed.includes(today);
  };

  useEffect(() => {
    // get habit data
    const fetchHabit = async () => {
      try {
        if (show) {
          const habitData = await getHabit(habitName);
          setHabit(habitData);
          setComplete(isCompletedToday(habitData));
        }
      } catch (error) {
        console.error('Error fetching habit details:', error);
      }
    };
    fetchHabit();
  }, [show, habitName]);

  // badge color based on status
  const habitStatus = (completed?: string[]) => {
    if (completed && completed.length > 0) {
      return ['Completed', 'success'];
    } else if (completed && completed.length === 0) {
      return ['Pending', 'danger'];
    } else {
      return ['-', 'secondary'];
    }
  };

  return (
    <Modal show={show} onHide={handleClose} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>
          {habit ? (
            <>
              {habit.name} Details |
              <Badge bg={habitStatus(habit.completed)[1]} className="ms-2">
                {habitStatus(habit.completed)[0]}
              </Badge>
            </>
          ) : (
            'Loading...'
          )}
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {habit ? ( // render if there's a habit
          <Container>
            <Row className="mb-3">
              <Col md={4} className="fw-bold">
                Name:
              </Col>
              <Col>{habit.name}</Col>
            </Row>

            <Row className="mb-3">
              <Col md={4} className="fw-bold">
                Type:
              </Col>
              <Col>{habit.type}</Col>
            </Row>

            {habit.frequency && (
              <Row className="mb-3">
                <Col md={4} className="fw-bold">
                  Frequency:
                </Col>
                <Col>{habit.days ? daysIndToFN(habit.days) : '-'}</Col>
              </Row>
            )}

            {habit.time_day && (
              <Row className="mb-3">
                <Col md={4} className="fw-bold">
                  Time:
                </Col>
                <Col>
                  {habit.time_day} {habit.start_time} - {habit.end_time}
                </Col>
              </Row>
            )}
            <Row className="mb-3">
              <Col md={4} className="fw-bold">
                {!complete && (
                  <Button
                    variant="success"
                    style={{ color: 'white', marginRight: '5px' }}
                    onClick={async () => {
                      await handleComplete(habit.name);
                      handleClose();
                    }}
                  >
                    Complete
                  </Button>
                )}
                <Button
                  variant="danger"
                  style={{ color: 'white' }}
                  onClick={async () => {
                    await deleteHabit(habit.name, loadHabits);
                    handleClose(); // close modal after deleting
                  }}
                >
                  Delete
                </Button>
              </Col>
            </Row>
          </Container>
        ) : (
          <p>Loading habit details...</p>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default DetailHabit;
