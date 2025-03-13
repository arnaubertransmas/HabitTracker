import React from 'react';
import { Form } from 'react-bootstrap';
import { useFormContext } from 'react-hook-form';

interface InputProps {
  type: string;
  id: string;
  placeholder?: string;
  className?: string;
  rules?: object;
}

const Input: React.FC<InputProps> = ({
  type,
  id,
  placeholder,
  className,
  rules = {},
}) => {
  const methods = useFormContext();

  if (!methods) {
    console.error('useFormContext() és undefined');
    return null;
  }

  const { register } = methods;

  return (
    <Form.Group controlId={id} className="mb-3">
      <Form.Control
        type={type}
        placeholder={placeholder}
        className={className}
        {...register(id, rules)}
      />
    </Form.Group>
  );
};

export default Input;
