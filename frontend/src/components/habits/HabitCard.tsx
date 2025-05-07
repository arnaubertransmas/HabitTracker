import React from 'react';
import { Card } from 'react-bootstrap';
import { Calendar, Clock, Activity } from 'lucide-react';
import HabitInterface from '../../types/habit';

// define habit prop representing the whole habit
interface HabitCardProps {
  habit: HabitInterface;
}

// habitCard which shows each habit on weekly/daily view in DailyInfo
const HabitCard: React.FC<HabitCardProps> = ({ habit }) => {
  // get text color based on habit type
  const getTextColor = (type: string): string => {
    switch (type.toLowerCase()) {
      case 'non-negotiable':
        return 'text-success';
      case 'habit':
        return 'text-primary';
      default:
        return 'text-secondary';
    }
  };

  return (
    // return the habitCard itself
    <Card.Body className="d-flex flex-column mb-5">
      <Card.Title className="fw-bold fs-5 mb-3">{habit.name}</Card.Title>
      <div className="d-flex align-items-center mb-2">
        <Calendar size={16} className={`me-2 ${getTextColor(habit.type)}`} />
        <span className="text-muted">Daytime: {habit.time_day}</span>
      </div>
      <div className="d-flex align-items-center mb-2">
        <Clock size={16} className={`me-2 ${getTextColor(habit.type)}`} />
        <span className="text-muted">
          Time: {habit.start_time} - {habit.end_time}
        </span>
      </div>
      <div className="d-flex align-items-center mt-auto">
        <Activity size={16} className={`me-2 ${getTextColor(habit.type)}`} />
        <span className={`fw-bold ${getTextColor(habit.type)}`}>
          {habit.type}
        </span>
      </div>
    </Card.Body>
  );
};

export default HabitCard;
