import React, { useState } from 'react';
import { Button, Container, Row, Col, Table, Spinner } from 'react-bootstrap';
import Alert from 'react-bootstrap/Alert';
import handleDelete from '../../services/deleteHabit';
import DetailHabit from './DetailHabit';
import HabitInterface from '../../types/habit';
import '../../assets/css/spinner.css';

interface ShowHabitsProps {
  habits: HabitInterface[];
  loading: boolean;
  error: string | null;
  handleShowModal: () => void;
  loadHabits: () => Promise<void>;
  habitType: 'Habit' | 'Non-negotiable';
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
  // state for managing modals
  const [selectedHabit, setSelectedHabit] = useState<HabitInterface | null>(
    null,
  );
  const [showDetailModal, setShowDetailModal] = useState(false);

  // Handler for showing detail modal
  const handleShowDetail = (habit: HabitInterface) => {
    setSelectedHabit(habit);
    setShowDetailModal(true);
  };

  return (
    <>
      <Container fluid className="p-3">
        <Row className="mt-5">
          <Col md={6} className="offset-md-0 d-flex justify-content-center p-3">
            <Button
              variant="primary"
              type="button"
              onClick={handleShowModal}
              className="text-nowrap"
              style={{ width: 'auto', minWidth: 'fit-content' }}
            >
              Create {habitType}
            </Button>
          </Col>
        </Row>
        <Row className="mt-5">
          <Col md={10} className="offset-md-2 ml-5">
            {loading ? (
              <div className="spinner-container">
                <Spinner animation="border" role="status" />
              </div>
            ) : error ? (
              <Alert variant="danger">{error}</Alert>
            ) : habits.length === 0 ? (
              <Alert variant="success">There are no {habitType} yet</Alert>
            ) : (
              <Table striped bordered hover className="text-center">
                <thead>
                  <tr>
                    <th>{habitType}</th>
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
                          <Button
                            variant="info"
                            size="sm"
                            onClick={() => handleShowDetail(habit)}
                          >
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

      {/* detail modal  */}
      {selectedHabit && (
        <DetailHabit
          habitName={selectedHabit?.name}
          show={showDetailModal}
          handleClose={() => setShowDetailModal(false)}
        />
      )}
    </>
  );
};

export default ShowHabits;
