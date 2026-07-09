const BarChart = ({ data }) => {
     if (!data?.length)
          return (
               <div className="h-36 flex items-center justify-center text-muted text-sm">
                    No data yet
               </div>
          );

     const max = Math.max(...data.map((d) => d.count), 1);
     const BAR_MAX_HEIGHT = 112;

     return (
          <div className="flex items-end gap-1.5" style={{ height: "144px" }}>
               {data.map((d) => {
                    const barHeight = Math.max(
                         3,
                         Math.round((d.count / max) * BAR_MAX_HEIGHT),
                    );

                    return (
                         <div
                              key={d.date}
                              className="flex-1 flex flex-col items-center gap-1.5 justify-end group relative"
                              style={{ height: "144px" }}
                         >
                              
                              <div className="absolute bottom-full mb-1.5 left-1/2 -translate-x-1/2 bg-panel-2 border border-border rounded-lg px-2.5 py-1.5 text-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 whitespace-nowrap">
                                   <div className="font-mono text-sm font-semibold text-text">
                                        {d.count.toLocaleString()}
                                   </div>
                                   <div className="text-[10px] text-muted">
                                        {new Date(d.date).toLocaleDateString(
                                             "en-US",
                                             { month: "short", day: "numeric" },
                                        )}
                                   </div>
                              </div>

                             
                              <div
                                   className="w-full bg-gradient-to-t from-teal/40 to-teal rounded-sm transition-all duration-500 group-hover:to-teal group-hover:opacity-100 opacity-80"
                                   style={{ height: `${barHeight}px` }}
                              />

                             
                              <div className="text-[10px] text-muted font-mono flex-shrink-0">
                                   {new Date(d.date)
                                        .toLocaleDateString("en-US", {
                                             weekday: "short",
                                        })
                                        .slice(0, 3)}
                              </div>
                         </div>
                    );
               })}
          </div>
     );
};

export default BarChart;
