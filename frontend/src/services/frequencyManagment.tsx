import React, { useEffect, useMemo } from 'react';
import { UseFormReturn } from 'react-hook-form';
import Button from 'react-bootstrap/Button';
import { Form } from 'react-bootstrap';
import HabitInterface from '../types/habit';

interface HabitFrequency {
  methods: UseFormReturn<any>;
  habitToEdit: HabitInterface | null;
}

const Frequency: React.FC<HabitFrequency> = ({ methods, habitToEdit }) => {
  const {
    watch,
    register,
    setValue,
    formState: { errors },
  } = methods;

  // memorize days week indexes
  const days_week = useMemo(() => [0, 1, 2, 3, 4, 5, 6], []);

  const frequency = watch('frequency');

  useEffect(() => {
    if (habitToEdit) {
      // load frequency of habitToEdit
      setValue('frequency', habitToEdit.frequency);

      if (habitToEdit.frequency === 'daily' && habitToEdit.days) {
        setValue('daily', habitToEdit.days);
      }
      if (habitToEdit.frequency === 'weekly' && habitToEdit.days) {
        setValue('custom_day', habitToEdit.days[0]);
      }
      if (habitToEdit.frequency === 'custom' && habitToEdit.days) {
        setValue('custom_days', habitToEdit.days);
      }
    }
  }, [habitToEdit, setValue]);

  // re-render if frequency, value or days_week changes
  useEffect(() => {
    if (frequency === 'daily') {
      // if daily all days selected
      setValue('daily', days_week);
    }
  }, [frequency, setValue, days_week]);

  return (
    <>
      <Form.Group className="mb-3">
        <Form.Label>Frequency</Form.Label>
        <Form.Select
          id="frequency"
          {...register('frequency', { required: 'Field is required' })}
          className="form-control"
        >
          <option value="">Select Frequency</option>
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="custom">Custom</option>
        </Form.Select>
        {errors.frequency && (
          <p className="text-danger">{errors.frequency.message as string}</p>
        )}
      </Form.Group>

      {/* frequency config --> (daily/weekly/custom) */}
      {frequency === 'daily' && (
        <Form.Group className="mb-3">
          <Form.Label>Selected Days:</Form.Label>
          <div className="d-flex flex-wrap gap-2">
            {days_week.map((day) => (
              <Button key={day} variant="primary" disabled>
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][day]}
              </Button>
            ))}
          </div>
        </Form.Group>
      )}

      {frequency === 'weekly' && (
        <Form.Group className="mb-3">
          <Form.Label>Select one day:</Form.Label>
          <div className="d-flex gap-2">
            {days_week.map((day) => (
              <Button
                key={day}
                variant={
                  watch('custom_day') === day ? 'primary' : 'outline-secondary'
                }
                onClick={() => setValue('custom_day', day)}
              >
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][day]}
              </Button>
            ))}
          </div>
          {errors.custom_day && (
            <p className="text-danger">{errors.custom_day.message as string}</p>
          )}
        </Form.Group>
      )}

      {frequency === 'custom' && (
        <Form.Group className="mb-3">
          <Form.Label>Select multiple days:</Form.Label>
          <div className="d-flex flex-wrap gap-2">
            {days_week.map((day) => (
              <Button
                key={day}
                variant={
                  watch('custom_days')?.includes(day)
                    ? 'primary'
                    : 'outline-secondary'
                }
                onClick={() => {
                  const selectedDays = watch('custom_days') || [];
                  if (selectedDays.includes(day)) {
                    setValue(
                      'custom_days',
                      selectedDays.filter((d: number) => d !== day),
                    );
                  } else {
                    setValue('custom_days', [...selectedDays, day]);
                  }
                }}
              >
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][day]}
              </Button>
            ))}
          </div>
          {errors.custom_days && (
            <p className="text-danger">
              {errors.custom_days.message as string}
            </p>
          )}
        </Form.Group>
      )}
    </>
  );
};

export default Frequency;
