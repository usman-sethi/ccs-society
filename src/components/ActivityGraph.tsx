import React, { useMemo } from 'react';
import { motion } from 'motion/react';

interface ActivityGraphProps {
  data?: { date: string; count: number }[];
  color?: string;
}

export default function ActivityGraph({ data = [], color = 'emerald' }: ActivityGraphProps) {
  // Generate 12 weeks of data (84 days)
  const weeks = 12;
  const daysPerWeek = 7;
  const totalDays = weeks * daysPerWeek;

  const graphData = useMemo(() => {
    const today = new Date();
    const result = [];
    
    // Create a map of provided data for quick lookup
    const dataMap = new Map(data.map(d => [d.date.split('T')[0], d.count]));

    for (let i = totalDays - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateString = date.toISOString().split('T')[0];
      
      // Use provided data or generate random data for visual effect if empty
      const count = dataMap.has(dateString) 
        ? dataMap.get(dateString)! 
        : (data.length === 0 && Math.random() > 0.7 ? Math.floor(Math.random() * 4) + 1 : 0);

      result.push({
        date: dateString,
        count,
        level: count === 0 ? 0 : count < 2 ? 1 : count < 4 ? 2 : count < 6 ? 3 : 4
      });
    }

    // Group into weeks
    const weeksArray = [];
    for (let i = 0; i < weeks; i++) {
      weeksArray.push(result.slice(i * daysPerWeek, (i + 1) * daysPerWeek));
    }
    return weeksArray;
  }, [data]);

  const getColorClass = (level: number) => {
    if (level === 0) return 'bg-white/[0.02] border-white/[0.05]';
    
    const colors: Record<string, string[]> = {
      emerald: [
        'bg-emerald-900/40 border-emerald-800/50',
        'bg-emerald-700/60 border-emerald-600/50',
        'bg-emerald-500/80 border-emerald-400/50',
        'bg-emerald-400 border-emerald-300/50'
      ],
      indigo: [
        'bg-indigo-900/40 border-indigo-800/50',
        'bg-indigo-700/60 border-indigo-600/50',
        'bg-indigo-500/80 border-indigo-400/50',
        'bg-indigo-400 border-indigo-300/50'
      ]
    };

    return colors[color][level - 1] || colors[color][3];
  };

  return (
    <div className="w-full overflow-x-auto pb-2">
      <div className="flex gap-1.5 min-w-max">
        {graphData.map((week, weekIndex) => (
          <div key={weekIndex} className="flex flex-col gap-1.5">
            {week.map((day, dayIndex) => (
              <motion.div
                key={day.date}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ 
                  delay: (weekIndex * 0.02) + (dayIndex * 0.01), 
                  duration: 0.3 
                }}
                className={`w-3.5 h-3.5 rounded-[3px] border ${getColorClass(day.level)} transition-colors duration-300 hover:border-white/40 cursor-help relative group`}
              >
                {/* Tooltip */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-[#111111] border border-white/10 rounded text-[10px] text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                  {day.count} contributions on {day.date}
                </div>
              </motion.div>
            ))}
          </div>
        ))}
      </div>
      <div className="flex items-center justify-end gap-2 mt-3 text-[10px] text-[#888888]">
        <span>Less</span>
        <div className="flex gap-1">
          <div className={`w-3 h-3 rounded-[2px] border ${getColorClass(0)}`} />
          <div className={`w-3 h-3 rounded-[2px] border ${getColorClass(1)}`} />
          <div className={`w-3 h-3 rounded-[2px] border ${getColorClass(2)}`} />
          <div className={`w-3 h-3 rounded-[2px] border ${getColorClass(3)}`} />
          <div className={`w-3 h-3 rounded-[2px] border ${getColorClass(4)}`} />
        </div>
        <span>More</span>
      </div>
    </div>
  );
}
