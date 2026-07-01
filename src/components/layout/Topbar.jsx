const Topbar = ({ title, crumb, actions }) => {
     return (
          <div className="flex justify-between items-center px-8 py-4.5 border-b border-border">
               <div>
                    <h1 className="text-xl font-bold tracking-tight">
                         {title}
                    </h1>
                    {crumb && (
                         <div className="text-xs text-muted font-mono mt-0.5">
                              {crumb}
                         </div>
                    )}
               </div>
               {actions && (
                    <div className="flex items-center gap-2.5">{actions}</div>
               )}
          </div>
     );
};

export default Topbar;
