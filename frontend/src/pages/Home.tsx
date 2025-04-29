import { useEffect, useState } from 'react';
import Header from '../components/ui/Header';
import Sidebar from '../components/ui/Sidebar';
import DailyInfo from '../components/DailyInfo';
import { getUser } from '../services/authService';

const Home = () => {
  const [userStreak, setUserStreak] = useState(0);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        // get logged user
        const user = await getUser();
        if (user) {
          const streak = user.streak.length || 0;
          setUserStreak(streak);
          localStorage.setItem('user_streak', streak.toString());
        }
      } catch (error) {
        console.error('Failed to fetch user:', error);
      }
    };

    // check if localStorage has streak already
    const cachedStreak = localStorage.getItem('user_streak');
    if (cachedStreak !== null) {
      setUserStreak(parseInt(cachedStreak));
    }

    fetchUser();
  }, []);

  return (
    <>
      <Header />
      <Sidebar />
      <DailyInfo streak={userStreak} />
    </>
  );
};

export default Home;
