import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useMemo,
} from 'react';

type HabitType = 'Habit' | 'Non-negotiable';

interface HabitTypeContextType {
  habitType: HabitType;
  setHabitType: (type: HabitType) => void;
  isHabit: boolean;
  isNonNegotiable: boolean;
}

const HabitTypeContext = createContext<HabitTypeContextType | undefined>(
  undefined,
);

export const HabitTypeProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [habitType, setHabitType] = useState<HabitType>('Habit');

  // Memoized values for performance
  const value = useMemo(
    () => ({
      habitType,
      setHabitType,
      isHabit: habitType === 'Habit',
      isNonNegotiable: habitType === 'Non-negotiable',
    }),
    [habitType],
  );

  return (
    <HabitTypeContext.Provider value={value}>
      {children}
    </HabitTypeContext.Provider>
  );
};

export const useHabitType = () => {
  const context = useContext(HabitTypeContext);
  if (context === undefined) {
    throw new Error('useHabitType must be used within a HabitTypeProvider');
  }
  return context;
};
