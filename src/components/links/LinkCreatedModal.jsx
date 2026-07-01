import { useState } from "react";

const LinkCreatedModal = ({ link, onClose }) => {
     const [copied, setCopied] = useState(false);

     if (!link) return null;

     const handleCopy = () => {
          navigator.clipboard.writeText(link.shortLink);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
     };

     return (
          <div
               className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-bg/70 backdrop-blur-sm"
               onClick={(e) => e.target === e.currentTarget && onClose()}
          >
               <div className="w-full max-w-[420px] bg-panel border border-border rounded-2xl p-7 flex flex-col gap-5">
                    {/* Header */}
                    <div className="flex items-start justify-between">
                         <div className="flex flex-col gap-1">
                              <h2 className="text-[16px] font-bold text-text">
                                   Link created ✓
                              </h2>
                              <p className="text-sm text-muted">
                                   Your short link is ready to share.
                              </p>
                         </div>
                         <button
                              onClick={onClose}
                              className="text-muted hover:text-text transition-colors cursor-pointer mt-0.5"
                         >
                              <svg
                                   width="16"
                                   height="16"
                                   viewBox="0 0 24 24"
                                   fill="none"
                                   stroke="currentColor"
                                   strokeWidth="2"
                              >
                                   <path d="M18 6 6 18M6 6l12 12" />
                              </svg>
                         </button>
                    </div>

                    {/* Short URL */}
                    <div className="flex items-center gap-2 bg-panel-2 border border-border rounded-xl px-4 py-3">
                         <span className="flex-1 font-mono text-sm text-teal truncate">
                              {link.shortLink}
                         </span>
                         <button
                              onClick={handleCopy}
                              className="text-muted-2 hover:text-text transition-colors cursor-pointer flex-shrink-0 text-xs font-medium"
                         >
                              {copied ? "Copied ✓" : "Copy"}
                         </button>
                    </div>

                    {/* Destination */}
                    <div className="flex flex-col gap-1.5">
                         <span className="text-xs text-muted uppercase tracking-wide font-semibold">
                              Destination
                         </span>
                         <p className="text-sm text-muted-2 truncate font-mono">
                              {link.longUrl}
                         </p>
                    </div>

                    {/* Footer */}
                    <div className="flex gap-2.5 pt-1">
                         <button
                              onClick={handleCopy}
                              className="flex-1 bg-teal text-bg text-sm font-semibold py-2.5 rounded-lg hover:opacity-90 transition-opacity cursor-pointer"
                         >
                              {copied ? "Copied!" : "Copy link"}
                         </button>
                         <button
                              onClick={onClose}
                              className="flex-1 border border-border text-text text-sm font-semibold py-2.5 rounded-lg hover:border-muted-2 transition-colors cursor-pointer"
                         >
                              Done
                         </button>
                    </div>
               </div>
          </div>
     );
};

export default LinkCreatedModal;
