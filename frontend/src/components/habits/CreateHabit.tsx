import React from 'react';
import { Button, Modal, Form } from 'react-bootstrap';
import { FormProvider } from 'react-hook-form';
import Input from '../ui/Input';
import Frequency from '../../services/frequencyManagment';
import HabitInterface from '../../types/habit';
import CreateLogic from '../../hooks/createHabitLogic';

interface CreateHabitProps {
  show: boolean;
  handleClose: () => void;
  loadHabits: () => Promise<void>;
  defaultType?: 'Habit' | 'Non-negotiable';
  habitToEdit: HabitInterface | null;
}

const CreateHabit: React.FC<CreateHabitProps> = ({
  show,
  handleClose,
  defaultType,
  loadHabits,
  habitToEdit,
}) => {
  // use custom hook for handle logic of comp
  const { methods, onSubmit, errors, habitType } = CreateLogic({
    defaultType,
    habitToEdit,
    show,
    loadHabits,
    handleClose,
  });

  const habitTypeValue = defaultType || '';

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>
          {habitToEdit
            ? `Edit ${habitToEdit.name}`
            : `Create ${habitTypeValue}`}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <FormProvider {...methods}>
          <Form onSubmit={onSubmit}>
            <Form.Label>{habitTypeValue} Name</Form.Label>
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

            <Frequency methods={methods} habitToEdit={habitToEdit} />

            <Form.Group className="mb-3">
              <Form.Label>Time of Day</Form.Label>
              <Form.Select
                id="time_day"
                {...methods.register('time_day', {
                  required: 'Field is required',
                })}
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
              <Form.Label>Type</Form.Label>
              {defaultType ? (
                <Form.Control
                  type="text"
                  value={habitType}
                  disabled
                  className="form-control"
                />
              ) : (
                <Form.Select
                  id="type"
                  {...methods.register('type', {
                    required: 'Field is required',
                  })}
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
                {habitToEdit ? 'Update Habit' : 'Save Habit'}
              </Button>
            </div>
          </Form>
        </FormProvider>
      </Modal.Body>
    </Modal>
  );
};

export default CreateHabit;
