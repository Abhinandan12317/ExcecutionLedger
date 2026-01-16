
import React, { useMemo } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';
import { DailyRecord } from '../types';
import { fillDataGaps } from '../utils/dateUtils';

interface NotebookChartProps {
  data: DailyRecord[];
}

export const NotebookChart: React.FC<NotebookChartProps> = ({ data }) => {
  // Use useMemo to prevent expensive recalculation on every render
  const chartData = useMemo(() => fillDataGaps(data), [data]);

  if (data.length === 0) {
    return (
      <div className="h-64 flex flex-col items-center justify-center border-2 border-dashed border-pencil rounded-lg bg-paper-dark p-4 transform rotate-1 transition-all hover:rotate-0">
        <p className="font-marker text-pencil text-xl text-center animate-pulse">Waiting for Ink...</p>
        <p className="font-hand text-ink-black text-lg mt-2 text-center">Complete your first day to start the curve.</p>
      </div>
    );
  }

  return (
    <div className="relative h-72 w-full p-2 bg-white shadow-sm border border-gray-200 transform -rotate-1 transition-transform hover:rotate-0 duration-500">
      {/* Tape effect */}
      <div className="absolute -top-3 left-1/2 w-32 h-8 bg-[#ffffff80] border-l border-r border-[#ffffff40] rotate-2 transform -translate-x-1/2 shadow-sm backdrop-blur-sm z-10"></div>
      
      <p className="absolute top-2 left-4 font-marker text-xs text-pencil tracking-widest opacity-60">PERFORMANCE_LOG</p>
      
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={chartData}
          margin={{
            top: 20,
            right: 10,
            left: -20,
            bottom: 0,
          }}
        >
          <defs>
            <linearGradient id="inkGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#000080" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#000080" stopOpacity={0}/>
            </linearGradient>
            <pattern id="diagonalHatch" width="4" height="4" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
              <line x1="0" y1="0" x2="0" y2="4" style={{ stroke: '#000080', strokeWidth: 1, strokeOpacity: 0.1 }} />
            </pattern>
          </defs>
          
          <CartesianGrid strokeDasharray="3 3" stroke="#bdc3c7" vertical={false} strokeOpacity={0.5} />
          
          <XAxis 
            dataKey="date" 
            tick={{ fill: '#2c3e50', fontSize: 12, fontFamily: 'Patrick Hand' }} 
            axisLine={{ stroke: '#2c3e50', strokeWidth: 1.5 }}
            tickLine={false}
            tickFormatter={(value) => value.substring(5).replace('-', '/')}
            dy={10}
            minTickGap={30}
          />
          
          <YAxis 
            tick={{ fill: '#2c3e50', fontSize: 12, fontFamily: 'Patrick Hand' }} 
            axisLine={{ stroke: '#2c3e50', strokeWidth: 1.5 }}
            tickLine={false}
            tickCount={7}
            allowDecimals={false}
          />
          
          <Tooltip 
            cursor={{ stroke: '#c0392b', strokeWidth: 2, strokeDasharray: '5 5' }}
            contentStyle={{ 
              backgroundColor: '#fff9c4', 
              borderColor: '#2c3e50', 
              color: '#2c3e50',
              fontFamily: 'Patrick Hand',
              borderRadius: '2px',
              borderWidth: '2px',
              boxShadow: '4px 4px 0px rgba(0,0,0,0.1)',
              padding: '8px'
            }}
            labelStyle={{ color: '#7f8c8d', fontSize: '12px', marginBottom: '4px' }}
            itemStyle={{ color: '#000080', fontWeight: 'bold' }}
            formatter={(value) => [`${value} Tasks`, 'Score']}
            labelFormatter={(label) => `Date: ${label}`}
          />

          {/* Reference line for "Perfect Day" purely visual */}
          <ReferenceLine y={6} stroke="#c0392b" strokeDasharray="3 3" strokeOpacity={0.3} />
          
          <Area 
            type="monotone" 
            dataKey="dailyScore" 
            stroke="#000080" 
            strokeWidth={3}
            fill="url(#inkGradient)" 
            animationDuration={1500}
            animationEasing="ease-in-out"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
