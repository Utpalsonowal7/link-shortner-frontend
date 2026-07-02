const TopLinkRow = ({ link, maxClicks }) => {

     const percentage = (link.totalClicks / maxClicks) * 100;

     return (
          <tr>
               <td className="px-4 py-2 border-b border-border">
                    <div className="text-teal font-mono font-semibold text-[13.5px]">
                         {import.meta.env.VITE_SHORT_CODE}/{link.shortCode}
                    </div>
                    <div className="text-muted-2 text-xs mt-0.5 max-w-[280px] overflow-hidden text-ellipsis whitespace-nowrap">
                         {new URL(link.longUrl).hostname.replace("www.", "") +
                              new URL(link.longUrl).pathname}
                    </div>
               </td>

               <td className="px-5 py-2 border-b border-border">
                    <div className="w-24 h-2 bg-panel-2 rounded-full overflow-hidden">
                         <div
                              className="h-full bg-teal rounded-full"
                              style={{ width: `${percentage}%` }}
                         />
                    </div>
               </td>
               <td className="px-5 py-2 border-b border-border font-mono font-semibold text-[13.5px] text-text">
                    {link.totalClicks.toLocaleString()}
               </td>
          </tr>
     );
};

export default TopLinkRow;
