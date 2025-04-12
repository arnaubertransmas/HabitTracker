import { forwardRef } from 'react';
import { Form } from 'react-bootstrap';
import { useFormContext } from 'react-hook-form';

interface InputProps {
  type: string;
  id: string;
  value?: string;
  placeholder?: string;
  className?: string;
  rules?: object;
}

// forwardRef to pass ref to input element
const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ type, id, value, placeholder, className, rules = {} }, ref) => {
    const methods = useFormContext();

    if (!methods) {
      console.error('useFormContext is undefined');
      return null;
    }

    const { register } = methods;
    const { ref: registerRef, ...registerRest } = register(id, rules);

    return (
      <Form.Group controlId={id} className="mb-3">
        <Form.Control
          type={type}
          value={value}
          placeholder={placeholder}
          className={className}
          ref={(e: HTMLInputElement | null) => {
            registerRef(e);
            if (ref) {
              if (typeof ref === 'function') {
                ref(e);
              } else {
                ref.current = e;
              }
            }
          }}
          {...registerRest}
        />
      </Form.Group>
    );
  },
);

export default Input;
