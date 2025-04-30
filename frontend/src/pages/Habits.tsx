import { useState, useEffect, useCallback } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import Header from '../components/ui/Header';
import Sidebar from '../components/ui/Sidebar';
import CreateHabit from '../components/habits/CreateHabit';
import ShowHabits from '../components/habits/ShowHabits';
import HabitInterface from '../types/habit';
import { getHabits } from '../services/habitService';

const Habits = ({ habitType }: { habitType: 'Habit' | 'Non-negotiable' }) => {
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [showModal, setShowModal] = useState(false);
  const [habitToEdit, setHabitToEdit] = useState<HabitInterface | null>(null);

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => {
    setHabitToEdit(null);
    setShowModal(false);
  };

  const handleEdit = (habit: HabitInterface) => {
    setHabitToEdit(habit);
    setShowModal(true);
  };

  const loadHabits = useCallback(async () => {
    try {
      setLoading(true);
      // get habits and put it into state
      const response = await getHabits(habitType);
      setHabits(response);
      setLoading(false);
    } catch (error) {
      setError('Error occurred');
      setLoading(false);
    }
  }, [habitType]);

  useEffect(() => {
    loadHabits();
  }, [loadHabits]);

  return (
    <>
      <Header />
      <Container fluid className="mt-3">
        <Row>
          {/* sidebar controlled*/}
          <Col xs={12} lg={3} className="mb-4 mb-lg-0">
            <Sidebar />
          </Col>

          <Col xs={12}>
            <ShowHabits
              habits={habits}
              loading={loading}
              error={error}
              handleShowModal={handleShowModal}
              loadHabits={loadHabits}
              habitType={habitType}
              handleEdit={handleEdit}
            />
          </Col>
        </Row>
      </Container>

      <CreateHabit
        show={showModal}
        handleClose={handleCloseModal}
        defaultType={habitType}
        loadHabits={loadHabits}
        habitToEdit={habitToEdit}
      />
    </>
  );
};

export default Habits;
