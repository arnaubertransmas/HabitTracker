import { useEffect, useState } from 'react';
import Header from '../components/ui/Header';
import Sidebar from '../components/ui/Sidebar';
import DailyInfo from '../components/DailyInfo';
import { getUser } from '../services/authService';
import { Container, Row, Col } from 'react-bootstrap';

const Home = () => {
  const [userStreak, setUserStreak] = useState(0);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        // get user
        const user = await getUser();
        if (user) {
          let streak = user.streak.length || 0;
          // get the last item from streak arr
          const lastStreak = new Date(user.streak[user.streak.length - 1]);
          const today = new Date();
          // calculate difference in time
          const diffInTime = today.getTime() - lastStreak.getTime();
          // convert time difference to days
          const diffInDays = diffInTime / (1000 * 3600 * 24);
          // reset streak if the difference in days is 2 or more
          if (diffInDays >= 2) {
            streak = 0;
          }

          setUserStreak(streak);
          // save streak to localStorage
          localStorage.setItem('user_streak', streak.toString());
        }
      } catch (error) {
        console.error('Failed to fetch user:', error);
      }
    };

    const cachedStreak = localStorage.getItem('user_streak');
    if (cachedStreak !== null) {
      setUserStreak(parseInt(cachedStreak));
    }

    fetchUser();
  }, []);

  return (
    <>
      <Header />
      <Container fluid className="mt-3">
        <Row>
          <Col xs={12} lg={3} className="mb-3">
            <Sidebar />
          </Col>

          <Col xs={12} lg={7}>
            <DailyInfo streak={userStreak} />
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Home;
