import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import HabitInterface from '../../types/habit';
import { createHabits, editHabit } from '../../services/habitService';

interface CreateHabitLogicInterface {
  defaultType?: 'Habit' | 'Non-negotiable';
  habitToEdit: HabitInterface | null;
  show: boolean;
  loadHabits: () => Promise<void>;
  handleClose: () => void;
}

const CreateHabitLogic = ({
  defaultType,
  habitToEdit,
  show,
  loadHabits,
  handleClose,
}: CreateHabitLogicInterface) => {
  const methods = useForm<HabitInterface>({
    mode: 'onChange',
    defaultValues: {
      type: defaultType || '',
    },
  });

  const {
    handleSubmit,
    reset,
    setValue,
    setError,
    watch,
    formState: { errors },
  } = methods;

  // reset form when modal shows/hides or habitToEdit changes
  useEffect(() => {
    if (show) {
      if (habitToEdit) {
        reset();
        // iterate accross habitToEdit showing data as value
        Object.keys(habitToEdit).forEach((key) => {
          setValue(
            key as keyof HabitInterface,
            (habitToEdit as HabitInterface)[key as keyof HabitInterface],
          );
        });
      } else {
        reset();
      }
    }
  }, [show, habitToEdit, reset, setValue, defaultType]);

  // form submission handler
  const onSubmit = handleSubmit(async (data: any) => {
    let days =
      data.days && Array.isArray(data.days[0]) ? data.days[0] : data.days || [];

    // process frequency data
    if (data.frequency === 'daily' && data.daily) {
      days = [data.daily]; // Check if daily is correctly set
    } else if (data.frequency === 'weekly' && data.custom_day) {
      days = [data.custom_day]; // Ensure `custom_day` exists
    } else if (data.frequency === 'custom' && data.custom_days) {
      // arr(str) => arr(int)
      days = data.custom_days.map(Number); // Ensure conversion to numbers
    }

    // data to send to backend
    const dataToSend = {
      name: data.name,
      frequency: data.frequency,
      days: days,
      time_day: data.time_day,
      type: data.type,
      completed: [],
    };

    try {
      let response;
      if (habitToEdit) {
        response = await editHabit(habitToEdit, dataToSend, loadHabits);
      } else {
        response = await createHabits(dataToSend, loadHabits);
      }

      // check if success is true
      const isSuccess = response && response.success;

      if (isSuccess) {
        handleClose();
      } else {
        // server error
        setError('root.serverError', {
          type: 'manual',
          message: response?.message || 'Failed to save habit',
        });
      }
    } catch (error) {
      // console.error('Error in form submission:', error);
      setError('root.serverError', {
        type: 'manual',
        message: 'An unexpected error occurred',
      });
    }
  });

  // watch habitType for the comp
  const habitType = watch('type');

  return {
    methods,
    onSubmit,
    errors,
    habitType,
  };
};

export default CreateHabitLogic;
