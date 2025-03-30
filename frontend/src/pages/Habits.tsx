import { useState, useEffect, useCallback } from 'react';
import axiosInstance from '../config/axiosConfig';
import Header from '../components/ui/Header';
import Sidebar from '../components/ui/Sidebar';
import CreateHabit from '../components/habits/CreateHabit';
import ShowHabits from '../components/habits/ShowHabits';
import HabitInterface from '../types/habit';

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
      const response = await axiosInstance.get(
        // pass habit type in request
        `/habit/get_habits?type=${habitType}`,
      );

      if (!response.data.success) {
        setError('Could not load habits');
      }

      const result = response?.data?.habits || [];

      setHabits(result);
      setLoading(false);
    } catch (error) {
      console.log('Error:', error);
      setError('Error ocurred');
      setLoading(false);
    }
  }, [habitType]);

  useEffect(() => {
    loadHabits();
  }, [loadHabits]);

  return (
    <>
      <Header />
      <div className="d-flex">
        <Sidebar />
        <ShowHabits
          habits={habits}
          loading={loading}
          error={error}
          handleShowModal={handleShowModal}
          loadHabits={loadHabits}
          habitType={habitType}
          handleEdit={handleEdit}
        />
      </div>
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
