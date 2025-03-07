import 'bootstrap/dist/css/bootstrap.min.css';
import { Route, Routes, BrowserRouter as Router } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';

const App = () => {
  return (
    <Router
      future={{
        v7_relativeSplatPath: true, // for a console warning.
      }}
    >
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/signin" element={<Login />} />
        <Route path="/signup" element={<Register />} />
        {/* modificar el /user en un futur, EL REDIRECT DE LA RUTA*/}
        <Route path="/user" element={<Home />} />
        <Route path="/user/:username" element={<Home />} />
      </Routes>
    </Router>
  );
};

export default App;
