import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import useLinks from "../hooks/useLinks";
import useTitle from "../hooks/useTitle";
import { fetchLinkAnalytics, deleteLink } from "../features/links/linkThunks";
import Sidebar from "../components/layout/Sidebar";
import Topbar from "../components/layout/Topbar";
import StatCard from "../components/ui/StatsCards.jsx";
import Toggle from "../components/ui/Toggle.jsx";
import BreakdownRow from "../components/ui/BreakdownRow.jsx";
import BarChart from "../components/ui/BarChart.jsx";
import QRPlaceholder from "../components/links/QRPlaceHolder.jsx";
import DonutChart from "../components/ui/PiChart.jsx";
import DonutSkeleton from "../components/ui/DonutSkeleton.jsx";

const LinkDetail = () => {
     const { id } = useParams();
     const dispatch = useDispatch();
     const navigate = useNavigate();
     const { analytics, analyticsLoading, topStats } = useLinks();
     const [range, setRange] = useState("7d");
     const [copied, setCopied] = useState(false);
     const [toggling, setToggling] = useState(false);
console.log(analytics);
     useTitle(
          analytics?.link
               ? `${analytics.link.shortCode} — Snip`
               : "Link — Snip",
     );

     useEffect(() => {
          dispatch(fetchLinkAnalytics({ id, range }));
     }, [dispatch, id, range]);

     const handleCopy = () => {
          navigator.clipboard.writeText(analytics?.link?.shortUrl || "");
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
     };

     const handleToggleActive = async () => {
          setToggling(true);
          const res = await dispatch(
               updateLink({
                    id,
                    data: { isActive: !analytics?.link?.isActive },
               }),
          );
          if (res.meta.requestStatus === "fulfilled") {
               toast.success(
                    analytics?.link?.isActive
                         ? "Link paused"
                         : "Link activated",
               );
               dispatch(fetchLinkAnalytics({ id, range }));
          } else {
               toast.error("Failed to update link");
          }
          setToggling(false);
     };

     const handleDelete = async () => {
          if (!confirm("Delete this link? This can't be undone.")) return;
          const res = await dispatch(deleteLink(Number(id)));
          if (res.meta.requestStatus === "fulfilled") {
               toast.success("Link deleted");
               navigate("/links");
          } else {
               toast.error("Failed to delete link");
          }
     };

     const link = analytics?.link;
     const timeSeries = analytics?.timeSeries ?? [];
     console.log(timeSeries);
     const totalClicks = analytics?.totalClicks ?? 0;
     const clicksToday = analytics?.clicksToday ?? 0;
     const avgPerDay = analytics?.avgPerDay ?? 0;
     const uniqueCountries = analytics?.uniqueCountries ?? 0;
     const byCountry = analytics?.clicksByCountry ?? [];
     const byDevice = analytics?.clicksByDevice ?? [];
     const byOs = analytics?.clicksByOs ?? [];
     const byContinent = analytics?.clicksByContinent ?? [];
     const recent = topStats?.recent5Clikcs ?? [];

     // referrer from recentClicks
     const referrerMap = {};
     recent.forEach((c) => {
          const ref = c.referrer || "Direct";
          referrerMap[ref] = (referrerMap[ref] || 0) + 1;
     });
     const byReferrer = Object.entries(referrerMap)
          .map(([name, count]) => ({ name, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 5);

     const isExpired = link?.expiresAt && new Date(link.expiresAt) < new Date();
     const isActive = link?.isActive && !isExpired;

     const deviceColors = {
          mobile: "bg-teal",
          desktop: "bg-amber",
          tablet: "bg-muted-2",
     };
     const osColors = {
          ios: "bg-teal",
          android: "bg-green-400",
          windows: "bg-amber",
          macos: "bg-muted-2",
     };
     const continentColors = [
          "bg-teal",
          "bg-amber",
          "bg-red",
          "bg-muted-2",
          "bg-muted",
     ];

     return (
          <div className="flex min-h-screen bg-bg">
               <Sidebar />

               <main className="flex-1 min-w-0 ml-60">
                    <Topbar
                         title="Link detail"
                         crumb={
                              link ? `links / ${link.shortCode}` : "links / ..."
                         }
                         actions={
                              <div className="flex gap-2">
                                   <button
                                        onClick={handleCopy}
                                        className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold border border-border rounded-lg text-muted-2 hover:text-text hover:border-muted-2 transition-colors cursor-pointer"
                                   >
                                        ⧉ {copied ? "Copied!" : "Copy"}
                                   </button>
                                   <button
                                        onClick={handleDelete}
                                        className="px-3.5 py-2 text-xs font-semibold border border-border rounded-lg text-muted-2 hover:text-red hover:border-red/30 transition-colors cursor-pointer"
                                   >
                                        ⋯
                                   </button>
                              </div>
                         }
                    />

                    <div className="px-8 py-6 flex flex-col gap-5">
                         {/* Back */}
                         <Link
                              to="/links"
                              className="inline-flex items-center gap-1.5 text-sm text-muted-2 hover:text-text transition-colors w-fit"
                         >
                              ← Back to all links
                         </Link>

                         {/* Link meta card */}
                         <div className="bg-panel border border-border rounded-xl p-5">
                              {analyticsLoading && !link ? (
                                   <div className="flex flex-col gap-2">
                                        <div className="h-5 w-48 bg-panel-2 rounded animate-pulse" />
                                        <div className="h-4 w-72 bg-panel-2 rounded animate-pulse" />
                                   </div>
                              ) : (
                                   <>
                                        <div className="flex items-start justify-between gap-4 mb-3">
                                             <div>
                                                  <div className="font-mono text-teal text-[15px] font-bold mb-1">
                                                       {link?.shortUrl}
                                                  </div>
                                                  <div className="text-muted text-xs">
                                                       → {link?.longUrl}
                                                  </div>
                                             </div>
                                             <div className="flex gap-2 flex-shrink-0">
                                                  <button
                                                       onClick={handleCopy}
                                                       className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold border border-border rounded-lg text-muted-2 hover:text-text transition-colors cursor-pointer"
                                                  >
                                                       ⧉{" "}
                                                       {copied
                                                            ? "Copied!"
                                                            : "Copy"}
                                                  </button>
                                                  <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold border border-border rounded-lg text-muted-2 hover:text-text transition-colors cursor-pointer">
                                                       👁 Preview
                                                  </button>
                                                  <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-teal text-bg rounded-lg hover:opacity-90 transition-opacity cursor-pointer">
                                                       Edit
                                                  </button>
                                             </div>
                                        </div>

                                        {/* Meta strip */}
                                        <div className="flex items-center gap-4 text-xs flex-wrap mb-4">
                                             <div className="flex items-center gap-1.5">
                                                  <span className="text-muted uppercase tracking-wide font-semibold">
                                                       Status
                                                  </span>
                                                  <span
                                                       className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md font-semibold ${isActive ? "bg-teal/10 text-teal" : "bg-red/10 text-red"}`}
                                                  >
                                                       <span className="w-1.5 h-1.5 rounded-full bg-current" />
                                                       {isActive
                                                            ? "active"
                                                            : isExpired
                                                              ? "expired"
                                                              : "paused"}
                                                  </span>
                                             </div>
                                             <div className="flex items-center gap-1.5">
                                                  <span className="text-muted uppercase tracking-wide font-semibold">
                                                       Created
                                                  </span>
                                                  <span className="text-text font-medium">
                                                       {link?.createdAt
                                                            ? new Date(
                                                                   link.createdAt,
                                                              ).toLocaleDateString(
                                                                   "en-US",
                                                                   {
                                                                        month: "short",
                                                                        day: "numeric",
                                                                        year: "numeric",
                                                                   },
                                                              )
                                                            : "—"}
                                                  </span>
                                             </div>
                                             <div className="flex items-center gap-1.5">
                                                  <span className="text-muted uppercase tracking-wide font-semibold">
                                                       Expires
                                                  </span>
                                                  <span
                                                       className={`font-medium ${isExpired ? "text-red" : "text-text"}`}
                                                  >
                                                       {link?.expiresAt
                                                            ? new Date(
                                                                   link.expiresAt,
                                                              ).toLocaleDateString(
                                                                   "en-US",
                                                                   {
                                                                        month: "short",
                                                                        day: "numeric",
                                                                        year: "numeric",
                                                                   },
                                                              )
                                                            : "Never"}
                                                  </span>
                                             </div>
                                             <div className="flex items-center gap-1.5">
                                                  <span className="text-muted uppercase tracking-wide font-semibold">
                                                       Total Clicks
                                                  </span>
                                                  <span className="text-text font-mono font-semibold">
                                                       {totalClicks.toLocaleString()}
                                                  </span>
                                             </div>
                                             {link?.tags?.length > 0 && (
                                                  <div className="flex items-center gap-1.5">
                                                       <span className="text-muted uppercase tracking-wide font-semibold">
                                                            Tags
                                                       </span>
                                                       {link.tags.map((t) => (
                                                            <span
                                                                 key={t}
                                                                 className="bg-teal/10 text-teal px-2 py-0.5 rounded-md font-semibold"
                                                            >
                                                                 {t}
                                                            </span>
                                                       ))}
                                                  </div>
                                             )}
                                        </div>

                                        {/* Toggle */}
                                        <div className="flex items-center gap-2.5 pt-3 border-t border-border">
                                             <Toggle
                                                  checked={!!link?.isActive}
                                                  onChange={handleToggleActive}
                                                  disabled={
                                                       toggling || isExpired
                                                  }
                                             />
                                             <span className="text-sm text-muted-2">
                                                  Link is{" "}
                                                  <span className="text-text font-medium">
                                                       {link?.isActive
                                                            ? "Active"
                                                            : "Paused"}
                                                  </span>{" "}
                                                  — Toggle to{" "}
                                                  {link?.isActive
                                                       ? "pause"
                                                       : "resume"}{" "}
                                                  all redirects
                                             </span>
                                        </div>
                                   </>
                              )}
                         </div>

                         {/* Stat cards */}
                         <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
                              <StatCard
                                   label="Total Clicks"
                                   value={totalClicks.toLocaleString()}
                                   delta={null}
                              />
                              <StatCard
                                   label="Clicks Today"
                                   value={clicksToday.toLocaleString()}
                                   delta={null}
                              />
                              <StatCard
                                   label="Avg / Day"
                                   value={avgPerDay.toLocaleString()}
                                   delta={null}
                              />
                              <StatCard
                                   label="Unique Countries"
                                   value={uniqueCountries}
                                   delta={null}
                              />
                         </div>

                         {/* Live click stream */}
                         {recent.length > 0 && (
                              <div className="bg-panel border border-border rounded-xl overflow-hidden">
                                   <div className="px-4 py-2.5 border-b border-border flex items-center gap-2 text-xs text-muted uppercase tracking-wider font-semibold">
                                        <span className="w-1.5 h-1.5 rounded-full bg-teal animate-pulse" />
                                        Live click stream
                                   </div>
                                   <div className="overflow-hidden">
                                        {recent.slice(0, 6).map((click, i) => (
                                             <div
                                                  key={i}
                                                  className="flex items-center gap-4 px-4 py-2 border-b border-border/50 last:border-0 font-mono text-xs text-muted-2"
                                             >
                                                  <span className="text-muted w-8 flex-shrink-0">
                                                       now
                                                  </span>
                                                  <span className="text-text w-32 flex-shrink-0 truncate">
                                                       📍{" "}
                                                       {[
                                                            click.city,
                                                            click.country,
                                                       ]
                                                            .filter(Boolean)
                                                            .join(", ") ||
                                                            "Unknown"}
                                                  </span>
                                                  <span className="text-amber w-28 flex-shrink-0 truncate">
                                                       {[click.device, click.os]
                                                            .filter(Boolean)
                                                            .join("/") || "—"}
                                                  </span>
                                                  <span className="flex-1 text-right truncate">
                                                       via{" "}
                                                       {click.referrer ||
                                                            "direct"}
                                                  </span>
                                             </div>
                                        ))}
                                   </div>
                              </div>
                         )}

                         {/* Charts row */}
                         <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr_auto] gap-4">
                              {/* Bar chart */}
                              <div className="bg-panel border border-border rounded-xl p-5">
                                   <div className="flex justify-between items-start mb-4">
                                        <div>
                                             <div className="text-xs text-muted uppercase tracking-wide font-semibold">
                                                  Clicks over time
                                             </div>
                                             <div className="font-mono text-2xl font-semibold text-text mt-1">
                                                  {totalClicks.toLocaleString()}
                                             </div>
                                        </div>
                                        <div className="flex gap-1 bg-panel-2 rounded-lg p-1">
                                             {["24h", "7d", "30d"].map((r) => (
                                                  <button
                                                       key={r}
                                                       onClick={() =>
                                                            setRange(r)
                                                       }
                                                       className={`text-[11.5px] px-2.5 py-1 rounded-md font-semibold transition-colors cursor-pointer ${range === r ? "bg-bg text-text" : "text-muted hover:text-text"}`}
                                                  >
                                                       {r}
                                                  </button>
                                             ))}
                                        </div>
                                   </div>
                                   {analyticsLoading ? (
                                        <div className="h-36 bg-panel-2 rounded-lg animate-pulse" />
                                   ) : (
                                        <BarChart data={timeSeries} />
                                   )}
                              </div>

                              {/* Top countries */}
                              <div className="bg-panel border border-border rounded-xl p-5">
                                   <div className="text-xs text-muted uppercase tracking-wide font-semibold mb-4">
                                        Top Countries
                                   </div>
                                   {analyticsLoading ? (
                                        <DonutSkeleton />
                                   ) : byCountry.length === 0 ? (
                                        <div className="text-sm text-muted">
                                             No data yet
                                        </div>
                                   ) : (
                                        <DonutChart
                                             data={byCountry
                                                  .slice(0, 5)
                                                  .map((c) => ({
                                                       label: c.country,
                                                       count: c._count.country,
                                                  }))}
                                             total={totalClicks}
                                        />
                                   )}
                              </div>

                              {/* QR code */}
                              <div className="bg-panel border border-border rounded-xl p-5 w-full lg:w-52">
                                   <div className="text-xs text-muted uppercase tracking-wide font-semibold mb-4">
                                        QR Code
                                   </div>
                                   <QRPlaceholder url={link?.shortUrl} />
                              </div>
                         </div>

                         {/* Bottom row — device, OS, referrers, continent */}
                         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              {/* Device type */}
                              <div className="bg-panel border border-border rounded-xl p-5">
                                   <div className="text-xs text-muted uppercase tracking-wide font-semibold mb-4">
                                        Device Type
                                   </div>
                                   {byDevice.length === 0 ? (
                                        <div className="text-sm text-muted">
                                             No data yet
                                        </div>
                                   ) : (
                                        byDevice.map((d) => (
                                             <BreakdownRow
                                                  key={d.device}
                                                  label={
                                                       d.device
                                                            ? d.device
                                                                   .charAt(0)
                                                                   .toUpperCase() +
                                                              d.device.slice(1)
                                                            : "Unknown"
                                                  }
                                                  count={d._count.device}
                                                  total={totalClicks}
                                                  dotColor={
                                                       deviceColors[
                                                            d.device?.toLowerCase()
                                                       ] || "bg-muted-2"
                                                  }
                                             />
                                        ))
                                   )}
                              </div>

                              {/* Operating system */}
                              <div className="bg-panel border border-border rounded-xl p-5">
                                   <div className="text-xs text-muted uppercase tracking-wide font-semibold mb-4">
                                        Operating System
                                   </div>
                                   {byOs.length === 0 ? (
                                        <div className="text-sm text-muted">
                                             No data yet
                                        </div>
                                   ) : (
                                        byOs.map((o) => (
                                             <BreakdownRow
                                                  key={o.os}
                                                  label={o.os}
                                                  count={o._count.os}
                                                  total={totalClicks}
                                                  dotColor={
                                                       osColors[
                                                            o.os?.toLowerCase()
                                                       ] || "bg-muted-2"
                                                  }
                                             />
                                        ))
                                   )}
                              </div>

                              {/* Top referrers */}
                              <div className="bg-panel border border-border rounded-xl p-5">
                                   <div className="text-xs text-muted uppercase tracking-wide font-semibold mb-4">
                                        Top Referrers
                                   </div>
                                   {byReferrer.length === 0 ? (
                                        <div className="text-sm text-muted">
                                             No data yet
                                        </div>
                                   ) : (
                                        byReferrer.map((r) => (
                                             <BreakdownRow
                                                  key={r.name}
                                                  label={r.name}
                                                  count={r.count}
                                                  total={recent.length}
                                                  dotColor="bg-teal"
                                             />
                                        ))
                                   )}
                              </div>

                              {/* By continent */}
                              <div className="bg-panel border border-border rounded-xl p-5">
                                   <div className="text-xs text-muted uppercase tracking-wide font-semibold mb-4">
                                        By Continent
                                   </div>
                                   {byContinent.length === 0 ? (
                                        <div className="text-sm text-muted">
                                             No data yet
                                        </div>
                                   ) : (
                                        byContinent.map((c, i) => (
                                             <BreakdownRow
                                                  key={c.continent}
                                                  label={c.continent}
                                                  count={c._count.continent}
                                                  total={totalClicks}
                                                  dotColor={
                                                       continentColors[i] ||
                                                       "bg-muted-2"
                                                  }
                                             />
                                        ))
                                   )}
                              </div>
                         </div>
                    </div>
               </main>
          </div>
     );
};

export default LinkDetail;
