import { useEffect, useState } from 'react';
import Header from '../components/ui/Header';
import Sidebar from '../components/ui/Sidebar';
import DailyInfo from '../components/DailyInfo';
import { getUser } from '../services/authService';

const Home = () => {
  const storedEmail = localStorage.getItem('email');
  const email = storedEmail ? storedEmail : '';

  const [userStreak, setUserStreak] = useState(0);

  useEffect(() => {
    const fetchUser = async () => {
      if (!email) return;
      const user = await getUser(email);
      if (user) {
        setUserStreak(user.streak.length || 0); // get user streak, length of arr
      }
    };

    fetchUser();
  }, [email]);

  return (
    <>
      <Header />
      <Sidebar />
      <DailyInfo streak={userStreak} />
    </>
  );
};

export default Home;
