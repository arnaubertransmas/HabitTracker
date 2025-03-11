import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import Header from '../components/ui/Header';
import Sidebar from '../components/ui/Sidebar';
import CreateHabit from '../components/habits/CreateHabit';
import ShowHabits from '../components/habits/ShowHabits';

const Habits = () => {
  const apiUrl = process.env.REACT_APP_API_URL;
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const loadHabits = useCallback(async () => {
    try {
      setLoading(true);
      const accessToken = Cookies.get('cookie_access_token');
      const response = await axios.get(`${apiUrl}/habit/get_habits`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      });
      const result = response?.data?.habits || [];
      setHabits(result);
      setLoading(false);
    } catch (error) {
      console.log('Error:', error);
      setError('Could not load habits');
      setLoading(false);
    }
  }, [apiUrl]);

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
