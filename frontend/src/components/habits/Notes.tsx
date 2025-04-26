import { useEffect, useRef } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import Input from '../ui/Input';
import { saveNote, getNote } from '../../services/noteService';
import { Form } from 'react-bootstrap';

interface FormData {
  notes: string;
}

interface HabitNameProps {
  habitName: string;
}

const Notes = ({ habitName }: HabitNameProps) => {
  // `isInitialLoadRef` is used to track whether the component is in its initial load state
  const isInitialLoadRef = useRef(true);

  const methods = useForm<FormData>({
    mode: 'onChange',
    defaultValues: {
      notes: '',
    },
  });

  const {
    formState: { errors },
    watch,
    reset,
  } = methods;

  // watch notes value, re-render when it changes
  const notesValue = watch('notes');

  useEffect(() => {
    const fetchNote = async () => {
      try {
        const response = await getNote(habitName);

        if (response && response.note) {
          const noteText = response.note.notes || '';
          // set default value for notes
          reset({ notes: noteText });
        } else {
          reset({ notes: '' });
        }

        // mark initial load as complete, after await set it to false
        isInitialLoadRef.current = false;
      } catch (error) {
        // console.error('Error fetching note:', error);
        isInitialLoadRef.current = false;
      }
    };

    fetchNote();
  }, [habitName, reset]);

  // auto-save whenever notes change
  useEffect(() => {
    // skip saving during initial load
    if (isInitialLoadRef.current) {
      return;
    }

    // when note value changes -->
    const saveData = async () => {
      try {
        await saveNote(habitName, notesValue);
      } catch (error) {
        console.error('Error saving note:', error);
      }
    };

    saveData();
  }, [notesValue, habitName]);

  return (
    <FormProvider {...methods}>
      <Form>
        <Input
          type="text"
          id="notes"
          placeholder="[ Add A Note ]"
          className="text-center"
        />
        {errors.notes && (
          <span className="text-danger">{errors.notes.message}</span>
        )}
      </Form>
    </FormProvider>
  );
};

export default Notes;
