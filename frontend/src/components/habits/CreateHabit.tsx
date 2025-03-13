import React from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { Form } from 'react-bootstrap';
import Input from '../ui/Input';
import axiosInstance from '../../config/axiosConfig';

interface CreateHabitProps {
  show: boolean;
  handleClose: () => void;
  onSuccess: () => void;
}

const CreateHabit: React.FC<CreateHabitProps> = ({
  show,
  handleClose,
  onSuccess,
}) => {
  const methods = useForm({ mode: 'onChange' });
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = methods;

  const onSubmit = async (data: any) => {
    try {
      const response = await axiosInstance.post('/habit/create_habit', {
        name: data.name,
        duration: parseInt(data.duration, 10),
        repeat: data.repeat,
        time_day: data.time_day,
      });

      const result = response.data;
      if (!result.success) {
        console.error('Error from server:', result);
        return;
      }
      handleClose();
      if (onSuccess && typeof onSuccess === 'function') {
        onSuccess();
      }
    } catch (error) {
      console.error('Error creating habit:', error);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Create a Habit</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <FormProvider {...methods}>
          <Form onSubmit={handleSubmit(onSubmit)}>
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
            )}{' '}
            {/* Type casting errors */}
            <Input
              type="text"
              id="duration"
              placeholder="Duration"
              className="form-control mb-3"
              rules={{
                required: 'Duration is required',
                pattern: {
                  value: /^[0-9]+$/i,
                  message: 'Only numbers are allowed',
                },
              }}
            />
            {errors.duration && (
              <p className="text-danger">{(errors.duration as any).message}</p>
            )}{' '}
            {/* Type casting errors */}
            <Form.Group className="mb-3">
              <Form.Label>Repeat</Form.Label>
              <Form.Select
                id="repeat"
                {...register('repeat', { required: 'Field is required' })}
                className="form-control"
              >
                <option value="">Select Repeat Frequency</option>
                <option value="daily">Daily</option>
                <option value="monthly">Monthly</option>
                <option value="custom">Custom</option>
              </Form.Select>
              {errors.repeat && (
                <p className="text-danger">{(errors.repeat as any).message}</p>
              )}
            </Form.Group>
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
              )}{' '}
              {/* Type casting errors */}
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
