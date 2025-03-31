import React, { useState, useMemo } from 'react';
import { Button, Container, Row, Col, Table, Spinner } from 'react-bootstrap';
import Alert from 'react-bootstrap/Alert';
import { deleteHabit } from '../../services/habitService';
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
  handleEdit: (habit: HabitInterface) => void;
}

const ShowHabits: React.FC<ShowHabitsProps> = ({
  habits,
  loading,
  error,
  handleShowModal,
  loadHabits,
  habitType,
  handleEdit,
}) => {
  // state for managing modals
  const [selectedHabit, setSelectedHabit] = useState<HabitInterface | null>(
    null,
  );
  const [showDetailModal, setShowDetailModal] = useState(false);

  // Memoized habits list to prevent unnecessary re-renders
  const habitList = useMemo(() => {
    // Handler for showing detail modal
    const handleShowDetail = (habit: HabitInterface) => {
      setSelectedHabit(habit);
      setShowDetailModal(true);
    };
    return habits.map((habit, index) => (
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
            <Button
              variant="warning"
              size="sm"
              onClick={() => handleEdit(habit)}
            >
              Edit
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={() => deleteHabit(habit.name, loadHabits)}
            >
              Delete
            </Button>
          </div>
        </td>
      </tr>
    ));
  }, [habits, handleEdit, loadHabits]);

  // Memoized table component to prevent unnecessary re-renders
  const habitsTable = useMemo(() => {
    if (loading) {
      return (
        <div className="spinner-container">
          <Spinner animation="border" role="status" />
        </div>
      );
    }

    if (error) {
      return <Alert variant="danger">{error}</Alert>;
    }

    if (habits.length === 0) {
      return <Alert variant="success">There are no {habitType} yet</Alert>;
    }

    return (
      <Table striped bordered hover className="text-center">
        <thead>
          <tr>
            <th>{habitType}</th>
            <th>Options</th>
          </tr>
        </thead>
        <tbody>{habitList}</tbody>
      </Table>
    );
  }, [loading, error, habits, habitType, habitList]);

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
            {habitsTable}
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
