
import { StorageSchema, DailyRecord, DEFAULT_TASK_LIST } from '../types';

const DB_KEY = 'EXECUTION_LEDGER_V1';
const TASK_LIST_KEY = 'EXECUTION_LEDGER_TASKS';
const CURRENT_VERSION = 1;

export const loadRecords = (): DailyRecord[] => {
  try {
    const raw = localStorage.getItem(DB_KEY);
    if (!raw) return [];
    
    const parsed: StorageSchema = JSON.parse(raw);
    if (parsed.version !== CURRENT_VERSION) {
      console.warn('Version mismatch, technically should migrate but resetting for MVP safety');
    }
    return parsed.records.sort((a, b) => a.date.localeCompare(b.date));
  } catch (e) {
    console.error("Failed to load records", e);
    return [];
  }
};

export const saveRecord = (record: DailyRecord): boolean => {
  try {
    const existing = loadRecords();
    
    // Security Check: Prevent overwriting existing date
    if (existing.find(r => r.date === record.date)) {
      console.error("Security Violation: Attempted to overwrite existing date.");
      return false;
    }

    const newSchema: StorageSchema = {
      version: CURRENT_VERSION,
      records: [...existing, record]
    };

    localStorage.setItem(DB_KEY, JSON.stringify(newSchema));
    return true;
  } catch (e) {
    console.error("Failed to save record", e);
    return false;
  }
};

export const loadTaskList = (): string[] => {
  try {
    const raw = localStorage.getItem(TASK_LIST_KEY);
    if (!raw) return DEFAULT_TASK_LIST;
    return JSON.parse(raw);
  } catch (e) {
    return DEFAULT_TASK_LIST;
  }
};

export const saveTaskList = (tasks: string[]): void => {
  try {
    localStorage.setItem(TASK_LIST_KEY, JSON.stringify(tasks));
  } catch (e) {
    console.error("Failed to save task list", e);
  }
};
