const BarChart = ({ data }) => {
     if (!data?.length)
          return (
               <div className="h-36 flex items-center justify-center text-muted text-sm">
                    No data yet
               </div>
          );
     const max = Math.max(...data.map((d) => d.count), 1);
     return (
          <div className="flex items-end gap-1.5 h-36 pt-2">
               {data.map((d) => (
                    <div
                         key={d.date}
                         className="flex-1 flex flex-col items-center gap-1.5"
                    >
                         <div
                              className="w-full bg-gradient-to-t from-teal/40 to-teal rounded-sm min-h-[3px] transition-all duration-300"
                              style={{ height: `${(d.count / max) * 100}%` }}
                         />
                         <div className="text-[10px] text-muted font-mono">
                              {new Date(d.date)
                                   .toLocaleDateString("en-US", {
                                        weekday: "short",
                                   })
                                   .slice(0, 3)}
                         </div>
                    </div>
               ))}
          </div>
     );
};

export default BarChart;
