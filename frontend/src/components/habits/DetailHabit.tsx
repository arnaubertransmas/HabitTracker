import React, { useEffect, useState } from 'react';
import { Modal, Container, Row, Col, Badge } from 'react-bootstrap';
import { getHabit } from '../../services/habitService';
import HabitInterface from '../../types/habit';

interface DetailHabitProps {
  // habitDetail props
  habitName: string;
  show: boolean;
  handleClose: () => void;
}

const DetailHabit: React.FC<DetailHabitProps> = ({
  habitName,
  show,
  handleClose,
}) => {
  const [habit, setHabit] = useState<HabitInterface | null>(null);

  // convert index to name
  const daysIndToFN = (days: number[]) => {
    const dayNames = [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ];
    // return arr(str) seperated by ","
    return days.map((dayIndex) => dayNames[dayIndex]).join(', ');
  };

  useEffect(() => {
    // get habit data
    const fetchHabit = async () => {
      try {
        if (show) {
          const habitData = await getHabit(habitName);
          setHabit(habitData);
        }
      } catch (error) {
        console.error('Error fetching habit details:', error);
      }
    };
    fetchHabit();
  }, [show, habitName]);

  // badge color based on status
  const habitStatus = (completed?: boolean) => {
    switch (completed) {
      case true:
        return ['Completed', 'success'];
      case false:
        return ['Pending', 'danger'];
      default:
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
          </Container>
        ) : (
          <p>Loading habit details...</p>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default DetailHabit;
