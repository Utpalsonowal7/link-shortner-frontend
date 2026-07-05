const BreakdownRow = ({ label, count, total, dotColor = "bg-teal" }) => {
     const percent = total ? Math.round((count / total) * 100) : 0;
     return (
          <div className="flex items-center gap-2.5 mb-3 last:mb-0">
               <span
                    className={`w-2 h-2 rounded-sm flex-shrink-0 ${dotColor}`}
               />
               <div className="w-24 text-[12.5px] text-text flex-shrink-0 truncate">
                    {label || "Unknown"}
               </div>
               <div className="flex-1 h-1.5 bg-panel-2 rounded-full overflow-hidden">
                    <div
                         className={`h-full ${dotColor} rounded-full transition-all duration-500`}
                         style={{ width: `${percent}%` }}
                    />
               </div>
               <div className="w-8 text-right font-mono text-xs text-muted-2 flex-shrink-0">
                    {percent}%
               </div>
          </div>
     );
};

export default BreakdownRow;
