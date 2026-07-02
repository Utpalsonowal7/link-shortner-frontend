const HighlightCard = ({ label, icon, title, sub, loading }) => (
     <div className="bg-panel border border-border rounded-xl p-5">
          <div className="text-xs text-muted uppercase tracking-wider font-semibold mb-3">
               {label}
          </div>
          {loading ? (
               <div className="flex flex-col gap-2">
                    <div className="h-6 w-6 bg-panel-2 rounded animate-pulse" />
                    <div className="h-4 w-32 bg-panel-2 rounded animate-pulse" />
                    <div className="h-3 w-24 bg-panel-2 rounded animate-pulse" />
               </div>
          ) : title ? (
               <>
                    <div className="text-xl mb-1.5">{icon}</div>
                    <div className="font-mono text-sm font-bold text-text truncate">
                         {title}
                    </div>
                    <div className="text-xs text-teal mt-1 font-mono">
                         {sub}
                    </div>
               </>
          ) : (
               <div className="text-sm text-muted mt-2">No data yet</div>
          )}
     </div>
);

export default HighlightCard;
