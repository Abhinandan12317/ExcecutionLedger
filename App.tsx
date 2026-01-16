
import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
// @ts-ignore
import confetti from 'canvas-confetti';
import { TaskName, DailyRecord, DEFAULT_TASK_LIST } from './types';
import { getTodayISO, formatDateReadable } from './utils/dateUtils';
import { loadRecords, saveRecord, loadTaskList, saveTaskList } from './utils/storage';
import { NotebookChart } from './components/NotebookChart';
import { NotebookTask } from './components/NotebookTask';
import { Hero3D } from './components/Hero3D';
import { AnalyticsPanel } from './components/AnalyticsPanel';
import { ChartIcon, EditIcon, PlusIcon, LockIcon, LogoIcon, CheckIcon } from './components/Icons';

const App: React.FC = () => {
  // --- View State ---
  const [showTracker, setShowTracker] = useState(false);
  const [showChart, setShowChart] = useState(false);
  const [isEditingTasks, setIsEditingTasks] = useState(false);
  const [newTaskInput, setNewTaskInput] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  // Seal/Signature Animation State
  const [isSealing, setIsSealing] = useState(false);

  // --- Data State ---
  const [history, setHistory] = useState<DailyRecord[]>([]);
  const [taskList, setTaskList] = useState<string[]>(DEFAULT_TASK_LIST);
  const [currentTasks, setCurrentTasks] = useState<Record<TaskName, number>>({});
  
  const todayISO = getTodayISO();
  
  const todaysExistingRecord = useMemo(() => 
    history.find(r => r.date === todayISO), 
  [history, todayISO]);

  const isSubmitted = !!todaysExistingRecord;
  const currentScore = isSubmitted 
    ? todaysExistingRecord?.dailyScore ?? 0
    : (Object.values(currentTasks) as number[]).reduce((acc, val) => acc + val, 0);

  // --- Initialization ---
  useEffect(() => {
    // 1. Load History
    const records = loadRecords();
    setHistory(records);
    
    // 2. Load Tasks
    const storedTasks = loadTaskList();
    setTaskList(storedTasks);

    // 3. Initialize Today's State
    const existing = records.find(r => r.date === todayISO);
    if (existing) {
      setCurrentTasks(existing.tasks);
    } else {
      const initial: Record<string, number> = {};
      storedTasks.forEach(t => initial[t] = 0);
      setCurrentTasks(initial);
    }
  }, [todayISO]);

  // --- Lazy Load Chart for Performance ---
  useEffect(() => {
    if (showTracker) {
      // Delay chart rendering to allow main thread to handle transition first
      const t = setTimeout(() => setShowChart(true), 800);
      return () => clearTimeout(t);
    }
  }, [showTracker]);

  // --- Auto Submit Logic (11:59 PM) ---
  useEffect(() => {
    if (isSubmitted) return;

    const checkTime = () => {
      const now = new Date();
      // Auto-submit at 23:59:00 (or close to it)
      if (now.getHours() === 23 && now.getMinutes() >= 59) {
        handleAutoSubmit();
      }
    };

    const timer = setInterval(checkTime, 10000); // Check every 10s
    return () => clearInterval(timer);
  }, [isSubmitted, currentTasks]); // Re-bind if tasks change so we capture latest state

  // --- Handlers ---
  const handleToggle = (task: TaskName) => {
    if (isSubmitted || isEditingTasks) return;
    setCurrentTasks(prev => ({
      ...prev,
      [task]: prev[task] === 1 ? 0 : 1
    }));
    if (errorMsg) setErrorMsg(null);
  };

  const handleAddTask = () => {
    const trimmed = newTaskInput.trim();
    if (!trimmed) return;
    
    // Max 6 tasks constraint
    if (taskList.length >= 6) {
      alert("Maximum 6 tasks allowed to maintain focus.");
      return;
    }

    if (taskList.includes(trimmed)) {
      alert("Task already exists!");
      return;
    }
    
    const newTaskList = [...taskList, trimmed];
    setTaskList(newTaskList);
    saveTaskList(newTaskList);
    
    setCurrentTasks(prev => ({ ...prev, [trimmed]: 0 }));
    setNewTaskInput("");
  };

  const handleDeleteTask = (taskToDelete: string) => {
    // Min 3 tasks constraint
    if (taskList.length <= 3) {
      alert("You must maintain at least 3 tasks to keep the system rigorous.");
      return;
    }
    
    const newTaskList = taskList.filter(t => t !== taskToDelete);
    setTaskList(newTaskList);
    saveTaskList(newTaskList);
    
    setCurrentTasks(prev => {
      const copy = { ...prev };
      delete copy[taskToDelete];
      return copy;
    });
  };

  const triggerCelebration = () => {
    const colors = ['#ffffff', '#ffb7b2', '#fff176'];
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.7 },
      colors: colors,
      disableForReducedMotion: true,
      zIndex: 100
    });
  };

  const performSubmit = async (record: DailyRecord) => {
    const success = saveRecord(record);
    if (success) {
      setHistory(prev => [...prev, record].sort((a, b) => a.date.localeCompare(b.date)));
      // Only celebrate if score > 0
      if (record.dailyScore > 0) {
        triggerCelebration();
      }
    } else {
      alert("Failed to save to ledger.");
    }
    setIsSealing(false);
  };

  const handleAutoSubmit = () => {
    // Auto-submit allows 0 score (user missed the day effectively)
    const score = (Object.values(currentTasks) as number[]).reduce((acc, val) => acc + val, 0);
    const newRecord: DailyRecord = {
      date: todayISO,
      tasks: currentTasks,
      dailyScore: score,
      timestamp: Date.now(),
    };
    performSubmit(newRecord);
  };

  const handleSubmit = async () => {
    if (isSubmitted) return;
    
    if (isEditingTasks) {
      alert("Please finish editing tasks before submitting.");
      return;
    }

    // Min 1 task constraint for manual submit
    if (currentScore < 1) {
      setErrorMsg("Complete at least 1 task.");
      // Shake animation trigger could go here
      return;
    }

    setIsSealing(true);

    // Wait for animation
    await new Promise(r => setTimeout(r, 800));

    const newRecord: DailyRecord = {
      date: todayISO,
      tasks: currentTasks,
      dailyScore: currentScore,
      timestamp: Date.now(),
    };
    performSubmit(newRecord);
  };

  // --- Conditional Rendering ---
  if (!showTracker) {
    return <Hero3D onEnter={() => setShowTracker(true)} />;
  }

  // --- Notebook UI ---
  return (
    <div className="min-h-screen bg-[#dcd0c0] p-2 md:p-8 flex items-center justify-center font-hand text-ink-black overflow-y-auto">
      
      {/* The Notebook Container */}
      <motion.div 
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-5xl bg-paper shadow-[20px_20px_60px_rgba(0,0,0,0.3)] rounded-sm relative overflow-hidden flex flex-col md:flex-row min-h-[850px]"
      >
        
        {/* Binding Spirals */}
        <div className="absolute left-0 md:left-[50%] top-0 bottom-0 w-8 md:w-16 z-20 flex flex-col justify-evenly items-center pointer-events-none transform -translate-x-1/2">
           {[...Array(22)].map((_, i) => (
             <div key={i} className="w-6 h-3 md:w-10 md:h-5 border-4 border-gray-400 rounded-full bg-gradient-to-r from-gray-300 to-gray-100 shadow-lg transform -rotate-6"></div>
           ))}
        </div>

        {/* --- LEFT PAGE: Tasks --- */}
        <div className="flex-1 p-6 md:p-12 relative bg-ruled-paper border-r border-gray-300 flex flex-col">
           {/* Margin Line */}
           <div className="absolute top-0 bottom-0 left-8 md:left-12 w-[2px] bg-paper-margin opacity-60"></div>
           
           {/* Date Header */}
           <div className="flex justify-between items-start mb-8 ml-6 md:ml-8 relative z-10">
             <div>
               <div className="flex items-center gap-3">
                 <LogoIcon className="text-ink-blue w-8 h-8" />
                 <h2 className="text-3xl md:text-4xl font-marker text-ink-blue transform -rotate-1">
                   Daily Log
                 </h2>
                 {/* Edit Toggle Button */}
                 {!isSubmitted && (
                    <motion.button 
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setIsEditingTasks(!isEditingTasks)}
                      className={`text-sm border border-pencil rounded-full p-2 transition-colors ${isEditingTasks ? 'bg-ink-red text-white border-transparent shadow-inner' : 'text-pencil hover:text-ink-blue bg-white/50'}`}
                      title={isEditingTasks ? 'Finish Editing' : 'Edit Tasks'}
                    >
                      {isEditingTasks ? <CheckIcon className="w-4 h-4" /> : <EditIcon className="w-4 h-4" />}
                    </motion.button>
                 )}
               </div>
               <p className="text-pencil text-lg md:text-xl mt-1">{formatDateReadable(todayISO)}</p>
             </div>
             
             {/* Score Bubble */}
             <div className="border-4 border-ink-red rounded-full w-20 h-20 md:w-24 md:h-24 flex items-center justify-center transform rotate-12 shadow-md bg-paper-paper">
                <div className="text-center leading-none">
                  <span className="block text-3xl md:text-4xl font-bold text-ink-red">{currentScore}</span>
                  <span className="block text-xs text-ink-red uppercase font-bold tracking-widest">Score</span>
                </div>
             </div>
           </div>

           {/* Task List */}
           <div className="space-y-2 ml-6 md:ml-8 relative z-10 flex-grow">
             <AnimatePresence>
               {taskList.map((task) => (
                 <NotebookTask
                   key={task}
                   name={task}
                   isActive={currentTasks[task] === 1}
                   isLocked={isSubmitted}
                   isEditing={isEditingTasks}
                   onToggle={handleToggle}
                   onDelete={handleDeleteTask}
                 />
               ))}
             </AnimatePresence>
             
             {/* Add New Task Input */}
             <AnimatePresence>
             {isEditingTasks && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="h-14 flex items-center pl-2 mt-4 bg-white/30 rounded-lg"
                >
                  <PlusIcon className="mr-3 text-pencil w-6 h-6" />
                  <input 
                    type="text" 
                    value={newTaskInput}
                    onChange={(e) => setNewTaskInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddTask()}
                    placeholder="Write new task..."
                    className="bg-transparent border-b-2 border-pencil border-dashed text-xl font-flower text-ink-blue focus:outline-none focus:border-ink-blue w-full placeholder-pencil/50"
                    autoFocus
                  />
                  <button 
                    onClick={handleAddTask}
                    className="ml-2 px-3 py-1 bg-ink-blue text-white rounded font-bold hover:scale-105 transition-transform text-sm"
                  >
                    ADD
                  </button>
                </motion.div>
             )}
             </AnimatePresence>

             {/* Error Message */}
             <AnimatePresence>
               {errorMsg && !isSubmitted && (
                 <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="mt-4 text-ink-red font-bold text-sm bg-red-100 p-2 rounded inline-block transform rotate-1 border border-red-200"
                 >
                   ⚠️ {errorMsg}
                 </motion.div>
               )}
             </AnimatePresence>
           </div>

           {/* Action Area */}
           <div className="mt-12 ml-8 flex justify-center relative h-24 items-center">
             {!isSubmitted ? (
               !isEditingTasks ? (
                 <motion.button
                   whileHover={{ scale: 1.05 }}
                   whileTap={{ scale: 0.95 }}
                   onClick={() => handleSubmit()}
                   disabled={isSealing}
                   className={`group relative bg-ink-blue text-white font-marker text-2xl px-12 py-3 shadow-xl hover:shadow-2xl transition-all rounded-sm z-20 flex items-center gap-3 ${isSealing ? 'cursor-not-allowed opacity-80' : ''}`}
                 >
                   {isSealing ? (
                     <span className="flex items-center gap-2">
                       <motion.span 
                         animate={{ rotate: 360 }} 
                         transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                         className="inline-block"
                       >
                         ⏳
                       </motion.span> 
                       SIGNING...
                     </span>
                   ) : (
                     "SIGN & SEAL"
                   )}
                   {/* Decorative border */}
                   <div className="absolute inset-1 border border-white/30 pointer-events-none"></div>
                 </motion.button>
               ) : (
                 <div className="text-pencil font-hand text-lg bg-yellow-100 px-4 py-2 rotate-1 shadow-sm border border-yellow-200">
                   Finish customization to sign.
                 </div>
               )
             ) : (
                <motion.div 
                  initial={{ scale: 1.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1, rotate: -8 }}
                  transition={{ type: "spring", bounce: 0.4 }}
                  className="border-4 border-ink-black text-ink-black font-marker text-3xl px-8 py-3 opacity-70 select-none bg-gray-200/50 rounded-sm backdrop-blur-[1px] flex items-center gap-2"
                >
                  <LockIcon className="w-6 h-6" /> SEALED
                </motion.div>
             )}
           </div>
           
           <div className="mt-8 ml-8 text-sm text-pencil opacity-70 flex justify-between items-end">
             <span>{isEditingTasks 
               ? "System: 3-6 tasks required."
               : "Protocol: Daily submission required by 11:59 PM."}
             </span>
           </div>
        </div>

        {/* --- RIGHT PAGE: Analytics --- */}
        <div className="flex-1 p-6 md:p-12 relative bg-ruled-paper bg-opacity-50 flex flex-col">
           {/* Sticky Note */}
           <motion.div 
              initial={{ rotate: 3 }}
              whileHover={{ rotate: 5, scale: 1.05 }}
              className="absolute top-6 right-6 md:top-8 md:right-8 bg-[#fff176] w-48 p-4 shadow-[5px_5px_15px_rgba(0,0,0,0.1)] transform rotate-3 z-10 cursor-help"
           >
              <div className="w-8 h-8 bg-black/10 absolute -top-3 left-1/2 -translate-x-1/2 rounded-full opacity-30"></div>
              <div className="text-center font-messy text-xs mb-2 text-gray-500 tracking-wider">MOMENTUM</div>
              <div className="text-center font-hand text-lg leading-tight">
                "Consistency is the code."
              </div>
           </motion.div>

           <div className="mt-20 md:mt-24">
              <h3 className="text-3xl font-marker text-ink-black mb-8 transform -rotate-1 inline-block relative flex items-center gap-2">
                <ChartIcon className="w-8 h-8 text-ink-black" />
                Progress Curve
                <span className="absolute -bottom-2 left-0 w-full h-3 bg-highlighter-pink opacity-40 -skew-x-12 -z-10"></span>
              </h3>
              
              <div className="mb-10 hover:scale-[1.02] transition-transform duration-500 min-h-[288px]">
                {showChart ? (
                   <NotebookChart data={history} />
                ) : (
                  <div className="h-72 w-full flex items-center justify-center bg-white/50 border border-gray-200 rounded-sm">
                    <span className="animate-pulse text-pencil">Loading ink...</span>
                  </div>
                )}
              </div>

              <div className="bg-white/40 p-6 rounded-lg shadow-sm border border-gray-200/50 backdrop-blur-sm">
                <h4 className="font-bold text-ink-blue mb-4 flex items-center gap-2">
                  <ChartIcon className="w-5 h-5" />
                  Task Consistency
                </h4>
                <div className="border-t-2 border-dashed border-gray-300 pt-4">
                   <AnalyticsPanel history={history} taskList={taskList} />
                </div>
              </div>
           </div>
        </div>
      </motion.div>
    </div>
  );
};

export default App;
