// components/ShowHabits.tsx
import React from 'react';
import { Button, Container, Row, Col, Table } from 'react-bootstrap';
import Alert from 'react-bootstrap/Alert';
import handleDelete from '../../services/deleteHabit';

interface Habit {
  name: string;
}

interface ShowHabitsProps {
  // props types defined
  habits: Habit[];
  loading: boolean;
  error: string | null;
  handleShowModal: () => void;
  loadHabits: () => Promise<void>;
  habitType: 'habit' | 'non-negotiable';
}

// FC = functinal component
const ShowHabits: React.FC<ShowHabitsProps> = ({
  habits,
  loading,
  error,
  handleShowModal,
  loadHabits,
  habitType,
}) => {
  // uppercase 1st letter of type
  const HabitTypeCap = habitType.charAt(0).toUpperCase() + habitType.slice(1);

  return (
    <Container fluid className="p-3">
      <Row className="mt-5">
        <Col md={6} className="offset-md-1 d-flex justify-content-center p-3">
          <Button
            variant="primary"
            type="button"
            onClick={handleShowModal}
            className="text-nowrap"
            style={{ width: 'auto', minWidth: 'fit-content' }}
          >
            Create {HabitTypeCap}
          </Button>
        </Col>
      </Row>
      <Row className="mt-5">
        <Col md={10} className="offset-md-3 ml-5">
          {loading ? (
            <Alert variant="info">Loading {habitType}...</Alert>
          ) : error ? (
            <Alert variant="danger">{error}</Alert>
          ) : habits.length === 0 ? (
            <Alert variant="success">There are no {habitType} yet</Alert>
          ) : (
            <Table striped bordered hover className="text-center">
              <thead>
                <tr>
                  <th>{HabitTypeCap}</th>
                  <th>Options</th>
                </tr>
              </thead>
              <tbody>
                {/* map through habits and show them in a table */}
                {habits.map((habit, index) => (
                  <tr key={habit.name || index}>
                    <td>{habit.name}</td>
                    <td>
                      <div className="d-flex justify-content-center gap-2">
                        <Button variant="info" size="sm">
                          Detail
                        </Button>
                        <Button variant="warning" size="sm">
                          Edit
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          // call delete functionallity
                          onClick={() => handleDelete(habit.name, loadHabits)}
                        >
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default ShowHabits;
