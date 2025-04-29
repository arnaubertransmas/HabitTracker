import React, { useEffect, useState } from 'react';
import { Modal, Container, Row, Col, Badge, Button } from 'react-bootstrap';
import { deleteHabit, getHabit } from '../../services/habitService';
import { getUser, updateStreak } from '../../services/authService';
import HabitInterface from '../../types/habit';
import { useHabitCompletion } from '../../hooks/habits/completeHabit';
import Notes from '../Notes';

interface DetailHabitProps {
  habitName: string;
  show: boolean;
  handleClose: () => void;
  loadHabits: () => Promise<void>;
  selectedDate?: string;
  fromCalendar: boolean;
}

const DetailHabit: React.FC<DetailHabitProps> = ({
  habitName,
  show,
  handleClose,
  loadHabits,
  selectedDate,
  fromCalendar,
}) => {
  const [habit, setHabit] = useState<HabitInterface | null>(null);

  // custom hook
  const {
    error,
    isLoading,
    isHabitCompleted,
    handleCompleteHabit,
    daysIndicesToFullNames,
    validateDateForCompletion,
  } = useHabitCompletion(loadHabits);

  // ensure its always a string type
  const validatedSelectedDate = selectedDate || new Date().toISOString();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isValid, validationError] = validateDateForCompletion(
    validatedSelectedDate,
  );

  useEffect(() => {
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

    if (show) {
      fetchHabit();
    }
  }, [show, habitName, selectedDate]);

  return (
    <Modal show={show} onHide={handleClose} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>
          {habit ? (
            <>
              {habit.name} Details |
              <Badge
                bg={isHabitCompleted(habit, validatedSelectedDate)[1]}
                className="ms-2"
              >
                {isHabitCompleted(habit, validatedSelectedDate)[0]}
              </Badge>
            </>
          ) : (
            'Loading...'
          )}
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {isLoading ? (
          <p>Loading...</p>
        ) : habit ? (
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
                <Col>
                  {habit.days ? daysIndicesToFullNames(habit.days) : '-'}
                </Col>
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
              <Col>
                <Notes habitName={habitName} />
              </Col>
            </Row>

            <Row className="mb-3">
              <Col>
                {fromCalendar &&
                  // if habit not complete, show CompleteButton
                  !isHabitCompleted(habit, validatedSelectedDate)[2] && (
                    <Button
                      variant="success"
                      style={{ color: 'white', marginRight: '5px' }}
                      onClick={async () => {
                        try {
                          // call out to handleCompleteHabit
                          const completeHabit = await handleCompleteHabit(
                            habit.name,
                            validatedSelectedDate,
                            habit,
                            setHabit,
                            handleClose,
                          );
                          // update streak
                          if (completeHabit) {
                            const updated = await updateStreak(
                              validatedSelectedDate,
                              loadHabits,
                            );
                            // once updated, update streak in localStorage
                            if (updated) {
                              const user = await getUser();
                              const newStreak = user.streak?.length || 0;
                              localStorage.setItem(
                                'userStreak',
                                newStreak.toString(), // format to string and upload it to localStorage
                              );
                            }
                          }
                        } catch (error) {
                          console.error(
                            'Error during habit completion:',
                            error,
                          );
                        }
                      }}
                      disabled={!isValid}
                    >
                      {isLoading ? 'Completing...' : 'Complete'}
                    </Button>
                  )}

                <Button
                  variant="danger"
                  style={{ color: 'white' }}
                  onClick={async () => {
                    await deleteHabit(habit.name, loadHabits);
                    handleClose();
                  }}
                >
                  Delete
                </Button>
                {error && (
                  <div className="alert alert-danger mt-3">{error}</div>
                )}
              </Col>
            </Row>
          </Container>
        ) : (
          <p>No habit details available.</p>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default DetailHabit;
