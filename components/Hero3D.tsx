
import React from 'react';
import { motion } from 'framer-motion';

interface Hero3DProps {
  onEnter: () => void;
}

export const Hero3D: React.FC<Hero3DProps> = ({ onEnter }) => {
  return (
    <div className="h-screen w-full flex flex-col items-center justify-center overflow-hidden relative bg-[#e3e0cf]">
      {/* Background Desk Elements */}
      <div className="absolute inset-0 bg-[#d4c5a9] opacity-80" 
           style={{ backgroundImage: 'radial-gradient(#b0a080 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
      </div>
      
      {/* Static ambient background elements to reduce paint cost */}
      <div className="absolute top-10 right-10 w-48 h-48 rounded-full border-[15px] border-[#8a6d3b] opacity-10 blur-sm transform rotate-45 scale-y-90 pointer-events-none"></div>
      
      {/* 3D Book - Simplified Animation */}
      <motion.div
        initial={{ y: -20, rotateX: 10, rotateY: -10 }}
        animate={{ y: 0 }}
        transition={{ 
          duration: 3, 
          repeat: Infinity, 
          repeatType: "reverse",
          ease: "easeInOut" 
        }}
        className="relative w-[300px] h-[400px] md:w-[360px] md:h-[480px] cursor-pointer group perspective-1000"
        onClick={onEnter}
      >
        <div className="absolute inset-0 transform-style-3d transition-transform duration-700 group-hover:rotate-y-[-10deg] group-hover:scale-105">
            {/* Back Cover */}
            <div className="absolute inset-0 bg-[#3e2723] rounded-r-2xl shadow-2xl border-l-[10px] border-[#2d1b18] transform translate-x-2 translate-y-2"></div>
            
            {/* Pages Stack */}
            <div className="absolute inset-1 right-2 bg-white rounded-r-xl border-r border-gray-300 shadow-md"></div>
            
            {/* Front Cover */}
            <div 
              className="absolute inset-0 bg-[#2c3e50] rounded-r-2xl border-l-[12px] border-[#1a252f] flex flex-col items-center justify-center p-8 text-center shadow-xl"
            >
              <div className="border-2 border-dashed border-[#f1c40f] p-4 w-full h-full flex flex-col items-center justify-center rounded-lg relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-[#f1c40f]/20"></div>
                
                <h1 className="text-5xl md:text-6xl font-marker text-[#ecf0f1] mb-2 tracking-wide">
                  Execution<br/>Ledger
                </h1>
                <p className="text-[#95a5a6] font-hand text-xl mb-8 tracking-widest uppercase text-sm">Strict Daily Protocol</p>
                
                <div className="bg-[#f1c40f] text-[#2c3e50] font-bold py-3 px-8 rounded-sm shadow-lg hover:bg-[#f39c12] transition-colors flex items-center gap-2">
                  <span>OPEN LEDGER</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </div>
              </div>
              
              {/* Version Badge */}
              <div className="absolute top-6 right-6 bg-[#c0392b] text-white rounded-full w-12 h-12 flex items-center justify-center rotate-12 shadow-md font-bold text-xs font-mono border-2 border-[#a93226]">
                V2
              </div>
            </div>
        </div>
      </motion.div>

      <div className="absolute bottom-12 text-[#5d4037] font-hand text-xl opacity-60">
        Tap to verify your tasks
      </div>
    </div>
  );
};
