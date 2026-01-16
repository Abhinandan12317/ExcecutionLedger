
export type TaskName = string;

export const DEFAULT_TASK_LIST: TaskName[] = ['DSA', 'DevOps', 'Project', 'Internship', 'Research', 'Workout'];

export interface DailyRecord {
  date: string; // YYYY-MM-DD
  tasks: Record<TaskName, number>; // 0 or 1
  dailyScore: number; // 0 to 6 (or more now)
  timestamp: number; // Submission epoch
}

export interface StorageSchema {
  version: number;
  records: DailyRecord[];
}
