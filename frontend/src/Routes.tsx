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
import Progress from './pages/Progress';
import EditProfile from './pages/EditProfile';

const AppRoutes = () => {
  const [showModal, setShowModal] = useState(false);
  const handleCloseModal = () => setShowModal(false);

  return (
    // keys are unique for each route to force re-rendering when navigating between routes
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<LandingPage key="landing" />} />
        <Route path="/home" element={<LandingPage key="home" />} />
        <Route path="/signin" element={<Login key="signin" />} />
        <Route path="/signup" element={<Register key="signup" />} />
        <Route path="/about_us" element={<AboutUs key="about" />} />

        {/* Protected routes */}
        <Route
          path="/user/:username"
          element={
            <ProtectedRoute key="user">
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user/:username/edit_profile"
          element={
            <ProtectedRoute key="user">
              <EditProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/habits"
          element={
            <ProtectedRoute key="habits">
              <Habits habitType="Habit" key="habit" />
            </ProtectedRoute>
          }
        />
        <Route
          path="/habits/:create_habit"
          element={
            <ProtectedRoute key="create-habit">
              <CreateHabit
                show={showModal}
                handleClose={handleCloseModal}
                defaultType="Habit"
                loadHabits={async () => {}}
                habitToEdit={null}
                key="create-habit-form"
              />
            </ProtectedRoute>
          }
        />
        <Route
          path="/non-negotiables"
          element={
            <ProtectedRoute key="non-negotiables">
              <Habits habitType="Non-negotiable" key="non-negotiable" />
            </ProtectedRoute>
          }
        />
        <Route
          path="/non-negotiables/:create_habit"
          element={
            <ProtectedRoute key="create-non-negotiable">
              <CreateHabit
                show={showModal}
                handleClose={handleCloseModal}
                defaultType="Non-negotiable"
                loadHabits={async () => {}}
                habitToEdit={null}
                key="create-non-negotiable-form"
              />
            </ProtectedRoute>
          }
        />
        <Route
          path="/schedule"
          element={
            <ProtectedRoute key="schedule">
              <Schedule key="schedule-view" />
            </ProtectedRoute>
          }
        />
        <Route
          path="/progress"
          element={
            <ProtectedRoute key="progress">
              <Progress key="progress-view" />
            </ProtectedRoute>
          }
        />

        {/* Error page (default route) */}
        <Route path="*" element={<Error key="error" />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
