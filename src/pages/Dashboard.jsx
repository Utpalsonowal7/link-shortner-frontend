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
     fetchTopStats,
} from "../features/links/linkThunks";
import Sidebar from "../components/layout/Sidebar";
import Topbar from "../components/layout/Topbar";
import LinkRow from "../components/links/LinkRow";
import LinkCreatedModal from "../components/links/LinkCreatedModal";
import StatCard from "../components/ui/StatsCards.jsx";
import HighlightCard from "../components/ui/HighLightCard.jsx";
import TopLinkRow from "../components/links/TopLinksRow.jsx";
import { timeAgo } from "../utils/time.js";

const Dashboard = () => {
     useTitle("Dashboard — Snip");
     const dispatch = useDispatch();
     const {
          links,
          pagination,
          stats,
          topStats,
          loading,
          statsLoading,
          createLoading,
          clearError,
     } = useLinks();

     const [longUrl, setLongUrl] = useState("");
     const [customCode, setCustomCode] = useState("");
     const [createdLink, setCreatedLink] = useState(null);

     useEffect(() => {
          const longUrl = sessionStorage.getItem("pendingUrl");

          if (longUrl) {
               setLongUrl(longUrl);
               sessionStorage.removeItem("pendingUrl");
          }
     }, []);

     useEffect(() => {
          dispatch(fetchUserLinks({ page: 1, limit: 20 }));
          dispatch(fetchUserStats());
          dispatch(fetchTopStats());
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
     const maxClicks = Math.max(
          ...topStats?.top5Links?.map((link) => link.totalClicks),
          1,
     );
     console.log(topStats?.recent5Clikcs);
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

                         <div className="flex flex-col lg:flex-row gap-2">
                              <div className="bg-panel border border-border rounded-xl overflow-hidden w-[50%]">
                                   <div className="px-5 py-4 border-b border-border flex justify-between items-center">
                                        <h2 className="text-sm font-bold text-text">
                                             Top Links
                                        </h2>

                                        <h6 className="text-xs text-muted font-mono">
                                             by clikcs
                                        </h6>
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
                                                  Paste a URL above to create
                                                  your first short link and
                                                  start tracking clicks.
                                             </p>
                                        </div>
                                   ) : (
                                        <table className="w-full border-collapse">
                                             <thead>
                                                  <tr>
                                                       <th className=" text-left text-[11px] text-muted uppercase tracking-wide font-semibold px-5 py-3 border-b border-border">
                                                            Link
                                                       </th>
                                                       <th className=" text-left text-[11px] text-muted uppercase tracking-wide font-semibold px-5 py-3 border-b border-border">
                                                            ENGAGEMENTS
                                                       </th>

                                                       <th className="text-left text-[11px] text-muted uppercase tracking-wide font-semibold px-5 py-3 border-b border-border">
                                                            Clicks
                                                       </th>
                                                  </tr>
                                             </thead>

                                             <tbody>
                                                  {topStats?.top5Links?.map(
                                                       (link) => (
                                                            <TopLinkRow
                                                                 key={link.id}
                                                                 link={link}
                                                                 maxClicks={
                                                                      maxClicks
                                                                 }
                                                            />
                                                       ),
                                                  )}
                                             </tbody>
                                        </table>
                                   )}
                              </div>
                              <div className="bg-panel border border-border rounded-xl overflow-hidden w-[50%]">
                                   <div className="px-5 py-4 border-b border-border flex justify-between items-center">
                                        <h2 className="text-sm font-bold text-text">
                                             Recent clicks
                                        </h2>

                                        <h6 className="text-xs text-muted font-mono">
                                             live
                                        </h6>
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
                                                  Paste a URL above to create
                                                  your first short link and
                                                  start tracking clicks.
                                             </p>
                                        </div>
                                   ) : (
                                        <div className="divide-y divide-border">
                                             {topStats?.recent5Clikcs?.map(
                                                  (click) => (
                                                       <div
                                                            key={click.id}
                                                            className="grid grid-cols-[12px_140px_1fr_100px_70px] items-center gap-5 px-5 py-2"
                                                       >
                                                            <div className="flex justify-center">
                                                                 <span className="w-2 h-2 rounded-full bg-teal opacity-90" />
                                                            </div>

                                                            <div className="min-w-0">
                                                                 <div className="font-mono font-semibold text-teal text-[13px] truncate">
                                                                      /
                                                                      {
                                                                           click
                                                                                .link
                                                                                ?.shortCode
                                                                      }
                                                                 </div>

                                                                 <div className="mt-0.5 truncate text-[11px] text-muted">
                                                                      {click.referrer
                                                                           ? `via ${click.referrer}`
                                                                           : "direct"}
                                                                 </div>
                                                            </div>

                                                            <div className="truncate text-[13px] text-muted-2">
                                                                 📍{" "}
                                                                 {click.region &&
                                                                 click.country
                                                                      ? `${click.region}, ${click.country.slice(0, 2).toUpperCase()}`
                                                                      : click.country
                                                                             ?.slice(
                                                                                  0,
                                                                                  2,
                                                                             )
                                                                             .toUpperCase() ||
                                                                        click.region ||
                                                                        "Unknown"}
                                                            </div>

                                                            <div className="truncate text-right text-[13px] font-medium text-orange-400">
                                                                 {click.browser ||
                                                                      "Unknown"}
                                                            </div>

                                                            <div className="whitespace-nowrap text-right font-mono text-[12px] text-muted">
                                                                 {timeAgo(
                                                                      click.timestamp,
                                                                 )}
                                                            </div>
                                                       </div>
                                                  ),
                                             )}
                                        </div>
                                   )}
                              </div>
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
