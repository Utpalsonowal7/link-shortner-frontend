const COLORS = ["#5EEAD4", "#F59E0B", "#F87171", "#94A0AE", "#6E7681"];

const DonutChart = ({ data, total }) => {
     if (!data?.length)
          return (
               <div className="flex items-center justify-center h-40 text-muted text-sm">
                    No data yet
               </div>
          );

     const size = 140;
     const cx = size / 2;
     const cy = size / 2;
     const r = 70;
     const innerR = 44;

     // ✅ single slice — SVG arc can't draw a full circle, use circle instead
     if (data.length === 1) {
          return (
               <div className="flex items-center gap-10">
                    <svg
                         width={size}
                         height={size}
                         viewBox={`0 0 ${size} ${size}`}
                         className="flex-shrink-0"
                    >
                         <circle
                              cx={cx}
                              cy={cy}
                              r={r}
                              fill={COLORS[0]}
                              opacity="0.9"
                         />
                         <circle
                              cx={cx}
                              cy={cy}
                              r={innerR}
                              fill="var(--color-panel)"
                         />
                         <text
                              x={cx}
                              y={cy - 6}
                              textAnchor="middle"
                              fill="#E8EAED"
                              fontSize="16"
                              fontWeight="600"
                              fontFamily="monospace"
                         >
                              {total?.toLocaleString()}
                         </text>
                         <text
                              x={cx}
                              y={cy + 10}
                              textAnchor="middle"
                              fill="#6E7681"
                              fontSize="9"
                              fontFamily="monospace"
                         >
                              total
                         </text>
                    </svg>
                    <div className="flex flex-col gap-2 flex-1 min-w-0">
                         <div className="flex items-center gap-2">
                              <span
                                   className="w-2 h-2 rounded-sm flex-shrink-0"
                                   style={{ background: COLORS[0] }}
                              />
                              <span className="text-[12px] text-text flex-1 truncate">
                                   {data[0].label || "Unknown"}
                              </span>
                              <span className="font-mono text-xs text-muted-2 flex-shrink-0">
                                   100%
                              </span>
                         </div>
                    </div>
               </div>
          );
     }

     let cumulativePercent = 0;

     const slices = data
          .map((d, i) => {
               const percent = total ? d.count / total : 0;
               const startPercent = cumulativePercent;
               cumulativePercent += percent;

               const startAngle = startPercent * 2 * Math.PI - Math.PI / 2;
               const endAngle = cumulativePercent * 2 * Math.PI - Math.PI / 2;

               const x1 = cx + r * Math.cos(startAngle);
               const y1 = cy + r * Math.sin(startAngle);
               const x2 = cx + r * Math.cos(endAngle);
               const y2 = cy + r * Math.sin(endAngle);

               const xi1 = cx + innerR * Math.cos(startAngle);
               const yi1 = cy + innerR * Math.sin(startAngle);
               const xi2 = cx + innerR * Math.cos(endAngle);
               const yi2 = cy + innerR * Math.sin(endAngle);

               const largeArc = percent > 0.5 ? 1 : 0;

               // ✅ skip tiny slices that cause NaN paths
               if (percent < 0.001) return null;

               const path = [
                    `M ${x1} ${y1}`,
                    `A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2}`,
                    `L ${xi2} ${yi2}`,
                    `A ${innerR} ${innerR} 0 ${largeArc} 0 ${xi1} ${yi1}`,
                    "Z",
               ].join(" ");

               return {
                    ...d,
                    path,
                    color: COLORS[i % COLORS.length],
                    percent: Math.round(percent * 100),
               };
          })
          .filter(Boolean); // ✅ remove null slices

     return (
          <div className="flex items-center gap-5">
               <svg
                    width={size}
                    height={size}
                    viewBox={`0 0 ${size} ${size}`}
                    className="flex-shrink-0"
               >
                    {slices.map((s, i) => (
                         <path
                              key={i}
                              d={s.path}
                              fill={s.color}
                              opacity="0.9"
                              className="hover:opacity-100 transition-opacity cursor-pointer"
                         >
                              <title>
                                   {s.label}: {s.percent}%
                              </title>
                         </path>
                    ))}
                    <text
                         x={cx}
                         y={cy - 6}
                         textAnchor="middle"
                         fill="#E8EAED"
                         fontSize="16"
                         fontWeight="600"
                         fontFamily="monospace"
                    >
                         {total?.toLocaleString()}
                    </text>
                    <text
                         x={cx}
                         y={cy + 10}
                         textAnchor="middle"
                         fill="#6E7681"
                         fontSize="9"
                         fontFamily="monospace"
                    >
                         total
                    </text>
               </svg>

               <div className="flex flex-col gap-2 flex-1 min-w-0">
                    {slices.map((s, i) => (
                         <div key={i} className="flex items-center gap-2">
                              <span
                                   className="w-2 h-2 rounded-sm flex-shrink-0"
                                   style={{ background: s.color }}
                              />
                              <span className="text-[12px] text-text flex-1 truncate">
                                   {s.label || "Unknown"}
                              </span>
                              <span className="font-mono text-xs text-muted-2 flex-shrink-0">
                                   {s.percent}%
                              </span>
                         </div>
                    ))}
               </div>
          </div>
     );
};

export default DonutChart;
