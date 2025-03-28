import React, { useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { Form } from 'react-bootstrap';
import Input from '../ui/Input';
import axiosInstance from '../../config/axiosConfig';
import Frequency from '../../services/frequencyManagment';
import HabitInterface from '../../types/habit';

interface CreateHabitProps {
  show: boolean;
  handleClose: () => void;
  loadHabits: () => Promise<void>;
  defaultType?: 'Habit' | 'Non-negotiable';
}

const CreateHabit: React.FC<CreateHabitProps> = ({
  show,
  handleClose,
  defaultType,
  loadHabits,
}) => {
  const methods = useForm<HabitInterface>({
    mode: 'onChange',
    defaultValues: {
      type: defaultType || '',
    },
  });
  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
    setValue,
  } = methods;

  useEffect(() => {
    if (!show) {
      // autoReset when modal close
      reset();
    } else if (defaultType) {
      setValue('type', defaultType);
    }
  }, [show, reset, defaultType, setValue]);

  const onSubmit = async (data: any) => {
    let days: string[] = [];
    // variables from frequency_managment
    if (data.frequency === 'daily' && data.daily) {
      days = [data.daily];
    } else if (data.frequency === 'weekly' && data.custom_day) {
      days = [data.custom_day];
    } else if (data.frequency === 'custom' && data.custom_days) {
      days = data.custom_days;
    }

    try {
      // request to backend
      const response = await axiosInstance.post('/habit/create_habit', {
        name: data.name,
        frequency: data.frequency,
        days: days,
        time_day: data.time_day,
        type: data.type,
        completed: false,
      });

      if (!response.data.success) {
        console.error('Habit creation failed', response.data.message);
        return;
      }

      loadHabits();
      reset();
      handleClose();
    } catch (error) {
      console.error('Error creating habit:', error);
    }
  };
  const habitType = methods.watch('type');
  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Create {defaultType}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <FormProvider {...methods}>
          {/* param data is passed automatically */}
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Form.Label>{defaultType} Name</Form.Label>
            <Input
              type="text"
              id="name"
              placeholder="Name"
              className="form-control mb-3"
              rules={{
                required: 'Name is required',
                pattern: {
                  value: /^[A-Za-z\s]+$/i,
                  message: 'Only letters are allowed',
                },
              }}
            />
            {errors.name && (
              <p className="text-danger">{(errors.name as any).message}</p>
            )}

            <Frequency methods={methods} />

            <Form.Group className="mb-3">
              <Form.Label>Time of Day</Form.Label>
              <Form.Select
                id="time_day"
                {...register('time_day', { required: 'Field is required' })}
                className="form-control"
              >
                <option value="">Select Time of Day</option>
                <option value="morning">Morning</option>
                <option value="afternoon">Afternoon</option>
                <option value="night">Night</option>
              </Form.Select>
              {errors.time_day && (
                <p className="text-danger">
                  {(errors.time_day as any).message}
                </p>
              )}
            </Form.Group>

            <Form.Group className="mb-3">
              {/* if habit specified disabled input */}
              <Form.Label>Type</Form.Label>
              {defaultType ? (
                <Form.Control
                  type="text"
                  value={habitType}
                  disabled
                  className="form-control"
                />
              ) : (
                // else select for habitType
                <Form.Select
                  id="type"
                  {...register('type', { required: 'Field is required' })}
                  className="form-control"
                >
                  <option value="">Select Type</option>
                  <option value="Habit">Habit</option>
                  <option value="Non-negotiable">Non-negotiable</option>
                </Form.Select>
              )}
              {errors.type && (
                <p className="text-danger">{(errors.type as any).message}</p>
              )}
            </Form.Group>

            <div className="d-flex justify-content-end mt-4">
              <Button
                variant="secondary"
                onClick={handleClose}
                className="me-2"
              >
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                Save Habit
              </Button>
            </div>
          </Form>
        </FormProvider>
      </Modal.Body>
    </Modal>
  );
};

export default CreateHabit;
