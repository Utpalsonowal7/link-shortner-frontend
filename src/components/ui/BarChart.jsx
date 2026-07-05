const BarChart = ({ data }) => {
     if (!data?.length)
          return (
               <div className="h-36 flex items-center justify-center text-muted text-sm">
                    No data yet
               </div>
          );

     const max = Math.max(...data.map((d) => d.count), 1);
     const BAR_MAX_HEIGHT = 112; // px — leaves room for label below

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
                              className="flex-1 flex flex-col items-center gap-1.5 justify-end"
                              style={{ height: "144px" }}
                         >
                              <div
                                   className="w-full bg-gradient-to-t from-teal/40 to-teal rounded-sm transition-all duration-500"
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
