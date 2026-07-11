import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import useAuth from "../hooks/useAuth";
import useTitle from "../hooks/useTitle";
import api from "../lib/axios";
import { clearUser } from "../features/auth/authSlice";
import Sidebar from "../components/layout/Sidebar";
import Topbar from "../components/layout/Topbar";

const Toggle = ({ checked, onChange }) => (
     <button
          onClick={onChange}
          className={`w-9 h-5 rounded-full transition-colors duration-200 relative flex-shrink-0 cursor-pointer ${checked ? "bg-teal" : "bg-panel-2 border border-border"}`}
     >
          <span
               className={`absolute top-0.5 w-4 h-4 rounded-full transition-all duration-200 ${checked ? "left-4 bg-bg" : "left-0.5 bg-muted"}`}
          />
     </button>
);

const navItems = [
     "Account",
     "Security",
     "Notifications",
     "API Keys",
     "Billing",
];

const Settings = () => {
     useTitle("Settings — Snip");
     const dispatch = useDispatch();
     const navigate = useNavigate();
     const { user } = useAuth();

     const [activeSection, setActiveSection] = useState("Account");
     const [profileForm, setProfileForm] = useState({
          name: user?.name || "",
          email: user?.email || "",
     });
     const [passwordForm, setPasswordForm] = useState({
          oldPassword: "",
          newPassword: "",
          confirm: "",
     });
     const [profileLoading, setProfileLoading] = useState(false);
     const [passwordLoading, setPasswordLoading] = useState(false);
     const [deleteLoading, setDeleteLoading] = useState(false);
     const [matchError, setMatchError] = useState(null);

     const [prefs, setPrefs] = useState({
          weeklyAnalytics: true,
          clickAlerts: false,
          anonymizeIp: true,
     });

     const handleProfileSave = async (e) => {
          e.preventDefault();
          setProfileLoading(true);
          try {
               await api.patch("/auth/update-profile", profileForm);
               toast.success("Profile updated");
          } catch (err) {
               toast.error(
                    err.response?.data?.message || "Failed to update profile",
               );
          } finally {
               setProfileLoading(false);
          }
     };

     const handlePasswordChange = async (e) => {
          e.preventDefault();
          setMatchError(null);
          if (passwordForm.newPassword !== passwordForm.confirm) {
               setMatchError("Passwords do not match");
               return;
          }
          setPasswordLoading(true);
          try {
               await api.patch("/auth/change-password", {
                    oldPassword: passwordForm.oldPassword,
                    newPassword: passwordForm.newPassword,
               });
               toast.success("Password changed — please log in again");
               dispatch(clearUser());
               navigate("/login");
          } catch (err) {
               toast.error(
                    err.response?.data?.message || "Failed to change password",
               );
          } finally {
               setPasswordLoading(false);
          }
     };

     const handleDeleteAccount = async () => {
          if (
               !confirm(
                    "Are you sure? This permanently deletes your account and all link data. This cannot be undone.",
               )
          )
               return;
          setDeleteLoading(true);
          try {
               await api.delete("/auth/delete-account");
               dispatch(clearUser());
               navigate("/");
          } catch (err) {
               toast.error(
                    err.response?.data?.message || "Failed to delete account",
               );
          } finally {
               setDeleteLoading(false);
          }
     };

     const inputClass =
          "w-full bg-panel-2 border border-border rounded-lg px-3.5 py-2.5 text-sm text-text placeholder:text-muted outline-none focus:border-teal transition-colors";
     const labelClass = "block text-[12.5px] text-muted-2 font-medium mb-1.5";

     return (
          <div className="flex min-h-screen bg-bg">
               <Sidebar />

               <main className="flex-1 min-w-0">
                    <Topbar title="Settings" crumb="account / preferences" />

                    <div className="px-8 py-7">
                         <div className="grid grid-cols-[200px_1fr] gap-8 max-w-3xl">
                              {/* Left nav */}
                              <div className="flex flex-col gap-0.5">
                                   {navItems.map((item) => (
                                        <button
                                             key={item}
                                             onClick={() =>
                                                  setActiveSection(item)
                                             }
                                             className={`text-left px-3 py-2.5 rounded-lg text-[13.5px] font-medium transition-colors cursor-pointer ${
                                                  activeSection === item
                                                       ? "bg-panel-2 text-text"
                                                       : "text-muted-2 hover:text-text hover:bg-panel-2"
                                             }`}
                                        >
                                             {item}
                                        </button>
                                   ))}
                              </div>

                              {/* Right content */}
                              <div className="flex flex-col gap-8">
                                   {/* ── Account ── */}
                                   {activeSection === "Account" && (
                                        <>
                                             <div>
                                                  <h3 className="text-sm font-bold text-text mb-1">
                                                       Profile
                                                  </h3>
                                                  <p className="text-xs text-muted mb-4">
                                                       Update your name and
                                                       email address.
                                                  </p>

                                                  <form
                                                       onSubmit={
                                                            handleProfileSave
                                                       }
                                                       className="flex flex-col gap-4"
                                                  >
                                                       <div>
                                                            <label
                                                                 className={
                                                                      labelClass
                                                                 }
                                                            >
                                                                 Full name
                                                            </label>
                                                            <input
                                                                 type="text"
                                                                 value={
                                                                      profileForm.name
                                                                 }
                                                                 onChange={(
                                                                      e,
                                                                 ) =>
                                                                      setProfileForm(
                                                                           (
                                                                                p,
                                                                           ) => ({
                                                                                ...p,
                                                                                name: e
                                                                                     .target
                                                                                     .value,
                                                                           }),
                                                                      )
                                                                 }
                                                                 className={
                                                                      inputClass
                                                                 }
                                                            />
                                                       </div>
                                                       <div>
                                                            <label
                                                                 className={
                                                                      labelClass
                                                                 }
                                                            >
                                                                 Email address
                                                            </label>
                                                            <input
                                                                 type="email"
                                                                 value={
                                                                      profileForm.email
                                                                 }
                                                                 onChange={(
                                                                      e,
                                                                 ) =>
                                                                      setProfileForm(
                                                                           (
                                                                                p,
                                                                           ) => ({
                                                                                ...p,
                                                                                email: e
                                                                                     .target
                                                                                     .value,
                                                                           }),
                                                                      )
                                                                 }
                                                                 className={
                                                                      inputClass
                                                                 }
                                                            />
                                                       </div>
                                                       <div>
                                                            <button
                                                                 type="submit"
                                                                 disabled={
                                                                      profileLoading
                                                                 }
                                                                 className="bg-teal text-bg text-sm font-semibold px-4 py-2 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 cursor-pointer"
                                                            >
                                                                 {profileLoading
                                                                      ? "Saving..."
                                                                      : "Save changes"}
                                                            </button>
                                                       </div>
                                                  </form>
                                             </div>

                                             <div className="border-t border-border pt-8">
                                                  <h3 className="text-sm font-bold text-text mb-1">
                                                       Danger zone
                                                  </h3>
                                                  <p className="text-xs text-muted mb-4">
                                                       These actions are
                                                       permanent and cannot be
                                                       undone.
                                                  </p>
                                                  <div className="flex items-center justify-between py-3.5 border-b border-border">
                                                       <div>
                                                            <div className="text-[13.5px] font-medium text-text">
                                                                 Delete account
                                                            </div>
                                                            <div className="text-xs text-muted mt-0.5">
                                                                 Permanently
                                                                 remove your
                                                                 account and all
                                                                 link data
                                                            </div>
                                                       </div>
                                                       <button
                                                            onClick={
                                                                 handleDeleteAccount
                                                            }
                                                            disabled={
                                                                 deleteLoading
                                                            }
                                                            className="px-3.5 py-2 text-xs font-semibold border border-red/30 text-red rounded-lg hover:bg-red/10 transition-colors cursor-pointer disabled:opacity-50"
                                                       >
                                                            {deleteLoading
                                                                 ? "Deleting..."
                                                                 : "Delete account"}
                                                       </button>
                                                  </div>
                                             </div>
                                        </>
                                   )}

                                   {/* ── Security ── */}
                                   {activeSection === "Security" && (
                                        <>
                                             <div>
                                                  <h3 className="text-sm font-bold text-text mb-1">
                                                       Change password
                                                  </h3>
                                                  <p className="text-xs text-muted mb-4">
                                                       After changing your
                                                       password you'll be logged
                                                       out of all devices.
                                                  </p>

                                                  {matchError && (
                                                       <div className="bg-red/10 border border-red/30 text-red text-sm px-4 py-3 rounded-xl mb-4">
                                                            {matchError}
                                                       </div>
                                                  )}

                                                  <form
                                                       onSubmit={
                                                            handlePasswordChange
                                                       }
                                                       className="flex flex-col gap-4"
                                                  >
                                                       <div>
                                                            <label
                                                                 className={
                                                                      labelClass
                                                                 }
                                                            >
                                                                 Current
                                                                 password
                                                            </label>
                                                            <input
                                                                 type="password"
                                                                 placeholder="••••••••"
                                                                 value={
                                                                      passwordForm.oldPassword
                                                                 }
                                                                 onChange={(
                                                                      e,
                                                                 ) => {
                                                                      setMatchError(
                                                                           null,
                                                                      );
                                                                      setPasswordForm(
                                                                           (
                                                                                p,
                                                                           ) => ({
                                                                                ...p,
                                                                                oldPassword:
                                                                                     e
                                                                                          .target
                                                                                          .value,
                                                                           }),
                                                                      );
                                                                 }}
                                                                 className={
                                                                      inputClass
                                                                 }
                                                            />
                                                       </div>
                                                       <div>
                                                            <label
                                                                 className={
                                                                      labelClass
                                                                 }
                                                            >
                                                                 New password
                                                            </label>
                                                            <input
                                                                 type="password"
                                                                 placeholder="••••••••"
                                                                 value={
                                                                      passwordForm.newPassword
                                                                 }
                                                                 onChange={(
                                                                      e,
                                                                 ) => {
                                                                      setMatchError(
                                                                           null,
                                                                      );
                                                                      setPasswordForm(
                                                                           (
                                                                                p,
                                                                           ) => ({
                                                                                ...p,
                                                                                newPassword:
                                                                                     e
                                                                                          .target
                                                                                          .value,
                                                                           }),
                                                                      );
                                                                 }}
                                                                 className={
                                                                      inputClass
                                                                 }
                                                            />
                                                       </div>
                                                       <div>
                                                            <label
                                                                 className={
                                                                      labelClass
                                                                 }
                                                            >
                                                                 Confirm new
                                                                 password
                                                            </label>
                                                            <input
                                                                 type="password"
                                                                 placeholder="••••••••"
                                                                 value={
                                                                      passwordForm.confirm
                                                                 }
                                                                 onChange={(
                                                                      e,
                                                                 ) => {
                                                                      setMatchError(
                                                                           null,
                                                                      );
                                                                      setPasswordForm(
                                                                           (
                                                                                p,
                                                                           ) => ({
                                                                                ...p,
                                                                                confirm: e
                                                                                     .target
                                                                                     .value,
                                                                           }),
                                                                      );
                                                                 }}
                                                                 className={
                                                                      inputClass
                                                                 }
                                                            />
                                                       </div>
                                                       <div>
                                                            <button
                                                                 type="submit"
                                                                 disabled={
                                                                      passwordLoading ||
                                                                      !passwordForm.oldPassword ||
                                                                      !passwordForm.newPassword
                                                                 }
                                                                 className="bg-teal text-bg text-sm font-semibold px-4 py-2 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 cursor-pointer"
                                                            >
                                                                 {passwordLoading
                                                                      ? "Changing..."
                                                                      : "Change password"}
                                                            </button>
                                                       </div>
                                                  </form>
                                             </div>

                                             <div className="border-t border-border pt-8">
                                                  <h3 className="text-sm font-bold text-text mb-1">
                                                       Connected accounts
                                                  </h3>
                                                  <p className="text-xs text-muted mb-4">
                                                       Accounts linked to your
                                                       Snip profile.
                                                  </p>
                                                  <div className="flex items-center justify-between py-3.5 border-b border-border">
                                                       <div className="flex items-center gap-3">
                                                            <svg
                                                                 width="18"
                                                                 height="18"
                                                                 viewBox="0 0 48 48"
                                                            >
                                                                 <path
                                                                      fill="#EA4335"
                                                                      d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
                                                                 />
                                                                 <path
                                                                      fill="#4285F4"
                                                                      d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
                                                                 />
                                                                 <path
                                                                      fill="#FBBC05"
                                                                      d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
                                                                 />
                                                                 <path
                                                                      fill="#34A853"
                                                                      d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.31-8.16 2.31-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
                                                                 />
                                                            </svg>
                                                            <div>
                                                                 <div className="text-[13.5px] font-medium text-text">
                                                                      Google
                                                                 </div>
                                                                 <div className="text-xs text-muted">
                                                                      {user?.provider ===
                                                                      "GOOGLE"
                                                                           ? user.email
                                                                           : "Not connected"}
                                                                 </div>
                                                            </div>
                                                       </div>
                                                       <span
                                                            className={`text-xs font-semibold px-2.5 py-1 rounded-md ${user?.provider === "GOOGLE" ? "bg-teal/10 text-teal" : "bg-panel-2 text-muted"}`}
                                                       >
                                                            {user?.provider ===
                                                            "GOOGLE"
                                                                 ? "Connected"
                                                                 : "Not connected"}
                                                       </span>
                                                  </div>
                                             </div>
                                        </>
                                   )}

                                   {/* ── Notifications ── */}
                                   {activeSection === "Notifications" && (
                                        <div>
                                             <h3 className="text-sm font-bold text-text mb-1">
                                                  Preferences
                                             </h3>
                                             <p className="text-xs text-muted mb-4">
                                                  Control how Snip notifies you.
                                             </p>

                                             {[
                                                  {
                                                       key: "weeklyAnalytics",
                                                       label: "Weekly analytics email",
                                                       sub: "A summary of your link performance, every Monday",
                                                  },
                                                  {
                                                       key: "clickAlerts",
                                                       label: "Real-time click alerts",
                                                       sub: "Notify me when a link gets a sudden spike in clicks",
                                                  },
                                                  {
                                                       key: "anonymizeIp",
                                                       label: "Anonymize IP addresses",
                                                       sub: "Store only city-level location, not full IP",
                                                  },
                                             ].map((item) => (
                                                  <div
                                                       key={item.key}
                                                       className="flex items-center justify-between py-3.5 border-b border-border last:border-0"
                                                  >
                                                       <div>
                                                            <div className="text-[13.5px] font-medium text-text">
                                                                 {item.label}
                                                            </div>
                                                            <div className="text-xs text-muted mt-0.5">
                                                                 {item.sub}
                                                            </div>
                                                       </div>
                                                       <Toggle
                                                            checked={
                                                                 prefs[item.key]
                                                            }
                                                            onChange={() =>
                                                                 setPrefs(
                                                                      (p) => ({
                                                                           ...p,
                                                                           [item.key]:
                                                                                !p[
                                                                                     item
                                                                                          .key
                                                                                ],
                                                                      }),
                                                                 )
                                                            }
                                                       />
                                                  </div>
                                             ))}
                                        </div>
                                   )}

                                   {/* ── API Keys ── */}
                                   {activeSection === "API Keys" && (
                                        <div>
                                             <h3 className="text-sm font-bold text-text mb-1">
                                                  API Keys
                                             </h3>
                                             <p className="text-xs text-muted mb-4">
                                                  Use these keys to access the
                                                  Snip API programmatically.
                                             </p>
                                             <div className="bg-panel-2 border border-border rounded-xl p-5 flex flex-col items-center text-center gap-3 py-10">
                                                  <div className="w-10 h-10 rounded-xl bg-panel border border-border flex items-center justify-center text-muted mb-1">
                                                       <svg
                                                            width="18"
                                                            height="18"
                                                            viewBox="0 0 24 24"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            strokeWidth="2"
                                                       >
                                                            <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" />
                                                       </svg>
                                                  </div>
                                                  <h4 className="text-sm font-bold text-text">
                                                       Coming soon
                                                  </h4>
                                                  <p className="text-xs text-muted max-w-[240px]">
                                                       API key management will
                                                       be available in a future
                                                       update.
                                                  </p>
                                             </div>
                                        </div>
                                   )}

                                   {/* ── Billing ── */}
                                   {activeSection === "Billing" && (
                                        <div>
                                             <h3 className="text-sm font-bold text-text mb-1">
                                                  Billing
                                             </h3>
                                             <p className="text-xs text-muted mb-4">
                                                  Manage your plan and billing
                                                  information.
                                             </p>

                                             <div className="bg-panel border border-border rounded-xl p-5 mb-4">
                                                  <div className="flex items-center justify-between mb-4">
                                                       <div>
                                                            <div className="text-sm font-bold text-text">
                                                                 Free plan
                                                            </div>
                                                            <div className="text-xs text-muted mt-0.5">
                                                                 Links expire
                                                                 after 30 days
                                                            </div>
                                                       </div>
                                                       <span className="text-xs font-semibold bg-panel-2 text-muted-2 px-2.5 py-1 rounded-md">
                                                            Current plan
                                                       </span>
                                                  </div>
                                                  <div className="flex flex-col gap-2 text-xs text-muted-2">
                                                       <div className="flex items-center gap-2">
                                                            <span className="text-teal">
                                                                 ✓
                                                            </span>{" "}
                                                            Unlimited short
                                                            links
                                                       </div>
                                                       <div className="flex items-center gap-2">
                                                            <span className="text-teal">
                                                                 ✓
                                                            </span>{" "}
                                                            Click analytics
                                                       </div>
                                                       <div className="flex items-center gap-2">
                                                            <span className="text-teal">
                                                                 ✓
                                                            </span>{" "}
                                                            Geo + device
                                                            breakdown
                                                       </div>
                                                       <div className="flex items-center gap-2">
                                                            <span className="text-muted">
                                                                 ✗
                                                            </span>{" "}
                                                            Links expire after
                                                            30 days
                                                       </div>
                                                       <div className="flex items-center gap-2">
                                                            <span className="text-muted">
                                                                 ✗
                                                            </span>{" "}
                                                            Custom aliases
                                                       </div>
                                                  </div>
                                             </div>

                                             <div className="bg-teal/5 border border-teal/20 rounded-xl p-5">
                                                  <div className="flex items-center justify-between mb-4">
                                                       <div>
                                                            <div className="text-sm font-bold text-teal">
                                                                 Premium plan
                                                            </div>
                                                            <div className="text-xs text-muted mt-0.5">
                                                                 Everything in
                                                                 Free, plus more
                                                            </div>
                                                       </div>
                                                       <span className="text-xs font-semibold bg-teal/10 text-teal px-2.5 py-1 rounded-md">
                                                            Coming soon
                                                       </span>
                                                  </div>
                                                  <div className="flex flex-col gap-2 text-xs text-muted-2">
                                                       <div className="flex items-center gap-2">
                                                            <span className="text-teal">
                                                                 ✓
                                                            </span>{" "}
                                                            Links never expire
                                                       </div>
                                                       <div className="flex items-center gap-2">
                                                            <span className="text-teal">
                                                                 ✓
                                                            </span>{" "}
                                                            Custom aliases
                                                       </div>
                                                       <div className="flex items-center gap-2">
                                                            <span className="text-teal">
                                                                 ✓
                                                            </span>{" "}
                                                            API access
                                                       </div>
                                                       <div className="flex items-center gap-2">
                                                            <span className="text-teal">
                                                                 ✓
                                                            </span>{" "}
                                                            Priority support
                                                       </div>
                                                  </div>
                                             </div>
                                        </div>
                                   )}
                              </div>
                         </div>
                    </div>
               </main>
          </div>
     );
};

export default Settings;
