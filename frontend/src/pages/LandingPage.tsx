import Header from '../components/ui/Header';
import Sidebar from '../components/ui/Sidebar';
import Welcome from '../components/Welcome';

const LandingPage = () => {
  const user = localStorage.getItem('user_name') || '';

  return (
    <>
      <Header />
      {user && <Sidebar />}
      <Welcome />
    </>
  );
};

export default LandingPage;
