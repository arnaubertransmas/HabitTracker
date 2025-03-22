import React from 'react';
import MyCalendar from '../components/habits/HabitsCalendar';
import Header from '../components/ui/Header';
import Sidebar from '../components/ui/Sidebar';

const Schedule = () => {
  return (
    <>
      <Header />
      <Sidebar />
      <MyCalendar />
    </>
  );
};

export default Schedule;
