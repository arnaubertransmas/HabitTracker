import React from 'react';
import Header from '../components/ui/Header';
import Sidebar from '../components/ui/Sidebar';
import Calendar from '../components/habits/HabitsCalendar';

const Schedule = () => {
  return (
    <>
      <Header />
      <Sidebar />
      <Calendar />
    </>
  );
};

export default Schedule;
