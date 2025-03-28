export default interface HabitInterface {
  // interface for the habit
  name: string;
  frequency: string;
  days: number[];
  time_day: string;
  start_time?: string;
  end_time?: string[];
  type: string;
  completed?: boolean;
}
