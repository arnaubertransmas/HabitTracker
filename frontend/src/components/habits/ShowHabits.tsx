import React, { useState, useMemo } from 'react';
import { Button, Container, Row, Col, Table, Spinner } from 'react-bootstrap';
import Alert from 'react-bootstrap/Alert';
import { deleteHabit } from '../../services/habitService';
import DetailHabit from './DetailHabit';
import HabitInterface from '../../types/habit';
import '../../assets/css/spinner.css';
import '../../assets/css/showHabits.css';
import { Info, Pencil, Trash2, Search } from 'lucide-react';
import { Form, InputGroup, Badge, Card } from 'react-bootstrap';

// interface for the comp
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
  const [searchTerm, setSearchTerm] = useState('');

  // filter habits based on search term
  const filteredHabits = useMemo(() => {
    return habits.filter((habit) =>
      habit.name.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [habits, searchTerm]);

  // memoized habits list to prevent unnecessary re-renders
  const habitList = useMemo(() => {
    // handler for showing detail modal
    const handleShowDetail = (habit: HabitInterface) => {
      setSelectedHabit(habit);
      setShowDetailModal(true);
    };
    return filteredHabits.map((habit, index) => (
      <tr key={habit.name || index} className="align-middle">
        <td className="habit-name">
          <div className="d-flex align-items-center justify-content-center">
            <span className="fw-medium">{habit.name}</span>
          </div>
        </td>
        <td className="options-column">
          <div className="d-flex flex-wrap justify-content-center gap-2">
            <Button
              variant="outline-info"
              size="sm"
              onClick={() => handleShowDetail(habit)}
              className="btn-icon"
              title="View Details"
            >
              <Info size={18} />
            </Button>
            <Button
              variant="outline-warning"
              size="sm"
              onClick={() => handleEdit(habit)}
              className="btn-icon"
              title="Edit Habit"
            >
              <Pencil size={18} />
            </Button>
            <Button
              variant="outline-danger"
              size="sm"
              onClick={() => {
                if (
                  window.confirm(
                    `Are you sure you want to delete "${habit.name}"?`,
                  )
                ) {
                  deleteHabit(habit.name, loadHabits);
                }
              }}
              className="btn-icon"
              title="Delete Habit"
            >
              <Trash2 size={18} />
            </Button>
          </div>
        </td>
      </tr>
    ));
  }, [filteredHabits, handleEdit, loadHabits]);

  // memoized table
  const habitsTable = useMemo(() => {
    if (loading) {
      return (
        <div className="spinner-container">
          <Spinner animation="border" role="status" />
          <p className="mt-2 text-muted">
            Loading your {habitType.toLowerCase()}s...
          </p>
        </div>
      );
    }

    if (error) {
      return <Alert variant="danger">{error}</Alert>;
    }

    if (habits.length === 0) {
      return (
        <Card
          className="text-center p-4 border-light"
          style={{ backgroundColor: '#e6f2ff' }}
        >
          <Card.Body>
            <div className="mb-3"></div>
            <Card.Title>No {habitType}s Yet</Card.Title>
            <Card.Text className="text-muted">
              Start creating your {habitType.toLowerCase()}s to track your
              progress
            </Card.Text>
          </Card.Body>
        </Card>
      );
    }

    // search result == 0
    if (filteredHabits.length === 0) {
      return (
        <Alert variant="info" className="text-center">
          No {habitType.toLowerCase()}s match your search term "{searchTerm}"
        </Alert>
      );
    }

    return (
      <div className="table-responsive mt-3">
        <Table
          hover
          bordered
          className="text-center mx-auto align-middle mb-5 table-fixed"
          style={{ width: '100%', backgroundColor: '#e6f2ff' }}
        >
          <thead className="bg-light">
            <tr>
              <th style={{ width: '70%' }}>
                {habitType}{' '}
                <Badge bg={habitType === 'Habit' ? 'info' : 'warning'} pill>
                  {filteredHabits.length}
                </Badge>
              </th>
              <th style={{ width: '30%' }}>Options</th>
            </tr>
          </thead>
          <tbody>{habitList}</tbody>
        </Table>
      </div>
    );
  }, [
    loading,
    error,
    habits,
    habitType,
    habitList,
    filteredHabits,
    searchTerm,
  ]);

  return (
    <>
      <Container fluid className="main">
        <Row className="mt-3 mt-md-4">
          <Col xs={12} md={8} lg={7} className="px-2 px-md-3 mx-auto">
            <div className="mt-3 mt-md-5">
              <h4 className="mb-5 text-center">
                <span className="text-primary fw-bold">My {habitType}s </span>
                <Badge bg={habitType === 'Habit' ? 'info' : 'warning'} pill>
                  {habits.length}
                </Badge>
              </h4>
              <div className="d-flex align-items-center gap-3 mt-4 flex-column flex-md-row px-0 px-md-4">
                <Button
                  variant="primary"
                  type="button"
                  onClick={handleShowModal}
                  className="create-button"
                >
                  Create {habitType}
                </Button>
                <InputGroup className="search-bar w-100">
                  <InputGroup.Text className="bg-white border-end-0">
                    <Search size={18} />
                  </InputGroup.Text>
                  <Form.Control
                    placeholder={`Search ${habitType}s...`}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="border-start-0"
                  />
                </InputGroup>
              </div>
            </div>
          </Col>
        </Row>
        <Row className="mt-3 mt-md-4">
          <Col xs={12} sm={12} md={10} lg={8} className="mx-auto px-2 px-md-3">
            {/* show habits table */}
            {habitsTable}
          </Col>
        </Row>
      </Container>

      {/* detail modal */}
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
