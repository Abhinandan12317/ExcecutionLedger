
import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { DailyRecord, TaskName } from '../types';

interface AnalyticsPanelProps {
  history: DailyRecord[];
  taskList: TaskName[];
}

export const AnalyticsPanel: React.FC<AnalyticsPanelProps> = ({ history, taskList }) => {
  const stats = useMemo(() => {
    const totalDays = history.length;
    if (totalDays === 0) return null;

    const counts = history.reduce((acc, record) => {
      taskList.forEach(task => {
        // Safe access in case task didn't exist in old records
        acc[task] = (acc[task] || 0) + (record.tasks[task] || 0);
      });
      return acc;
    }, {} as Record<TaskName, number>);

    return taskList.map(task => ({
      name: task,
      count: counts[task] || 0,
      percentage: Math.round(((counts[task] || 0) / totalDays) * 100)
    }));
  }, [history, taskList]);

  if (!stats) return null;

  return (
    <div className="space-y-4">
      <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-[0.2em] ml-1">Performance Matrix</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {stats.map((stat, idx) => (
          <motion.div 
            key={stat.name}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="relative overflow-hidden bg-white/40 border border-gray-200 p-3 rounded-md flex flex-col justify-between hover:bg-white/60 transition-colors h-24 shadow-sm"
          >
            <div className="relative z-10">
              <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider block truncate" title={stat.name}>{stat.name}</span>
            </div>
            
            <div className="relative z-10 mt-auto">
              <span className={`text-2xl font-black ${stat.percentage >= 80 ? 'text-emerald-600' : 'text-zinc-400'}`}>
                {stat.percentage}%
              </span>
            </div>

            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${stat.percentage}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className={`h-full ${stat.percentage >= 80 ? 'bg-emerald-500' : 'bg-zinc-400'}`}
              />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
