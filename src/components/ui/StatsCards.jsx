const StatCard = ({ label, value, delta, loading }) => (
     <div className="bg-panel border border-border rounded-xl p-5">
          <div className="text-xs text-muted uppercase tracking-wider font-semibold mb-3">
               {label}
          </div>
          {loading ? (
               <div className="h-8 w-24 bg-panel-2 rounded-lg animate-pulse" />
          ) : (
               <div className="flex items-baseline gap-2.5">
                    <div className="font-mono text-[26px] font-semibold text-text leading-none">
                         {value ?? "—"}
                    </div>
                    {delta !== null && delta !== undefined && (
                         <span
                              className={`text-xs font-semibold ${delta >= 0 ? "text-teal" : "text-red"}`}
                         >
                              {delta >= 0 ? "▲" : "▼"} {Math.abs(delta)}
                              {typeof delta === "number" ? "%" : ""}
                         </span>
                    )}
               </div>
          )}
     </div>
);
export default StatCard;
