
import { DailyRecord } from '../types';

/**
 * Returns the current system date in YYYY-MM-DD format based on local time.
 * This is the ONLY source of truth for "Today".
 */
export const getTodayISO = (): string => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Formats a YYYY-MM-DD string into a readable format
 */
export const formatDateReadable = (isoDate: string): string => {
  const date = new Date(isoDate);
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

/**
 * Fills gaps in history. If a user skips a day, we want the chart to drop to 0
 * rather than drawing a line between two successful days.
 */
export const fillDataGaps = (history: DailyRecord[]): DailyRecord[] => {
  if (history.length === 0) return [];

  const sorted = [...history].sort((a, b) => a.date.localeCompare(b.date));
  const filled: DailyRecord[] = [];
  
  // Start from the first recorded day
  const startDate = new Date(sorted[0].date);
  const endDate = new Date(sorted[sorted.length - 1].date);
  
  const current = new Date(startDate);

  while (current <= endDate) {
    const iso = current.toISOString().split('T')[0];
    const existing = sorted.find(r => r.date === iso);
    
    if (existing) {
      filled.push(existing);
    } else {
      // Create a ghost record for the chart (0 score)
      filled.push({
        date: iso,
        tasks: {},
        dailyScore: 0,
        timestamp: current.getTime()
      });
    }
    
    // Add 1 day
    current.setDate(current.getDate() + 1);
  }

  return filled;
};
