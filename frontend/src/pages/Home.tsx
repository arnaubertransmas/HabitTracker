import React from 'react';
import Header from '../components/ui/Header';
import Sidebar from '../components/ui/Sidebar';
import DailyInfo from '../components/DailyInfo';

const Home = () => {
  return (
    <>
      <Header />
      <Sidebar />
      <DailyInfo streak={190} />
    </>
  );
};

export default Home;
