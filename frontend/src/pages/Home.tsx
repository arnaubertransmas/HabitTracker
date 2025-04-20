import { useEffect, useState } from 'react';
import Header from '../components/ui/Header';
import Sidebar from '../components/ui/Sidebar';
import DailyInfo from '../components/DailyInfo';
import { getUser } from '../services/authService';

const Home = () => {
  const [userStreak, setUserStreak] = useState(0);

  useEffect(() => {
    const fetchUser = async () => {
      const user = await getUser();
      // get user-streak and upload it to localStorage
      const streak = user.streak.length || 0;
      setUserStreak(streak);
      localStorage.setItem('user_streak', streak.toString());
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
