const DonutSkeleton = () => (
     <div className="flex items-center gap-5">
          {/* Donut skeleton */}
          <div className="w-[140px] h-[140px] rounded-full flex-shrink-0 relative">
               <div className="w-full h-full rounded-full bg-panel-2 animate-pulse" />
               {/* inner circle cutout illusion */}
               <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-[68px] h-[68px] rounded-full bg-panel" />
               </div>
          </div>

          {/* Legend skeleton */}
          <div className="flex flex-col gap-3 flex-1">
               {[...Array(4)].map((_, i) => (
                    <div key={i} className="flex items-center gap-2">
                         <div className="w-2 h-2 rounded-sm bg-panel-2 animate-pulse flex-shrink-0" />
                         <div
                              className="h-3 bg-panel-2 rounded animate-pulse flex-1"
                              style={{ width: `${70 - i * 12}%` }}
                         />
                         <div className="w-7 h-3 bg-panel-2 rounded animate-pulse flex-shrink-0" />
                    </div>
               ))}
          </div>
     </div>
);

export default DonutSkeleton;
