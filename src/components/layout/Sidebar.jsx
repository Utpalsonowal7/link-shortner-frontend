import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import useAuth from "../../hooks/useAuth";
import { logoutUser } from "../../features/auth/authThunks";
import toast from "react-hot-toast";

const navItems = [
     {
          to: "/dashboard",
          label: "Dashboard",
          icon: (
               <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
               >
                    <rect x="3" y="3" width="7" height="9" rx="1" />
                    <rect x="14" y="3" width="7" height="5" rx="1" />
                    <rect x="14" y="12" width="7" height="9" rx="1" />
                    <rect x="3" y="16" width="7" height="5" rx="1" />
               </svg>
          ),
     },
     {
          to: "/links",
          label: "All links",
          icon: (
               <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
               >
                    <path d="M10 13a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1 1" />
                    <path d="M14 11a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1-1" />
               </svg>
          ),
     },
     {
          to: "/settings",
          label: "Settings",
          icon: (
               <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
               >
                    <circle cx="12" cy="12" r="3" />
                    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
               </svg>
          ),
     },
];

const Sidebar = () => {
     const { pathname } = useLocation();
     const { user } = useAuth();

     const dispatch = useDispatch();
     const navigate = useNavigate();

     const handleLogout = async () => {
          await dispatch(logoutUser());
          navigate("/login");
          toast.success("Logged out");
     };

     return (
          <aside className=" fixed w-60 border-r border-border p-3.5 flex flex-col flex-shrink-0 bg-panel min-h-screen">
               <div className="flex items-center gap-2.5 px-2 pt-1.5 pb-5.5">
                    <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-teal to-[#2DD4BF] flex items-center justify-center text-bg font-extrabold text-sm">
                         S
                    </div>
                    <span className="font-bold text-lg tracking-tight">
                         Snip
                    </span>
               </div>

               <nav className="flex flex-col gap-0.5">
                    {navItems.map((item) => {
                         const isActive =
                              pathname === item.to ||
                              (item.to !== "/dashboard" &&
                                   pathname.startsWith(item.to));
                         return (
                              <Link
                                   key={item.to}
                                   to={item.to}
                                   className={`flex items-center gap-2.75 px-3 py-2.25 rounded-md text-sm font-medium transition-colors ${
                                        isActive
                                             ? "bg-panel-2 text-teal"
                                             : "text-muted-2 hover:bg-panel-2 hover:text-text"
                                   }`}
                              >
                                   <span
                                        className={`w-4 h-4 flex-shrink-0 ${isActive ? "opacity-100" : "opacity-80"}`}
                                   >
                                        {item.icon}
                                   </span>
                                   {item.label}
                              </Link>
                         );
                    })}
               </nav>

               <div className="mt-auto pt-3.5 border-t border-border">
                    <div className="flex items-center gap-2.5 p-2 rounded-lg">
                         {user?.avatar ? (
                              <img
                                   src={user.avatar}
                                   alt={user.name}
                                   className="w-7.5 h-7.5 rounded-full object-cover flex-shrink-0"
                              />
                         ) : (
                              <div className="w-7.5 h-7.5 rounded-full bg-gradient-to-br from-amber to-[#FB923C] flex items-center justify-center text-[12px] font-bold text-[#2A1503] flex-shrink-0">
                                   {user?.name?.charAt(0).toUpperCase() || "U"}
                              </div>
                         )}
                         <div className="flex-1 min-w-0">
                              <div className="text-[13px] font-semibold text-text truncate">
                                   {user?.name}
                              </div>
                              <div className="text-[11px] text-muted">
                                   {user?.plan === "PREMIUM"
                                        ? "Premium plan"
                                        : "Free plan"}
                              </div>
                         </div>
                         <button
                              onClick={handleLogout}
                              title="Sign out"
                              className="w-7 h-7 flex items-center justify-center rounded-md text-muted hover:text-red hover:bg-red/10 transition-colors cursor-pointer flex-shrink-0"
                         >
                              <svg
                                   width="14"
                                   height="14"
                                   viewBox="0 0 24 24"
                                   fill="none"
                                   stroke="currentColor"
                                   strokeWidth="2"
                              >
                                   <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                                   <polyline points="16 17 21 12 16 7" />
                                   <line x1="21" y1="12" x2="9" y2="12" />
                              </svg>
                         </button>
                    </div>
               </div>
          </aside>
     );
};

export default Sidebar;
