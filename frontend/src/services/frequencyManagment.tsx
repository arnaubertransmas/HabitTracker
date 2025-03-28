import React, { useEffect, useMemo } from 'react';
import { UseFormReturn } from 'react-hook-form';
import Button from 'react-bootstrap/Button';
import { Form } from 'react-bootstrap';

interface HabitFrequency {
  methods: UseFormReturn<any>;
}

const Frequency: React.FC<HabitFrequency> = ({ methods }) => {
  const {
    watch,
    register,
    setValue,
    formState: { errors },
  } = methods;

  const frequency = watch('frequency');

  // weekdays index
  const days_week = useMemo(() => [0, 1, 2, 3, 4, 5, 6], []);

  // when daily is selected -->
  useEffect(() => {
    if (frequency === 'daily') {
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

      {frequency === 'daily' && (
        <Form.Group className="mb-3">
          <Form.Label>Selected Days:</Form.Label>
          <div className="d-flex flex-wrap gap-2">
            {days_week.map((day) => (
              <Button key={day} variant="primary" disabled>
                {/* show days and save index */}
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
                // set value
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
