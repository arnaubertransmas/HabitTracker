import React, { useEffect, useCallback, useState } from 'react';
import { Modal, Container, Row, Col, Badge } from 'react-bootstrap';
import axiosInstance from '../../config/axiosConfig';

interface Habit {
  name: string;
  type: 'Habit' | 'Non-negotiable';
  frequency: string;
  days: string;
  time_day: string;
  start_time: string;
  end_time: string;
  completed?: boolean;
}

interface DetailHabitProps {
  habitName: string;
  show: boolean;
  handleClose: () => void;
}

const DetailHabit: React.FC<DetailHabitProps> = ({
  habitName,
  show,
  handleClose,
}) => {
  const [habit, setHabit] = useState<Habit | null>(null);

  // get habit data
  const get_habit = useCallback(async () => {
    try {
      const response = await axiosInstance.get(
        `/habit/habit_detail/${habitName}`,
      );
      setHabit(response.data);
    } catch (error) {
      console.error('Error fetching habit details:', error);
    }
  }, [habitName]);

  useEffect(() => {
    if (show) {
      get_habit();
    }
  }, [show, get_habit]);

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
                <Col>{habit.days}</Col>
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
