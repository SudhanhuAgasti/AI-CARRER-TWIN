import React, { useState } from 'react';
import { CalendarRange, ChevronDown, ChevronUp, CheckSquare, Square, ExternalLink, Award } from 'lucide-react';
import confetti from 'canvas-confetti';

/**
 * RoadmapTimeline Component (Tailwind CSS v4)
 * Displays an interactive weekly curriculum modules list with collapsible nodes,
 * checkboxes, progress tracking, and celebratory triggers.
 */
export default function RoadmapTimeline({ roadmapData }) {
  const { summary, estimatedWeeks, weeks = [] } = roadmapData;
  const [expandedWeeks, setExpandedWeeks] = useState(new Set([1])); // Default expand week 1
  const [completedItems, setCompletedItems] = useState({}); // Stores state of checked items per week

  const toggleExpand = (weekNum) => {
    setExpandedWeeks((prev) => {
      const next = new Set(prev);
      if (next.has(weekNum)) {
        next.delete(weekNum);
      } else {
        next.add(weekNum);
      }
      return next;
    });
  };

  const handleToggleItem = (weekNum, itemKey) => {
    setCompletedItems((prev) => {
      const weekState = prev[weekNum] || {};
      const nextState = !weekState[itemKey];
      
      const updatedWeekState = { ...weekState, [itemKey]: nextState };
      const updatedAll = { ...prev, [weekNum]: updatedWeekState };

      // Check if all items in this week are completed
      const weekObj = weeks.find(w => w.weekNumber === weekNum);
      if (weekObj) {
        const totalItemsCount = (weekObj.topics || []).length + 1; // topics + 1 practicalTask
        const checkedItemsCount = Object.values(updatedWeekState).filter(Boolean).length;

        if (checkedItemsCount === totalItemsCount && nextState === true) {
          // Trigger confetti celebration on completing the week module
          confetti({
            particleCount: 80,
            spread: 60,
            origin: { y: 0.7 }
          });
        }
      }

      return updatedAll;
    });
  };

  // Calculate overall learning progress percentage
  const calculateTotalProgress = () => {
    let totalItems = 0;
    let completedItemsCount = 0;

    weeks.forEach((w) => {
      const topicsCount = (w.topics || []).length;
      totalItems += topicsCount + 1; // topics + 1 practical task

      const weekState = completedItems[w.weekNumber] || {};
      completedItemsCount += Object.values(weekState).filter(Boolean).length;
    });

    return totalItems > 0 ? Math.round((completedItemsCount / totalItems) * 100) : 0;
  };

  const progressPercentage = calculateTotalProgress();

  return (
    <div className="flex flex-col gap-6 w-full text-left">
      
      {/* Summary Description Panel */}
      <div className="bg-slate-900/40 backdrop-blur-md border border-white/5 rounded-2xl p-6 md:p-8 shadow-2xl shadow-black/50">
        <div className="flex justify-between items-start flex-col sm:flex-row gap-4 mb-4">
          <div className="flex items-center gap-2">
            <CalendarRange className="w-5 h-5 text-violet-400" />
            <h3 className="font-sans text-lg font-bold text-slate-50">Personalized Learning Roadmap</h3>
          </div>
          <span className="bg-violet-500/10 border border-violet-500/20 text-violet-400 text-xs font-bold px-3.5 py-1.5 rounded-full font-sans uppercase">
            {estimatedWeeks} Weeks Course Plan
          </span>
        </div>
        <p className="text-sm text-slate-400 leading-relaxed mb-6">
          {summary}
        </p>

        {/* Global Progress Indicator */}
        <div className="flex flex-col gap-2">
          <div className="flex justify-between text-xs font-semibold uppercase tracking-wider text-slate-300">
            <span>Roadmap Completion</span>
            <span className="text-cyan-400">{progressPercentage}%</span>
          </div>
          <div className="w-full bg-white/5 border border-white/5 h-2.5 rounded-full overflow-hidden">
            <div 
              className="bg-gradient-to-r from-violet-500 to-cyan-500 h-full rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Week Timeline Accordion List */}
      <div className="flex flex-col gap-4">
        {weeks.map((week) => {
          const isExpanded = expandedWeeks.has(week.weekNumber);
          const weekState = completedItems[week.weekNumber] || {};
          
          // Calculate individual week module progress
          const totalTopics = (week.topics || []).length;
          const completedTopicsCount = (week.topics || []).filter((_, idx) => weekState[`topic-${idx}`]).length;
          const taskCompleted = !!weekState['task'];
          const isWeekFinished = completedTopicsCount === totalTopics && taskCompleted;

          return (
            <div 
              key={week.weekNumber} 
              className={`bg-slate-900/40 border rounded-2xl overflow-hidden transition-all duration-300
                ${isWeekFinished ? 'border-emerald-500/20 bg-slate-900/50' : 'border-white/5 hover:border-white/10'}`}
            >
              
              {/* Accordion Trigger Header */}
              <div 
                className="flex justify-between items-center p-5 cursor-pointer hover:bg-white/2 transition-colors select-none"
                onClick={() => toggleExpand(week.weekNumber)}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-sans font-bold text-xs border
                    ${isWeekFinished 
                      ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
                      : 'bg-white/3 border-white/8 text-slate-300'
                    }`}
                  >
                    W{week.weekNumber}
                  </div>
                  <div>
                    <h4 className="font-sans font-bold text-sm text-slate-100">{week.theme}</h4>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Estimated Time: {week.estimatedHours || week.estimatedHours === 0 ? week.estimatedHours : 14} Hours
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {isWeekFinished && (
                    <Award className="w-5 h-5 text-emerald-400 shrink-0" />
                  )}
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4 text-slate-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  )}
                </div>
              </div>

              {/* Accordion Collapsed Content Panel */}
              {isExpanded && (
                <div className="border-t border-white/5 p-5 flex flex-col gap-5 bg-black/10">
                  
                  {/* Topics Checklist Section */}
                  <div className="flex flex-col gap-2.5">
                    <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Topics to Study</span>
                    <div className="flex flex-col gap-2">
                      {week.topics.map((topic, idx) => {
                        const isChecked = !!weekState[`topic-${idx}`];
                        return (
                          <div 
                            key={idx} 
                            className="flex items-start gap-3 cursor-pointer group"
                            onClick={() => handleToggleItem(week.weekNumber, `topic-${idx}`)}
                          >
                            {isChecked ? (
                              <CheckSquare className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                            ) : (
                              <Square className="w-4 h-4 text-slate-500 group-hover:text-slate-300 shrink-0 mt-0.5" />
                            )}
                            <span className={`text-sm ${isChecked ? 'text-slate-400 line-through' : 'text-slate-200'}`}>
                              {topic}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Practical Milestone Task Box */}
                  <div className="bg-white/2 border border-white/5 rounded-xl p-4 flex flex-col gap-2">
                    <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Weekly Project Milestone</span>
                    <div 
                      className="flex items-start gap-3 cursor-pointer group"
                      onClick={() => handleToggleItem(week.weekNumber, 'task')}
                    >
                      {taskCompleted ? (
                        <CheckSquare className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      ) : (
                        <Square className="w-4 h-4 text-slate-500 group-hover:text-slate-300 shrink-0 mt-0.5" />
                      )}
                      <span className={`text-sm font-sans font-semibold ${taskCompleted ? 'text-slate-400 line-through' : 'text-slate-200'}`}>
                        {week.practicalTask}
                      </span>
                    </div>
                  </div>

                  {/* Learning Materials Section */}
                  {week.learningResources && week.learningResources.length > 0 && (
                    <div className="flex flex-col gap-2">
                      <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Recommended Study Materials</span>
                      <div className="flex flex-wrap gap-2">
                        {week.learningResources.map((resName, idx) => (
                          <a 
                            key={idx}
                            href={`https://www.google.com/search?q=${encodeURIComponent(resName)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-white/2 border border-white/5 hover:bg-white/5 hover:border-white/10 text-slate-300 px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all"
                          >
                            <span>{resName}</span>
                            <ExternalLink className="w-3 h-3 text-slate-500" />
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                </div>
              )}

            </div>
          );
        })}
      </div>

    </div>
  );
}
