import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import useLinks from "../hooks/useLinks";
import useTitle from "../hooks/useTitle";
import { fetchUserLinks, deleteLink } from "../features/links/linkThunks";
import Sidebar from "../components/layout/Sidebar";
import Topbar from "../components/layout/Topbar";
import LinkRow from "../components/links/LinkRow";

const Links = () => {
     useTitle("All Links — Snip");
     const dispatch = useDispatch();
     const navigate = useNavigate();
     const { links, pagination, loading, clearError } = useLinks();

     const [search, setSearch] = useState("");
     const [page, setPage] = useState(1);
     const [debouncedSearch, setDebouncedSearch] = useState("");

     useEffect(() => {
          const timer = setTimeout(() => setDebouncedSearch(search), 400);
          return () => clearTimeout(timer);
     }, [search]);

     useEffect(() => {
          dispatch(
               fetchUserLinks({
                    page,
                    limit: 20,
                    search: debouncedSearch || undefined,
               }),
          );
     }, [dispatch, page, debouncedSearch]);

     useEffect(() => {
          setPage(1);
     }, [debouncedSearch]);

     const handleDelete = async (id) => {
          const res = await dispatch(deleteLink(id));
          if (res.meta.requestStatus === "fulfilled") {
               toast.success("Link deleted");
               dispatch(
                    fetchUserLinks({
                         page,
                         limit: 20,
                         search: debouncedSearch || undefined,
                    }),
               );
          } else {
               toast.error("Failed to delete link");
          }
     };

     return (
          <div className="flex min-h-screen bg-bg">
               <Sidebar />

               <main className="flex-1 min-w-0 ml-60">
                    <Topbar
                         title="All Links"
                         crumb={`${pagination.total} total`}
                         actions={
                              <Link
                                   to="/dashboard"
                                   state={{ focus: "inputUrl" }}
                                   className="bg-teal text-bg text-sm font-semibold px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
                              >
                                   + New link
                              </Link>
                         }
                    />

                    <div className="px-8 py-7 flex flex-col gap-5">
                         <div className="relative">
                              <svg
                                   className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted"
                                   width="15"
                                   height="15"
                                   viewBox="0 0 24 24"
                                   fill="none"
                                   stroke="currentColor"
                                   strokeWidth="2"
                              >
                                   <circle cx="11" cy="11" r="8" />
                                   <path d="m21 21-4.35-4.35" />
                              </svg>
                              <input
                                   type="text"
                                   placeholder="Search by title, short code or URL..."
                                   value={search}
                                   onChange={(e) => {
                                        clearError();
                                        setSearch(e.target.value);
                                   }}
                                   className="w-full bg-panel border border-border rounded-xl pl-10 pr-4 py-2.5 text-sm text-text placeholder:text-muted outline-none focus:border-teal transition-colors"
                              />
                              {search && (
                                   <button
                                        onClick={() => setSearch("")}
                                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted hover:text-text transition-colors cursor-pointer"
                                   >
                                        ✕
                                   </button>
                              )}
                         </div>

                         <div className="bg-panel border border-border rounded-xl overflow-hidden">
                              <div className="px-5 py-4 border-b border-border flex justify-between items-center">
                                   <h2 className="text-sm font-bold text-text">
                                        {debouncedSearch
                                             ? `Results for "${debouncedSearch}"`
                                             : "Your links"}
                                   </h2>
                                   {!loading && (
                                        <span className="text-xs text-muted font-mono">
                                             {pagination.total}{" "}
                                             {pagination.total === 1
                                                  ? "link"
                                                  : "links"}
                                        </span>
                                   )}
                              </div>

                              {loading ? (
                                   <div className="flex flex-col divide-y divide-border">
                                        {[...Array(10)].map((_, i) => (
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
                                             {debouncedSearch
                                                  ? "No links match your search"
                                                  : "No links yet"}
                                        </h3>
                                        <p className="text-muted text-sm max-w-[280px] leading-relaxed">
                                             {debouncedSearch
                                                  ? "Try a different search term."
                                                  : "Head to the dashboard to create your first short link."}
                                        </p>
                                        {debouncedSearch && (
                                             <button
                                                  onClick={() => setSearch("")}
                                                  className="mt-4 text-teal text-sm font-medium hover:underline cursor-pointer"
                                             >
                                                  Clear search
                                             </button>
                                        )}
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

                              {!loading && pagination.totalPages > 1 && (
                                   <div className="px-5 py-4 border-t border-border flex items-center justify-between">
                                        <span className="text-xs text-muted font-mono">
                                             Page {pagination.page} of{" "}
                                             {pagination.totalPages}
                                        </span>
                                        <div className="flex gap-2">
                                             <button
                                                  onClick={() =>
                                                       setPage((p) =>
                                                            Math.max(1, p - 1),
                                                       )
                                                  }
                                                  disabled={
                                                       pagination.page === 1
                                                  }
                                                  className="px-3 py-1.5 text-xs font-medium bg-panel-2 border border-border rounded-lg text-muted-2 hover:text-text hover:border-muted-2 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                                             >
                                                  ← Prev
                                             </button>
                                             <button
                                                  onClick={() =>
                                                       setPage((p) =>
                                                            Math.min(
                                                                 pagination.totalPages,
                                                                 p + 1,
                                                            ),
                                                       )
                                                  }
                                                  disabled={
                                                       pagination.page ===
                                                       pagination.totalPages
                                                  }
                                                  className="px-3 py-1.5 text-xs font-medium bg-panel-2 border border-border rounded-lg text-muted-2 hover:text-text hover:border-muted-2 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                                             >
                                                  Next →
                                             </button>
                                        </div>
                                   </div>
                              )}
                         </div>
                    </div>
               </main>
          </div>
     );
};

export default Links;
