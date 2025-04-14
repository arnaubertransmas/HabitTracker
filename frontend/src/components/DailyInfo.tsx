import React, { useState, useEffect } from 'react';
import { Card, Container, Nav, ProgressBar, Row, Col } from 'react-bootstrap';
import { Award } from 'lucide-react';
import 'bootstrap/dist/css/bootstrap.min.css';
import HabitCard from './habits/HabitCard';
import useHabits from '../hooks/getHabits_DW';

interface DailyInfoProps {
  streak: number;
}

const DailyInfo: React.FC<DailyInfoProps> = ({ streak }) => {
  const [activeTab, setActiveTab] = useState<string>('daily');

  const today = new Date();
  const dayOfWeek = today.getDay();

  // Use the custom hook for habit data
  const {
    habitsToday,
    habitsWeekly,
    getHabitsDaily,
    getHabitsWeekly,
    loading,
  } = useHabits({ dayOfWeek });

  // Fetch habits on mount
  useEffect(() => {
    getHabitsDaily();
    getHabitsWeekly();
  }, [getHabitsDaily, getHabitsWeekly]);

  const getStreakVariant = (streak: number): string => {
    if (streak >= 10) return 'success';
    if (streak >= 1) return 'info';
    return 'danger';
  };

  // Loading screen
  if (loading) {
    return (
      <Container className="my-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </Container>
    );
  }

  return (
    <Container className="my-4 py-2">
      <Row className="justify-content-center mb-4">
        <Col md={8} lg={6}>
          <Card className="border-0 shadow-sm bg-light">
            <Card.Body className="text-center py-4">
              <div className="d-flex justify-content-center align-items-center mb-2">
                <Award size={32} className="text-warning me-2" />
                <h3 className="fw-bold mb-0">Streak of {streak} days</h3>
              </div>
              <ProgressBar
                now={Math.min(streak, 100)}
                variant={getStreakVariant(streak)}
                animated
                className="mt-3"
                style={{
                  height: '10px',
                  borderRadius: '5px',
                  border: '1px solid #cfcfcf',
                }}
              />
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <div className="d-flex justify-content-center mb-4">
        <Nav variant="pills" className="nav-fill border-0">
          <Nav.Item>
            <Nav.Link
              active={activeTab === 'daily'}
              onClick={() => setActiveTab('daily')}
              className={activeTab === 'daily' ? 'bg-primary' : 'text-primary'}
            >
              Daily Habits
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link
              active={activeTab === 'weekly'}
              onClick={() => setActiveTab('weekly')}
              className={activeTab === 'weekly' ? 'bg-primary' : 'text-primary'}
            >
              Weekly Habits
            </Nav.Link>
          </Nav.Item>
        </Nav>
      </div>

      {/* Active Tab Content */}
      {activeTab === 'daily' && (
        <div className="mt-4">
          <h2 className="text-center fw-bold mb-4">Daily Habits</h2>
          {habitsToday.length === 0 ? (
            <Card className="text-center border-0 shadow-sm">
              <Card.Body className="py-5">
                <h4 className="mb-3">No habits for today!</h4>
                <p className="text-muted">
                  Add habits for today to stay disciplined
                </p>
              </Card.Body>
            </Card>
          ) : (
            <Row className="g-3">
              {habitsToday.map((habit, index) => (
                <HabitCard key={`daily-${index}`} habit={habit} />
              ))}
            </Row>
          )}
        </div>
      )}

      {activeTab === 'weekly' && (
        <div className="mt-4">
          <h2 className="text-center fw-bold mb-4">Weekly Habits</h2>
          {habitsWeekly.length === 0 ? (
            <Card className="text-center border-0 shadow-sm">
              <Card.Body className="py-5">
                <h4 className="mb-3">No habits for this week!</h4>
                <p className="text-muted">Add habits and organize your week</p>
              </Card.Body>
            </Card>
          ) : (
            <Row className="g-3">
              {habitsWeekly.map((habit, index) => (
                <HabitCard key={`weekly-${index}`} habit={habit} />
              ))}
            </Row>
          )}
        </div>
      )}
    </Container>
  );
};

export default DailyInfo;
