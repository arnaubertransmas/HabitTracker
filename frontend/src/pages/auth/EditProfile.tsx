import { useEffect, useState } from 'react';
import Register from './Register';
import Sidebar from '../../components/ui/Sidebar';
import { getUser } from '../../services/authService';
import UserInterface from '../../types/auth';

const EditProfile = () => {
  const [userToUpdate, setUserToUpdate] = useState<UserInterface | null>(null);

  useEffect(() => {
    // function to get whole user data
    const getWholeUser = async () => {
      try {
        const user = await getUser();
        setUserToUpdate(user);
      } catch (err) {
        console.error('Failed to load user', err);
      }
    };

    getWholeUser();
  }, []);

  return (
    <>
      <Sidebar />
      <Register userToUpdate={userToUpdate} />
    </>
  );
};

export default EditProfile;
