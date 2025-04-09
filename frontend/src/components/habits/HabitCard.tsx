import { Card, Col } from 'react-bootstrap';
import { Calendar, Clock, Activity } from 'lucide-react';
import HabitInterface from '../../types/habit';

// HabitCard which shows each habit on weekly/daily view in DailyInfo
const HabitCard = ({ habit }: { habit: HabitInterface }) => {
  // get color of habit based on type
  const getBgColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'non-negotiable':
        return 'bg-light border-success';
      case 'habit':
        return 'bg-light border-primary';
      default:
        return 'bg-light border-secondary';
    }
  };

  return (
    <Col xs={12} md={6} lg={4} className="mb-4">
      <Card
        className={`shadow-sm h-100 ${getBgColor(habit.type)}`}
        style={{ borderLeft: '4px solid', borderRadius: '8px' }}
      >
        <Card.Body>
          <Card.Title className="fw-bold fs-5 mb-3">{habit.name}</Card.Title>
          <div className="d-flex align-items-center mb-2">
            <Calendar size={16} className="me-2 text-primary" />
            <span className="text-muted">Daytime: {habit.time_day}</span>
          </div>
          <div className="d-flex align-items-center mb-2">
            <Clock size={16} className="me-2 text-info" />
            <span className="text-muted">
              Time: {habit.start_time} - {habit.end_time}
            </span>
          </div>
          <div className="d-flex align-items-center">
            <Activity size={16} className="me-2 text-success" />
            <span
              className={
                habit.type.toLowerCase() === 'non-negotiable'
                  ? 'text-success fw-bold'
                  : 'text-info fw-bold'
              }
            >
              {habit.type}
            </span>
          </div>
        </Card.Body>
      </Card>
    </Col>
  );
};

export default HabitCard;
