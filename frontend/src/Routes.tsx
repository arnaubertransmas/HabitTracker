import { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Route, Routes, BrowserRouter } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Error from './pages/Error';
import AboutUs from './pages/AboutUs';
import Habits from './pages/Habits';
import CreateHabit from './components/habits/CreateHabit';
import Schedule from './pages/Schedule';

const AppRoutes = () => {
  const [showModal, setShowModal] = useState(false);

  // const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/signin" element={<Login />} />
        <Route path="/signup" element={<Register />} />
        <Route path="/about_us" element={<AboutUs />} />

        {/* Protected routes */}
        <Route
          path="/user"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user/:username"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/habits"
          element={
            <ProtectedRoute>
              <Habits habitType="Habit" />
            </ProtectedRoute>
          }
        />
        <Route
          path="/habits/:create_habit"
          element={
            <ProtectedRoute>
              <CreateHabit
                show={showModal}
                handleClose={handleCloseModal}
                defaultType="Habit"
                loadHabits={async () => {}}
                habitToEdit={null}
              />
            </ProtectedRoute>
          }
        />
        <Route
          path="/non-negotiables"
          element={
            <ProtectedRoute>
              <Habits habitType="Non-negotiable" />
            </ProtectedRoute>
          }
        />
        <Route
          path="/non-negotiables/:create_habit"
          element={
            <ProtectedRoute>
              <CreateHabit
                show={showModal}
                handleClose={handleCloseModal}
                defaultType="Non-negotiable"
                loadHabits={async () => {}}
                habitToEdit={null}
              />
            </ProtectedRoute>
          }
        />
        <Route
          path="/schedule"
          element={
            <ProtectedRoute>
              <Schedule />
            </ProtectedRoute>
          }
        />

        {/* Error page (default route) */}
        <Route path="*" element={<Error />} />
      </Routes>
    </BrowserRouter>
  );
};
export default AppRoutes;
