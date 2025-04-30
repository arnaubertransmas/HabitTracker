import React, { useState, useMemo } from 'react';
import { Button, Container, Row, Col, Table, Spinner } from 'react-bootstrap';
import Alert from 'react-bootstrap/Alert';
import { deleteHabit } from '../../services/habitService';
import DetailHabit from './DetailHabit';
import HabitInterface from '../../types/habit';
import '../../assets/css/spinner.css';
import { Info, Pencil, Trash2 } from 'lucide-react';

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
          <div className="d-flex flex-wrap justify-content-center gap-2">
            <Button
              variant="info"
              size="sm"
              onClick={() => handleShowDetail(habit)}
              className="btn-responsive"
            >
              <Info size={18} />
            </Button>
            <Button
              variant="warning"
              size="sm"
              onClick={() => handleEdit(habit)}
              className="btn-responsive"
            >
              <Pencil size={18} />
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={() => deleteHabit(habit.name, loadHabits)}
              className="btn-responsive"
            >
              <Trash2 size={18} />
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
      <div className="table-responsive">
        <Table
          striped
          bordered
          hover
          className="text-center mx-auto"
          style={{ maxWidth: '100%' }}
        >
          <thead>
            <tr>
              <th>{habitType}</th>
              <th>Options</th>
            </tr>
          </thead>
          <tbody>{habitList}</tbody>
        </Table>
      </div>
    );
  }, [loading, error, habits, habitType, habitList]);

  return (
    <>
      <Container fluid>
        <Row className="mt-3 mt-md-4">
          <Col xs={7} className="d-flex justify-content-center px-2 px-m-3">
            <Button
              variant="primary"
              type="button"
              onClick={handleShowModal}
              className="text-nowrap mt-5"
            >
              Create {habitType}
            </Button>
          </Col>
        </Row>
        <Row className="mt-3 mt-md-4 ms-5">
          <Col xs={12} sm={12} md={8} lg={8} className="mx-auto">
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
          loadHabits={loadHabits}
          fromCalendar={false}
        />
      )}
    </>
  );
};

export default ShowHabits;
