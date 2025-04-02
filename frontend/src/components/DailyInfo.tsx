import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { Container, Row, Col, ProgressBar, ListGroup } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { getHabits } from '../services/habitService';
import HabitInterface from '../types/habit';

interface DailyInfoProps {
  streak: number;
}

const DailyInfo: React.FC<DailyInfoProps> = ({ streak }) => {
  const [habitsToday, setHabitsToday] = useState<HabitInterface[]>([]);
  const [habitsWeekly, setHabitsWeekly] = useState<HabitInterface[]>([]);

  const today = new Date();
  // Returns day in index (0-6)
  const dayOfWeek = today.getDay();

  // Re-render only if weekday changes
  const weekDays = useMemo(() => {
    const days = [];
    for (let i = 0; i < 7; i++) {
      // Circular week logic (0-6), never bigger than 6
      days.push((dayOfWeek + i) % 7);
    }
    return days;
  }, [dayOfWeek]);

  const getHabitsOfToday = useCallback(async () => {
    try {
      const habits = await getHabits();

      // Filter habits for the current day
      const filteredHabitsToday = habits.filter((habit: HabitInterface) => {
        // Filter habits based on today's day
        return habit.days.includes(dayOfWeek);
      });
      setHabitsToday(filteredHabitsToday);

      // Filter habits for the entire week
      const filteredHabitsWeekly = habits.filter((habit: HabitInterface) => {
        // Check if habit is in any of the current week's days
        return habit.days.some((day) => weekDays.includes(day));
      });
      setHabitsWeekly(filteredHabitsWeekly);
    } catch (err) {
      console.log(err);
    }
  }, [dayOfWeek, weekDays]);

  useEffect(() => {
    getHabitsOfToday();
  }, [weekDays, getHabitsOfToday]);

  const getStreakVariant = (streak: number): string => {
    if (streak >= 30) return 'success';
    if (streak >= 15) return 'warning';
    return 'danger';
  };

  return (
    <Container className="my-5">
      <Row className="justify-content-center">
        <Col md={6} className="p-4 bg-light shadow rounded mb-5 text-center">
          <h3>🔥 Streak of {streak} days</h3>
          <ProgressBar
            now={streak * 10}
            variant={getStreakVariant(streak)}
            animated
          />
        </Col>
      </Row>

      <Row className="align-items-center mt-4 ms-5">
        <Col md={5} className="d-flex flex-column align-items-center">
          <h2 className="fw-bold">Daily Remaining</h2>

          <ListGroup className="w-500">
            {habitsToday.length === 0 ? (
              <ListGroup.Item>No habits for today!</ListGroup.Item>
            ) : (
              habitsToday.map((habit, index) => (
                <ListGroup.Item key={index} className="mt-3">
                  <h5>{habit.name}</h5>
                  <p>Start Time: {habit.start_time}</p>
                  <p>End Time: {habit.end_time}</p>
                  <p>Type: {habit.type}</p>
                </ListGroup.Item>
              ))
            )}
          </ListGroup>
        </Col>

        <Col md={7} className="d-flex flex-column align-items-center">
          <h2 className="fw-bold">Weekly Remaining</h2>

          <ListGroup className="w-500">
            {habitsWeekly.length === 0 ? (
              <ListGroup.Item>No habits for this week!</ListGroup.Item>
            ) : (
              habitsWeekly.map((habit, index) => (
                <ListGroup.Item key={index} className="mt-3">
                  <h5>{habit.name}</h5>
                  <p>Start Time: {habit.start_time}</p>
                  <p>End Time: {habit.end_time}</p>
                  <p>Type: {habit.type}</p>
                </ListGroup.Item>
              ))
            )}
          </ListGroup>
        </Col>
      </Row>
    </Container>
  );
};

export default DailyInfo;
