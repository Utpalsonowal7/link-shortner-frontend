import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import useTitle from "../hooks/useTitle";
import toast from "react-hot-toast";
import api from "../lib/axios";

const formatStat = (n) => {
     if (n === null || n === undefined) return "—";
     if (n >= 1_000_000)
          return (n / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
     if (n >= 1_000) return (n / 1_000).toFixed(1).replace(/\.0$/, "") + "K";
     return n.toLocaleString();
};

const Landing = () => {
     useTitle("Snip — Link Analytics");
     const { user } = useAuth();
     const navigate = useNavigate();
     const [demoUrl, setDemoUrl] = useState("");
     const [stats, setStats] = useState(null);

   
     useEffect(() => {
          if (user) {
               navigate("/dashboard", { replace: true });
          }
     }, [user, navigate]);

     useEffect(() => {
          console.log("fetching data at app mount.....");
          api.get("/stats")
               .then((res) => setStats(res.data.data))
               .catch(() => setStats(null));
     }, []);

     const handleDemoSubmit = (e) => {
          e.preventDefault();

          if (!demoUrl) {
               toast.error("Please enter a url");
               return;
          }

          try {
               new URL(demoUrl);
               sessionStorage.setItem("pendingUrl", demoUrl)
               navigate("/register");
          } catch (error) {
               toast.error("Invalid url type");
          }
     };

     return (
          <div className="min-h-screen bg-bg flex flex-col">

               <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-bg/80 backdrop-blur-xl">
                    <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-5">
                         <div className="flex items-center gap-2.5 font-bold text-lg tracking-tight">
                              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-teal to-[#2DD4BF] flex items-center justify-center text-bg font-extrabold text-sm">
                                   S
                              </div>
                              Snip
                         </div>

                         <div className="hidden sm:flex items-center gap-8 text-sm">
                              <a
                                   href="#features"
                                   className="text-muted-2 hover:text-text transition-colors font-medium"
                              >
                                   Product
                              </a>
                              <a
                                   href="#features"
                                   className="text-muted-2 hover:text-text transition-colors font-medium"
                              >
                                   Features
                              </a>
                              <Link
                                   to="/login"
                                   className="text-muted-2 hover:text-text transition-colors font-medium"
                              >
                                   Log in
                              </Link>
                              <Link
                                   to="/register"
                                   className="bg-teal text-bg px-4.5 py-2.5 rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity"
                              >
                                   Sign up free
                              </Link>
                         </div>

                         <Link
                              to="/register"
                              className="sm:hidden bg-teal text-bg px-4 py-2 rounded-lg text-sm font-semibold"
                         >
                              Sign up
                         </Link>
                    </div>
               </nav>

             
               <div className="flex-1">
                  
                    <div className="px-6 pt-32 pb-14 max-w-[980px] mx-auto text-center">
                         <div className="flex items-center justify-center gap-2 text-teal text-xs font-mono uppercase tracking-[0.12em] mb-5">
                              <span className="w-1.5 h-1.5 rounded-full bg-teal shadow-[0_0_0_4px_rgba(94,234,212,0.15)]" />
                              Real-time click analytics
                         </div>

                         <h1 className="text-4xl sm:text-[56px] leading-[1.08] font-extrabold tracking-tight mb-5">
                              Short links.
                              <br />
                              <span className="text-muted-2">
                                   Full visibility on every click.
                              </span>
                         </h1>

                         <p className="text-[17px] text-muted-2 max-w-[560px] mx-auto mb-9 leading-relaxed">
                              Shorten any URL and see exactly who clicked it —
                              location, device, browser, and referrer, updated
                              the moment it happens.
                         </p>

                         <div className="flex gap-3 justify-center mb-16">
                              <Link
                                   to="/register"
                                   className="bg-teal text-bg px-5 py-2.5 rounded-lg text-sm font-semibold hover:opacity-90 hover:-translate-y-0.5 transition-all"
                              >
                                   Start for free
                              </Link>
                              <Link
                                   to="/login"
                                   className="border border-border text-text px-5 py-2.5 rounded-lg text-sm font-semibold hover:border-muted-2 transition-colors"
                              >
                                   Log in
                              </Link>
                         </div>

                       
                         <form
                              onSubmit={handleDemoSubmit}
                              className="max-w-[640px] mx-auto bg-panel border border-border rounded-xl p-1.5 flex gap-1.5 mb-6"
                         >
                              <input
                                   type="text"
                                   placeholder="Paste a long URL — https://example.com/your/very/long/path"
                                   value={demoUrl}
                                   onChange={(e) => setDemoUrl(e.target.value)}
                                   className="flex-1 bg-transparent border-none text-text px-4 py-3 text-sm font-mono placeholder:text-muted placeholder:font-sans outline-none min-w-0"
                              />
                              <button
                                   type="submit"
                                   className="bg-teal text-bg px-5 py-2.5 rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity whitespace-nowrap"
                              >
                                   Shorten
                              </button>
                         </form>

                         <p className="text-xs text-muted mb-20">
                              No credit card required. Free plan included.
                         </p>
                    </div>

                
                    <div
                         id="features"
                         className="max-w-[980px] mx-auto px-6 pb-24"
                    >
                         <div className="text-center mb-10">
                              <div className="text-teal text-xs font-mono uppercase tracking-[0.12em] mb-3">
                                   Why Snip
                              </div>
                              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                                   Built for people who care about the data
                              </h2>
                              <p className="text-muted-2 text-sm mt-3 max-w-md mx-auto">
                                   Most shorteners stop at the click count. We
                                   don't.
                              </p>
                         </div>

                         <div className="grid sm:grid-cols-3 gap-px bg-border border border-border rounded-xl overflow-hidden">
                              <div className="bg-panel p-8">
                                   <div className="font-mono text-teal text-xs mb-3.5">
                                        01
                                   </div>
                                   <h3 className="font-bold text-[16px] mb-2">
                                        Sub-50ms redirects
                                   </h3>
                                   <p className="text-[13.5px] text-muted-2 leading-relaxed">
                                        Every short link is cached at the edge,
                                        so the redirect happens before the click
                                        event even finishes logging.
                                   </p>
                              </div>
                              <div className="bg-panel p-8">
                                   <div className="font-mono text-teal text-xs mb-3.5">
                                        02
                                   </div>
                                   <h3 className="font-bold text-[16px] mb-2">
                                        Geo + device breakdown
                                   </h3>
                                   <p className="text-[13.5px] text-muted-2 leading-relaxed">
                                        See country, region, device type, and
                                        browser for every single click — no
                                        sampling, no estimates.
                                   </p>
                              </div>
                              <div className="bg-panel p-8">
                                   <div className="font-mono text-teal text-xs mb-3.5">
                                        03
                                   </div>
                                   <h3 className="font-bold text-[16px] mb-2">
                                        Live click stream
                                   </h3>
                                   <p className="text-[13.5px] text-muted-2 leading-relaxed">
                                        Watch clicks land in real time as they
                                        happen, with location and device, right
                                        from your dashboard.
                                   </p>
                              </div>
                         </div>
                    </div>

                   
                    <div className="max-w-[980px] mx-auto px-6 pb-24">
                         <div className="text-center mb-8">
                              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                                   Trusted at scale
                              </h2>
                              <p className="text-muted-2 text-sm mt-2">
                                   Real numbers, updated live.
                              </p>
                         </div>
                         <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                              <div className="bg-panel border border-border rounded-xl p-6 text-center">
                                   <div className="text-xs text-muted uppercase tracking-wide font-semibold mb-3">
                                        People using Snip
                                   </div>
                                   <div className="font-mono text-3xl sm:text-4xl font-bold text-teal">
                                        {formatStat(stats?.totalUsers)}
                                   </div>
                              </div>
                              <div className="bg-panel border border-border rounded-xl p-6 text-center">
                                   <div className="text-xs text-muted uppercase tracking-wide font-semibold mb-3">
                                        Links shortened
                                   </div>
                                   <div className="font-mono text-3xl sm:text-4xl font-bold text-teal">
                                        {formatStat(stats?.totalLinks)}
                                   </div>
                              </div>
                              <div className="bg-panel border border-border rounded-xl p-6 text-center">
                                   <div className="text-xs text-muted uppercase tracking-wide font-semibold mb-3">
                                        Clicks tracked
                                   </div>
                                   <div className="font-mono text-3xl sm:text-4xl font-bold text-teal">
                                        {formatStat(stats?.totalClicks)}
                                   </div>
                              </div>
                         </div>
                    </div>

                    
                    <div className="max-w-[980px] mx-auto px-6 py-24 text-center">
                         <h2 className="text-3xl sm:text-[42px] font-extrabold tracking-tight mb-4">
                              Ready to see where your clicks come from?
                         </h2>
                         <p className="text-muted-2 text-[15px] mb-8 max-w-md mx-auto">
                              Create your first short link in under a minute. No
                              credit card needed.
                         </p>
                         <Link
                              to="/register"
                              className="inline-block bg-teal text-bg px-6 py-3 rounded-lg text-sm font-semibold hover:opacity-90 hover:-translate-y-0.5 transition-all"
                         >
                              Get started free
                         </Link>
                    </div>
               </div>

              
               <footer className="border-t border-border">
                    <div className="max-w-7xl mx-auto px-6 py-14">
                         <div className="grid sm:grid-cols-[1.4fr_1fr_1fr_1fr] gap-10 mb-12">
                              {/* Brand column */}
                              <div>
                                   <div className="flex items-center gap-2.5 font-bold text-lg tracking-tight mb-3">
                                        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-teal to-[#2DD4BF] flex items-center justify-center text-bg font-extrabold text-sm">
                                             S
                                        </div>
                                        Snip
                                   </div>
                                   <p className="text-sm text-muted-2 leading-relaxed max-w-[260px]">
                                        Short links with full visibility — geo,
                                        device, and referrer data on every
                                        click, in real time.
                                   </p>
                              </div>

                              <div>
                                   <h4 className="text-xs font-semibold text-muted uppercase tracking-wide mb-4">
                                        Product
                                   </h4>
                                   <ul className="flex flex-col gap-3 text-sm text-muted-2">
                                        <li>
                                             <a
                                                  href="#features"
                                                  className="hover:text-text transition-colors"
                                             >
                                                  Features
                                             </a>
                                        </li>
                                        <li>
                                             <Link
                                                  to="/register"
                                                  className="hover:text-text transition-colors"
                                             >
                                                  Pricing
                                             </Link>
                                        </li>
                                        <li>
                                             <Link
                                                  to="/register"
                                                  className="hover:text-text transition-colors"
                                             >
                                                  Sign up
                                             </Link>
                                        </li>
                                        <li>
                                             <Link
                                                  to="/login"
                                                  className="hover:text-text transition-colors"
                                             >
                                                  Log in
                                             </Link>
                                        </li>
                                   </ul>
                              </div>

                              <div>
                                   <h4 className="text-xs font-semibold text-muted uppercase tracking-wide mb-4">
                                        Company
                                   </h4>
                                   <ul className="flex flex-col gap-3 text-sm text-muted-2">
                                        <li>
                                             <a
                                                  href="#"
                                                  className="hover:text-text transition-colors"
                                             >
                                                  About
                                             </a>
                                        </li>
                                        <li>
                                             <a
                                                  href="#"
                                                  className="hover:text-text transition-colors"
                                             >
                                                  Blog
                                             </a>
                                        </li>
                                        <li>
                                             <a
                                                  href="#"
                                                  className="hover:text-text transition-colors"
                                             >
                                                  Contact
                                             </a>
                                        </li>
                                   </ul>
                              </div>

                      
                              <div>
                                   <h4 className="text-xs font-semibold text-muted uppercase tracking-wide mb-4">
                                        Legal
                                   </h4>
                                   <ul className="flex flex-col gap-3 text-sm text-muted-2">
                                        <li>
                                             <a
                                                  href="#"
                                                  className="hover:text-text transition-colors"
                                             >
                                                  Privacy policy
                                             </a>
                                        </li>
                                        <li>
                                             <a
                                                  href="#"
                                                  className="hover:text-text transition-colors"
                                             >
                                                  Terms of service
                                             </a>
                                        </li>
                                   </ul>
                              </div>
                         </div>

                         <div className="border-t border-border pt-6 flex flex-col sm:flex-row justify-between items-center gap-3">
                              <p className="text-xs text-muted">
                                   © {new Date().getFullYear()} Snip. All rights
                                   reserved.
                              </p>
                              <p className="text-xs text-muted font-mono">
                                   {formatStat(stats?.totalLinks)} links ·{" "}
                                   {formatStat(stats?.totalClicks)} clicks
                                   tracked
                              </p>
                         </div>
                    </div>
               </footer>
          </div>
     );
};

export default Landing;
