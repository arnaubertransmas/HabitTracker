import React, { useState, useEffect } from 'react';
import {
  Card,
  Container,
  Nav,
  ProgressBar,
  Row,
  Col,
  Badge,
} from 'react-bootstrap';
import { Award, CheckCircle, Calendar, Activity } from 'lucide-react';
import 'bootstrap/dist/css/bootstrap.min.css';
import HabitCard from './habits/HabitCard';
import useHabits from '../hooks/habits/getHabits_DW';
import '../assets/css/dailyInfoComp.css';

interface DailyInfoProps {
  streak: number;
}

const DailyInfo: React.FC<DailyInfoProps> = ({ streak }) => {
  const [activeTab, setActiveTab] = useState<string>('daily');

  const today = new Date();
  const dayOfWeek = today.getDay();
  // format day of today
  const formattedDate = today.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  // custom hook for habit data
  const {
    habitsToday,
    completedToday,
    completedWeekly,
    habitsWeekly,
    loading,
    fetchHabits,
  } = useHabits({ dayOfWeek });

  // Fetch habits on mount
  useEffect(() => {
    // returns getHabitsDaily and Weekly
    fetchHabits();
  }, [fetchHabits]);

  const getStreakVariant = (streak: number): string => {
    // get streak color depending on days
    if (streak >= 20) return 'success';
    if (streak >= 10) return 'info';
    if (streak >= 1) return 'primary';
    return 'danger';
  };

  // Loading screen
  if (loading) {
    return (
      <Container className="my-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3 text-muted">Loading your habits...</p>
      </Container>
    );
  }

  return (
    <>
      <Container fluid className="bg-pattern py-5">
        <Container>
          {/* date + streak Header */}
          <Row className="justify-content-center mb-4">
            <Col xs={12} md={10}>
              <div className="text-center page-header">
                <h2 className="fw-bold text-dark mb-2">{formattedDate}</h2>
                <p className="text-muted">
                  Track your progress and build consistent habits
                </p>
              </div>
            </Col>
          </Row>

          {/* streak card */}
          <Row className="justify-content-center mb-5">
            <Col xs={12} md={10} lg={8}>
              <Card className="streak-card bg-white">
                <Card.Body className="text-center py-4">
                  <div className="d-flex justify-content-center align-items-center mb-4">
                    <Award
                      size={56}
                      className="text-warning me-3"
                      strokeWidth={1.5}
                    />
                    <div className="text-start">
                      <div className="d-flex align-items-baseline">
                        <span className="streak-count">{streak}</span>
                        <span className="streak-label">day streak</span>
                      </div>
                      <p className="text-muted mb-0 mt-1">
                        {/* show a different message depending on streak days */}
                        {streak === 0
                          ? 'Start your streak today!'
                          : `You've been consistent for ${streak} day${streak !== 1 ? 's' : ''}!`}
                      </p>
                    </div>
                  </div>
                  <ProgressBar
                    now={Math.min(streak, 100)}
                    variant={getStreakVariant(streak)}
                    animated
                    className="streak-progress"
                  />
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* habits resume section */}
          <Row className="justify-content-center mb-5">
            <Col xs={12} md={8} lg={6}>
              <Nav variant="pills" className="nav-fill border-0 shadow-sm">
                <Nav.Item className="mx-1">
                  <Nav.Link
                    active={activeTab === 'daily'}
                    onClick={() => setActiveTab('daily')}
                    className={`${activeTab === 'daily' ? 'bg-primary' : 'text-primary'}`}
                  >
                    <CheckCircle size={18} className="me-2" />
                    Daily Habits
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item className="mx-1">
                  <Nav.Link
                    active={activeTab === 'weekly'}
                    onClick={() => setActiveTab('weekly')}
                    className={`${activeTab === 'weekly' ? 'bg-info text-white' : 'text-info'}`}
                  >
                    <Calendar size={18} className="me-2" />
                    Weekly Habits
                  </Nav.Link>
                </Nav.Item>
              </Nav>
            </Col>
          </Row>

          {/* daily tab */}
          {activeTab === 'daily' && (
            <div className="mt-4">
              <div className="habit-section-header px-3">
                <h3 className="fw-bold text-primary">
                  <CheckCircle size={24} className="me-2" />
                  Daily Habits
                </h3>
                <Badge bg="primary" pill className="px-3 py-2">
                  {completedToday.length}/{habitsToday.length} Completed
                </Badge>
              </div>

              {habitsToday.length === 0 ? (
                <Row className="justify-content-center">
                  <Col xs={12} md={10} lg={8}>
                    <Card className="text-center border-0 shadow-sm bg-white">
                      <Card.Body className="py-5">
                        <Activity
                          size={56}
                          className="text-muted mb-3"
                          strokeWidth={1}
                        />
                        <h4 className="mb-3">No habits for today!</h4>
                        <p className="text-muted mb-4">
                          Add habits for today to stay disciplined and build
                          your streak
                        </p>
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>
              ) : (
                <Row>
                  {habitsToday.map((habit, index) => (
                    <Col
                      xs={12}
                      sm={12}
                      md={6}
                      lg={4}
                      key={`daily-${index}`}
                      className="mb-4"
                    >
                      <Card className="border-0 shadow-sm habit-card h-100">
                        <HabitCard habit={habit} />
                      </Card>
                    </Col>
                  ))}
                </Row>
              )}
            </div>
          )}

          {/* weekly tab */}
          {activeTab === 'weekly' && (
            <div className="mt-4">
              <div className="habit-section-header px-3">
                <h3 className="fw-bold text-info">
                  <Calendar size={24} className="me-2" />
                  Weekly Habits
                </h3>
                <Badge bg="info" pill className="px-3 py-2">
                  {completedWeekly.length}/{habitsWeekly.length} Completed
                </Badge>
              </div>

              {habitsWeekly.length === 0 ? (
                <Row className="justify-content-center">
                  <Col xs={12} md={10} lg={8}>
                    <Card className="text-center border-0 shadow-sm bg-white">
                      <Card.Body className="py-5">
                        <Calendar
                          size={56}
                          className="text-muted mb-3"
                          strokeWidth={1}
                        />
                        <h4 className="mb-3">No habits for this week!</h4>
                        <p className="text-muted mb-4">
                          Add weekly habits to organize your schedule and track
                          your progress
                        </p>
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>
              ) : (
                <Row>
                  {habitsWeekly.map((habit, index) => (
                    <Col
                      xs={12}
                      sm={12}
                      md={6}
                      lg={4}
                      key={`weekly-${index}`}
                      className="mb-4"
                    >
                      <Card className="border-0 shadow-sm habit-card h-100">
                        <HabitCard habit={habit} />
                      </Card>
                    </Col>
                  ))}
                </Row>
              )}
            </div>
          )}
        </Container>
      </Container>
    </>
  );
};

export default DailyInfo;
