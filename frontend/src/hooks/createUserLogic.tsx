import { useEffect, useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import UserInterface from '../types/auth';
import { register, updateUser, deleteUser } from '../services/authService';

interface UseUserFormProps {
  userToUpdate?: UserInterface | null;
}

// custom hook to handle user registration and profile update logic
const CreateUserLogic = ({ userToUpdate }: UseUserFormProps) => {
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<string>('');
  const redirect = useNavigate();
  const isEditMode = !!userToUpdate; // bool depending if there is a user to update

  // initialize form methods
  const methods = useForm<UserInterface>({ mode: 'onChange' });
  const {
    handleSubmit,
    formState: { errors },
    watch,
    reset,
    setValue,
  } = methods;

  const password = watch('password');

  useEffect(() => {
    reset();
    if (userToUpdate) {
      // if user to Update iterate across user showing data as value except password
      Object.keys(userToUpdate).forEach((key) => {
        if (key !== 'password' && key !== 'password2') {
          setValue(key as keyof UserInterface, (userToUpdate as any)[key]);
        }
      });
    }
  }, [userToUpdate, setValue, reset]);

  // form submission handler
  const onSubmit: SubmitHandler<UserInterface> = async (data) => {
    setError('');
    setSuccess('');

    if (data.password !== data.password2) {
      setError('Passwords do not match');
      return;
    }

    try {
      setLoading(true);

      // if userToUpdate is passed, update user | else register new user
      if (isEditMode) {
        const result = await updateUser(data);
        if (result) {
          setSuccess('Profile updated successfully!');
        } else {
          setError('Failed to update profile');
        }
      } else {
        await register(data, redirect, setError);
      }
    } catch (err) {
      setError('An unexpected error occurred');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // handle delete user action
  const handleDelete = async () => {
    // ask for confirmation before deleting
    const deleteUserConfirmed = window.confirm(
      'Are you sure you want to delete your account? This action cannot be undone.',
    );
    if (deleteUserConfirmed) {
      try {
        setLoading(true);
        const result = await deleteUser();
        if (result) {
          setSuccess('Account deleted successfully!');
          redirect('/signin');
        } else {
          setError('Failed to delete account');
        }
      } catch (err) {
        setError('An unexpected error occurred');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
  };

  // return all necessary data and methods
  return {
    methods,
    handleSubmit,
    errors,
    password,
    onSubmit,
    handleDelete,
    error,
    success,
    loading,
    isEditMode,
  };
};

export default CreateUserLogic;
