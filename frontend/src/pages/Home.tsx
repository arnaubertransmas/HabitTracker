import { useEffect, useState } from 'react';
import Header from '../components/ui/Header';
import Sidebar from '../components/ui/Sidebar';
import DailyInfo from '../components/DailyInfo';
import { getUser } from '../services/authService';
import Cookies from '../components/ui/Cookies';

const Home = () => {
  const [userStreak, setUserStreak] = useState(0);
  const [showCookies, setShowCookies] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        // get logged user
        const user = await getUser();
        if (user) {
          const streak = user.streak.length || 0;
          setUserStreak(streak);
          localStorage.setItem('user_streak', streak.toString());

          // check if cookies modal was already shown
          // and if has been accpeted
          const cookiesShown = localStorage.getItem('cookies_consent_shown');
          if (cookiesShown !== 'true') {
            setShowCookies(true);
          }
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

  const handleCookieAction = () => {
    // nofify child comp
    setShowCookies(false);
  };

  return (
    <>
      <Header />
      <Sidebar />
      <DailyInfo streak={userStreak} />
      {showCookies && <Cookies onAction={handleCookieAction} />}
    </>
  );
};

export default Home;
