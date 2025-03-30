// hooks/useHabitForm.ts
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import axiosInstance from '../config/axiosConfig';
import HabitInterface from '../types/habit';

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
    let days: string[] = [];

    // process frequency data
    if (data.frequency === 'daily' && data.daily) {
      days = [data.daily];
    } else if (data.frequency === 'weekly' && data.custom_day) {
      days = [data.custom_day];
    } else if (data.frequency === 'custom' && data.custom_days) {
      days = data.custom_days;
    }

    try {
      const dataToSend = {
        name: data.name,
        frequency: data.frequency,
        days: days,
        time_day: data.time_day,
        type: data.type,
        completed: false,
      };

      let response;
      if (habitToEdit) {
        response = await axiosInstance.put(
          `/habit/update_habit/${habitToEdit.name}`,
          dataToSend,
        );
      } else {
        response = await axiosInstance.post('/habit/create_habit', dataToSend);
      }

      if (!response.data.success) {
        console.error('Habit operation failed', response.data.message);
        return;
      }

      loadHabits();
      reset();
      handleClose();
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
