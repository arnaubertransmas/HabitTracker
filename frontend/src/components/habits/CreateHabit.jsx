import { useForm, FormProvider } from 'react-hook-form';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { Form } from 'react-bootstrap';
import Input from '../ui/Input';
import axiosInstance from '../../config/axiosConfig';

const CreateHabit = ({ show, handleClose, onSuccess }) => {
  const methods = useForm({ mode: 'onChange' });
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = methods;

  const onSubmit = async (data) => {
    try {
      const response = await axiosInstance.post('/habit/create_habit', {
        name: data.name,
        duration: parseInt(data.duration, 10),
        repeat: data.repeat,
        time_day: data.time_day,
      });

      const result = response.data;
      if (!result.success) {
        console.error('Error de servidor:', result);
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
        <Modal.Title>Create a habit</Modal.Title>
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
              <p className="text-danger">{errors.name.message}</p>
            )}

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
              <p className="text-danger">{errors.duration.message}</p>
            )}

            <Form.Group className="mb-3">
              <Form.Label>Repeat</Form.Label>
              <Form.Select
                id="repeat"
                {...register('repeat', { required: 'Field is required' })}
                className="form-control"
              >
                <option value="">Daily</option>
                <option value="morning">Montly</option>
                <option value="afternoon">Custom</option>
              </Form.Select>
              {errors.time_day && (
                <p className="text-danger">{errors.time_day.message}</p>
              )}
            </Form.Group>

            {/* Replace text input with dropdown for time_day */}
            <Form.Group className="mb-3">
              <Form.Label>Time of day</Form.Label>
              <Form.Select
                id="time_day"
                {...register('time_day', { required: 'Field is required' })}
                className="form-control"
              >
                <option value="">Select time of day</option>
                <option value="morning">Morning</option>
                <option value="afternoon">Afternoon</option>
                <option value="night">Night</option>
              </Form.Select>
              {errors.time_day && (
                <p className="text-danger">{errors.time_day.message}</p>
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
                Save changes
              </Button>
            </div>
          </Form>
        </FormProvider>
      </Modal.Body>
    </Modal>
  );
};

export default CreateHabit;
