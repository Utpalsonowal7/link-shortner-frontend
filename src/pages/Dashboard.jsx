import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import useLinks from "../hooks/useLinks";
import useTitle from "../hooks/useTitle";
import {
     fetchUserLinks,
     createLink,
     fetchUserStats,
} from "../features/links/linkThunks";
import Sidebar from "../components/layout/Sidebar";
import Topbar from "../components/layout/Topbar";
import LinkRow from "../components/links/LinkRow";
import LinkCreatedModal from "../components/links/LinkCreatedModal";

// ── Stat card with optional delta badge ──
const StatCard = ({ label, value, delta, loading }) => (
     <div className="bg-panel border border-border rounded-xl p-5">
          <div className="text-xs text-muted uppercase tracking-wider font-semibold mb-3">
               {label}
          </div>
          {loading ? (
               <div className="h-8 w-24 bg-panel-2 rounded-lg animate-pulse" />
          ) : (
               <div className="flex items-baseline gap-2.5">
                    <div className="font-mono text-[26px] font-semibold text-text leading-none">
                         {value ?? "—"}
                    </div>
                    {delta !== null && delta !== undefined && (
                         <span
                              className={`text-xs font-semibold ${delta >= 0 ? "text-teal" : "text-red"}`}
                         >
                              {delta >= 0 ? "▲" : "▼"} {Math.abs(delta)}
                              {typeof delta === "number" ? "%" : ""}
                         </span>
                    )}
               </div>
          )}
     </div>
);

// ── Today's highlight card ──
const HighlightCard = ({ label, icon, title, sub, loading }) => (
     <div className="bg-panel border border-border rounded-xl p-5">
          <div className="text-xs text-muted uppercase tracking-wider font-semibold mb-3">
               {label}
          </div>
          {loading ? (
               <div className="flex flex-col gap-2">
                    <div className="h-6 w-6 bg-panel-2 rounded animate-pulse" />
                    <div className="h-4 w-32 bg-panel-2 rounded animate-pulse" />
                    <div className="h-3 w-24 bg-panel-2 rounded animate-pulse" />
               </div>
          ) : title ? (
               <>
                    <div className="text-xl mb-1.5">{icon}</div>
                    <div className="font-mono text-sm font-bold text-text truncate">
                         {title}
                    </div>
                    <div className="text-xs text-teal mt-1 font-mono">
                         {sub}
                    </div>
               </>
          ) : (
               <div className="text-sm text-muted mt-2">No data yet</div>
          )}
     </div>
);

const Dashboard = () => {
     useTitle("Dashboard — Snip");
     const dispatch = useDispatch();
     const {
          links,
          pagination,
          stats,
          loading,
          statsLoading,
          createLoading,
          clearError,
     } = useLinks();

     const [longUrl, setLongUrl] = useState("");
     const [customCode, setCustomCode] = useState("");
     const [createdLink, setCreatedLink] = useState(null);

     useEffect(() => {
          dispatch(fetchUserLinks({ page: 1, limit: 20 }));
          dispatch(fetchUserStats());
     }, [dispatch]);

     const refetch = () => {
          dispatch(fetchUserLinks({ page: 1, limit: 20 }));
          dispatch(fetchUserStats());
     };

     const handleCreate = async (e) => {
          e.preventDefault();
          if (!longUrl) return;

          const res = await dispatch(
               createLink({
                    longUrl,
                    ...(customCode && { customCode }),
               }),
          );

          if (res.meta.requestStatus === "fulfilled") {
               setCreatedLink(res.payload);
               setLongUrl("");
               setCustomCode("");
               refetch();
          } else {
               toast.error(res.payload || "Failed to create link");
          }
     };

     const handleDelete = async (id) => {
          const res = await dispatch(deleteLink(id));
          if (res.meta.requestStatus === "fulfilled") {
               toast.success("Link deleted");
               refetch();
          } else {
               toast.error("Failed to delete link");
          }
     };

     const h = stats?.highlights;

     return (
          <div className="flex min-h-screen bg-bg">
               <Sidebar />

               <main className="flex-1 min-w-0 ml-60">
                    <Topbar
                         title="Dashboard"
                         crumb="overview / all time"
                         actions={
                              <button className="w-9 h-9 rounded-lg bg-panel-2 border border-border flex items-center justify-center text-muted-2 hover:text-text hover:border-muted-2 transition-colors">
                                   <svg
                                        width="16"
                                        height="16"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                   >
                                        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                                        <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                                   </svg>
                              </button>
                         }
                    />

                    <div className="px-8 py-7 flex flex-col gap-6">
                         {/* Stat cards */}
                         <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
                              <StatCard
                                   label="Total Clicks"
                                   value={stats?.totalClicks?.toLocaleString()}
                                   delta={null}
                                   loading={statsLoading}
                              />
                              <StatCard
                                   label="Active Links"
                                   value={stats?.activeLinks}
                                   delta={null}
                                   loading={statsLoading}
                              />
                              <StatCard
                                   label="Clicks Today"
                                   value={stats?.clicksToday?.toLocaleString()}
                                   delta={stats?.deltas?.clicksToday}
                                   loading={statsLoading}
                              />
                              <StatCard
                                   label="Links This Month"
                                   value={stats?.linksThisMonth}
                                   delta={stats?.deltas?.linksThisMonth}
                                   loading={statsLoading}
                              />
                         </div>

                         {/* Create bar */}
                         <form
                              onSubmit={handleCreate}
                              className="bg-panel border border-border rounded-xl p-3 flex gap-2.5 items-center flex-col sm:flex-row"
                         >
                              <input
                                   type="url"
                                   required
                                   placeholder="https://your-long-url.com/goes-here"
                                   value={longUrl}
                                   onChange={(e) => {
                                        clearError();
                                        setLongUrl(e.target.value);
                                   }}
                                   className="flex-1 w-full bg-panel-2 border border-border rounded-lg px-3.5 py-2.5 text-sm font-mono text-text placeholder:text-muted placeholder:font-sans outline-none focus:border-teal transition-colors"
                              />
                              <input
                                   type="text"
                                   placeholder="custom-alias (optional)"
                                   value={customCode}
                                   onChange={(e) =>
                                        setCustomCode(e.target.value)
                                   }
                                   className="w-full sm:w-[200px] bg-panel-2 border border-border rounded-lg px-3.5 py-2.5 text-sm font-mono text-text placeholder:text-muted placeholder:font-sans outline-none focus:border-teal transition-colors"
                              />
                              <button
                                   type="submit"
                                   disabled={createLoading || !longUrl}
                                   className="w-full sm:w-auto bg-teal text-bg text-sm font-semibold px-5 py-2.5 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap cursor-pointer"
                              >
                                   {createLoading ? (
                                        <span className="flex items-center gap-2 justify-center">
                                             <span className="w-3.5 h-3.5 border-2 border-bg/30 border-t-bg rounded-full animate-spin" />
                                             Creating...
                                        </span>
                                   ) : (
                                        "Snip it"
                                   )}
                              </button>
                         </form>

                         {/* Today's highlights */}
                         <div>
                              <h2 className="text-xs text-muted uppercase tracking-wider font-semibold mb-3">
                                   Today's Highlights
                              </h2>
                              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
                                   <HighlightCard
                                        label="Top Link"
                                        icon="🔗"
                                        title={h?.topLink?.shortUrl}
                                        sub={
                                             h?.topLink
                                                  ? `${h.topLink.clicksToday} clicks today`
                                                  : null
                                        }
                                        loading={statsLoading}
                                   />
                                   <HighlightCard
                                        label="Top Country"
                                        icon="🌍"
                                        title={h?.topCountry?.name}
                                        sub={
                                             h?.topCountry
                                                  ? `${h.topCountry.percent}% of today's clicks`
                                                  : null
                                        }
                                        loading={statsLoading}
                                   />
                                   <HighlightCard
                                        label="Top Referrer"
                                        icon="↗"
                                        title={h?.topReferrer?.name}
                                        sub={
                                             h?.topReferrer
                                                  ? `${h.topReferrer.percent}% of today's clicks`
                                                  : null
                                        }
                                        loading={statsLoading}
                                   />
                                   <HighlightCard
                                        label="Top Device / OS"
                                        icon="📱"
                                        title={h?.topDevice?.name}
                                        sub={
                                             h?.topDevice
                                                  ? `${h.topDevice.percent}% of today's clicks`
                                                  : null
                                        }
                                        loading={statsLoading}
                                   />
                              </div>
                         </div>

                         {/* Links table */}
                         <div className="bg-panel border border-border rounded-xl overflow-hidden">
                              <div className="px-5 py-4 border-b border-border flex justify-between items-center">
                                   <h2 className="text-sm font-bold text-text">
                                        Your links
                                   </h2>
                                   {!loading && (
                                        <span className="text-xs text-muted font-mono">
                                             {pagination.total} total
                                        </span>
                                   )}
                              </div>

                              {loading ? (
                                   <div className="flex flex-col divide-y divide-border">
                                        {[...Array(4)].map((_, i) => (
                                             <div
                                                  key={i}
                                                  className="px-5 py-4 flex items-center gap-4"
                                             >
                                                  <div className="flex-1 flex flex-col gap-2">
                                                       <div className="h-3.5 w-36 bg-panel-2 rounded animate-pulse" />
                                                       <div className="h-3 w-56 bg-panel-2 rounded animate-pulse" />
                                                  </div>
                                                  <div className="h-3.5 w-12 bg-panel-2 rounded animate-pulse" />
                                                  <div className="h-5 w-16 bg-panel-2 rounded-md animate-pulse" />
                                                  <div className="h-3.5 w-10 bg-panel-2 rounded animate-pulse" />
                                             </div>
                                        ))}
                                   </div>
                              ) : links.length === 0 ? (
                                   <div className="flex flex-col items-center text-center py-16 px-5">
                                        <div className="w-12 h-12 rounded-xl bg-panel-2 border border-border flex items-center justify-center mb-4 text-muted">
                                             <svg
                                                  width="22"
                                                  height="22"
                                                  viewBox="0 0 24 24"
                                                  fill="none"
                                                  stroke="currentColor"
                                                  strokeWidth="2"
                                             >
                                                  <path d="M10 13a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1 1" />
                                                  <path d="M14 11a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1-1" />
                                             </svg>
                                        </div>
                                        <h3 className="text-text font-bold text-[15px] mb-1.5">
                                             No links yet
                                        </h3>
                                        <p className="text-muted text-sm max-w-[280px] leading-relaxed">
                                             Paste a URL above to create your
                                             first short link and start tracking
                                             clicks.
                                        </p>
                                   </div>
                              ) : (
                                   <table className="w-full border-collapse">
                                        <thead>
                                             <tr>
                                                  <th className="text-left text-[11px] text-muted uppercase tracking-wide font-semibold px-5 py-3 border-b border-border">
                                                       Link
                                                  </th>
                                                  <th className="text-left text-[11px] text-muted uppercase tracking-wide font-semibold px-5 py-3 border-b border-border">
                                                       Created
                                                  </th>
                                                  <th className="text-left text-[11px] text-muted uppercase tracking-wide font-semibold px-5 py-3 border-b border-border">
                                                       Status
                                                  </th>
                                                  <th className="text-left text-[11px] text-muted uppercase tracking-wide font-semibold px-5 py-3 border-b border-border">
                                                       Clicks
                                                  </th>
                                                  <th className="px-5 py-3 border-b border-border"></th>
                                             </tr>
                                        </thead>
                                        <tbody>
                                             {links.map((link) => (
                                                  <LinkRow
                                                       key={link.id}
                                                       link={link}
                                                       onDelete={handleDelete}
                                                  />
                                             ))}
                                        </tbody>
                                   </table>
                              )}
                         </div>
                    </div>
               </main>

               <LinkCreatedModal
                    link={createdLink}
                    onClose={() => setCreatedLink(null)}
               />
          </div>
     );
};

export default Dashboard;
