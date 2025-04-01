import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import HabitInterface from '../types/habit';
import { createHabits, editHabit } from '../services/habitService';

interface CreateLogicInterface {
  defaultType?: 'Habit' | 'Non-negotiable';
  habitToEdit: HabitInterface | null;
  show: boolean;
  loadHabits: () => Promise<void>;
  handleClose: () => void;
}

const CreateLogic = ({
  defaultType,
  habitToEdit,
  show,
  loadHabits,
  handleClose,
}: CreateLogicInterface) => {
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
          setValue(key as keyof HabitInterface, (habitToEdit as any)[key]);
        });
      } else {
        reset();
      }
    }
  }, [show, habitToEdit, reset, setValue, defaultType]);

  // form submission handler
  const onSubmit = async (data: any) => {
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

    try {
      const dataToSend = {
        name: data.name,
        frequency: data.frequency,
        days: days, // Ensure this is populated
        time_day: data.time_day,
        type: data.type,
        completed: [],
      };

      let success = false;
      if (habitToEdit) {
        success = await editHabit(habitToEdit, dataToSend, loadHabits);
      } else {
        success = await createHabits(dataToSend, loadHabits);
      }

      if (success) {
        reset();
        handleClose();
      } else {
        setError('root', {
          type: 'manual',
          message: 'Failed to save habit',
        });
      }
    } catch (err) {
      console.error('Error processing habit:', err);
      setError('root', {
        type: 'manual',
        message: 'An unexpected error occurred',
      });
    }
  };

  // watch habitType for the comp
  const habitType = watch('type');

  return {
    methods,
    onSubmit: handleSubmit(onSubmit),
    errors,
    habitType,
  };
};

export default CreateLogic;
