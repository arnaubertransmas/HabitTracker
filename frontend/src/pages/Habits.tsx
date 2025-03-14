import { useState, useEffect, useCallback } from 'react';
import axiosInstance from '../config/axiosConfig';
import Header from '../components/ui/Header';
import Sidebar from '../components/ui/Sidebar';
import CreateHabit from '../components/habits/CreateHabit';
import ShowHabits from '../components/habits/ShowHabits';

const Habits = () => {
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [showModal, setShowModal] = useState(false);

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const loadHabits = useCallback(async () => {
    // only renders when loadHabits change (useCallback)
    try {
      setLoading(true);
      const response = await axiosInstance.get('/habit/get_habits');
      const result = response?.data?.habits || [];
      setHabits(result);
      setLoading(false);
    } catch (error) {
      console.log('Error:', error);
      setError('Could not load habits');
      setLoading(false);
    }
  }, []);

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
        />
      </div>
      <CreateHabit
        show={showModal}
        handleClose={handleCloseModal}
        onSuccess={loadHabits}
      />
    </>
  );
};

export default Habits;
