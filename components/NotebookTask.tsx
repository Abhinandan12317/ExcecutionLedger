
import React from 'react';
import { motion } from 'framer-motion';
import { TaskName } from '../types';
import { TrashIcon } from './Icons';

interface NotebookTaskProps {
  name: TaskName;
  isActive: boolean;
  isLocked: boolean;
  isEditing: boolean;
  onToggle: (name: TaskName) => void;
  onDelete?: (name: TaskName) => void;
}

export const NotebookTask: React.FC<NotebookTaskProps> = ({ 
  name, 
  isActive, 
  isLocked, 
  isEditing,
  onToggle, 
  onDelete 
}) => {
  
  const scribblePath = "M 0 15 Q 10 5, 20 15 T 40 15 T 60 15 T 80 15 T 100 15 T 120 15 T 140 15 T 160 15 T 180 15 T 200 15";

  const handleClick = () => {
    if (isEditing) return;
    if (!isLocked) onToggle(name);
  };

  return (
    <motion.div 
      layout 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className={`relative h-12 flex items-center pl-2 group select-none ${!isEditing && !isLocked ? 'cursor-pointer' : ''}`}
    >
      {/* Edit Mode: Delete Button */}
      {isEditing ? (
        <motion.button 
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => onDelete && onDelete(name)}
          className="mr-4 text-ink-red w-8 h-8 flex justify-center items-center rounded-full bg-red-50 hover:bg-ink-red hover:text-white transition-colors border border-red-100"
          title="Delete Task"
        >
          <TrashIcon className="w-4 h-4" />
        </motion.button>
      ) : (
        /* Normal Mode: Checkbox */
        <motion.div 
          onClick={handleClick}
          className={`w-5 h-5 rounded-sm border-2 border-ink-black mr-4 flex-shrink-0 relative overflow-hidden bg-[#fdfbf7] shadow-sm`}
          whileTap={!isLocked ? { scale: 0.8 } : {}}
        >
          {isActive && (
             <motion.div 
                layoutId={`check-${name}`}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute inset-0 bg-ink-black flex items-center justify-center"
             >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
             </motion.div>
          )}
        </motion.div>
      )}
      
      {/* Task Name */}
      <div className="relative flex-grow h-full flex items-center" onClick={handleClick}>
        <span className={`text-2xl font-flower text-ink-blue transition-all duration-300 ${isActive ? 'opacity-60 blur-[0.5px]' : 'opacity-100'}`}>
          {name}
        </span>
        
        {/* Scribble Animation */}
        {isActive && !isEditing && (
          <svg className="absolute top-0 left-[-5%] w-[110%] h-full pointer-events-none overflow-visible">
            <motion.path
              d={scribblePath}
              fill="transparent"
              stroke="#c0392b"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0, opacity: 0.8 }}
              animate={{ pathLength: 1, opacity: [0.8, 0.6] }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            />
          </svg>
        )}
      </div>

      {/* Hover Highlight */}
      {!isLocked && !isActive && !isEditing && (
        <motion.div 
          layoutId="highlight"
          className="absolute inset-0 bg-highlighter-yellow opacity-0 group-hover:opacity-100 -z-10 transform -skew-x-12 transition-opacity duration-200 pointer-events-none rounded-sm mix-blend-multiply"
        />
      )}
    </motion.div>
  );
};
