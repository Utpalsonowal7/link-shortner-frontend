import { useState } from "react";
import { useNavigate } from "react-router-dom";

const statusInfo = (link) => {
     if (!link.isActive)
          return { label: "paused", className: "bg-muted/10 text-muted-2" };
     if (link.expiresAt && new Date(link.expiresAt) < new Date())
          return { label: "expired", className: "bg-red/10 text-red" };
     return { label: "active", className: "bg-teal/10 text-teal" };
};

const LinkRow = ({ link, onDelete }) => {
     const navigate = useNavigate();
     const [copied, setCopied] = useState(false);

     const shortUrl = `${import.meta.env.VITE_SHORT_URL}${link.shortCode}`;
     const status = statusInfo(link);

     const handleCopy = (e) => {
          e.stopPropagation();
          navigator.clipboard.writeText(shortUrl);
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
     };

     const handleDelete = (e) => {
          e.stopPropagation();
          if (confirm(`Delete "${link.shortCode}"? This can't be undone.`)) {
               onDelete(link.id);
          }
     };

     return (
          <tr
               onClick={() => navigate(`/links/${link.id}`)}
               className="cursor-pointer hover:bg-panel-2 transition-colors"
          >
               <td className="px-5 py-3.5 border-b border-border">
                    <div className="text-teal font-mono font-semibold text-[13.5px]">
                         /{link.shortCode}
                    </div>
                    <div className="text-muted-2 text-xs mt-0.5 max-w-[280px] overflow-hidden text-ellipsis whitespace-nowrap">
                         {link.longUrl}
                    </div>
               </td>
               <td className="px-5 py-3.5 border-b border-border text-muted-2 text-[13.5px]">
                    {new Date(link.createdAt).toLocaleDateString("en-US", {
                         month: "short",
                         day: "numeric",
                    })}
               </td>
               <td className="px-5 py-3.5 border-b border-border">
                    <span
                         className={`inline-flex items-center gap-1.5 text-[11.5px] font-semibold px-2.5 py-1 rounded-md ${status.className}`}
                    >
                         <span className="w-1.5 h-1.5 rounded-full bg-current" />
                         {status.label}
                    </span>
               </td>
               <td className="px-5 py-3.5 border-b border-border font-mono font-semibold text-[13.5px] text-text">
                    {link.totalClicks.toLocaleString()}
               </td>
               <td className="px-5 py-3.5 border-b border-border">
                    <div className="flex gap-1.5 justify-end">
                         <button
                              onClick={handleCopy}
                              title={copied ? "Copied!" : "Copy"}
                              className="w-7 h-7 rounded-md flex items-center justify-center text-muted hover:text-text hover:bg-bg transition-colors cursor-pointer"
                         >
                              {copied ? "✓" : "⧉"}
                         </button>
                         <button
                              onClick={handleDelete}
                              title="Delete"
                              className="w-7 h-7 rounded-md flex items-center justify-center text-muted hover:text-red hover:bg-bg transition-colors cursor-pointer"
                         >
                              ✕
                         </button>
                    </div>
               </td>
          </tr>
     );
};

export default LinkRow;
