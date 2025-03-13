import { useState, useEffect, ReactNode } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Route, Routes, BrowserRouter, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Error from './pages/Error';
import AboutUs from './pages/AboutUs';
import Habits from './pages/Habits';
import CreateHabit from './components/habits/CreateHabit';

interface ProtectedRouteProps {
  children: ReactNode;
}

function ProtectedRoute({ children }: ProtectedRouteProps) {
  const redirect = useNavigate();
  const isAuthenticated = Cookies.get('cookie_access_token');

  useEffect(() => {
    if (!isAuthenticated) {
      redirect('/signin');
    }
  }, [isAuthenticated, redirect]);

  return isAuthenticated ? <>{children}</> : null;
}

const AppRoutes = () => {
  const [showModal, setShowModal] = useState(false);

  // const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const handleSuccess = () => {
    // Logic to handle success
    console.log('Habit created successfully');
  };

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
              <Habits />
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
                onSuccess={handleSuccess}
              />
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
