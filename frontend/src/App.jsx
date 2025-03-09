import { useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {
  Route,
  Routes,
  BrowserRouter as Router,
  useNavigate,
} from 'react-router-dom';
import Cookies from 'js-cookie';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Error from './components/Error';

const ProtectedRoute = ({ children }) => {
  const redirect = useNavigate();
  const isProtected = Cookies.get('cookie_access_token');

  // useEffect executes it AFTER THE CONNEXION RENDERS
  useEffect(() => {
    if (!isProtected) {
      return redirect('/signin');
    }
    // run when token change
  }, [isProtected, redirect]);

  return children;
};

const App = () => {
  return (
    <Router
      future={{
        v7_relativeSplatPath: true, // for a console warning.
      }}
    >
      <Routes>
        {/* public routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/signin" element={<Login />} />
        <Route path="/signup" element={<Register />} />

        {/* private routes */}

        {/* modificar el /user en un futur, EL REDIRECT DE LA RUTA*/}
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

        {/* error default route */}
        <Route path="*" element={<Error />} />
      </Routes>
    </Router>
  );
};

export default App;
