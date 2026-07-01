import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginUser } from "../features/auth/authThunks";
import useAuth from "../hooks/useAuth";

const Login = () => {
     const dispatch = useDispatch();
     const navigate = useNavigate();
     const { state } = useLocation();
     const { loading, error, clear } = useAuth();

     const [form, setForm] = useState({ email: "", password: "" });

     const handleChange = (e) => {
          clear();
          setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
     };

     const handleSubmit = async (e) => {
          e.preventDefault();
          const res = await dispatch(loginUser(form));
          if (res.meta.requestStatus === "fulfilled") {
               navigate("/dashboard");
          }
     };

     const handleGoogle = () => {
          window.location.href = `${import.meta.env.VITE_BACK_END_URL}/auth/google`;
    };
  

     return (
         <div className="min-h-screen bg-bg flex items-center justify-center px-4">
             <div className="w-full max-w-100 bg-panel border border-border rounded-2xl p-9 flex flex-col gap-6">
                 {/* Header */}
                 <div className="flex flex-col gap-1.5">
                     <h1 className="text-[22px] font-semibold text-text tracking-tight">
                         Welcome back
                     </h1>
                     <p className="text-sm text-muted">
                         Sign in to continue to your account
                     </p>
                 </div>

                 {/* Error */}
                 {error && (
                     <div className="bg-red/10 border border-red/30 text-red text-sm px-4 py-3 rounded-xl">
                         {error}
                     </div>
                 )}

                 {state?.verified && (
                     <div className="bg-teal/10 border border-teal/30 text-teal text-sm px-4 py-3 rounded-xl">
                         Email verified successfully! Please sign in.
                     </div>
                 )}

                 {state?.passwordReset && (
                     <div className="bg-teal/10 border border-teal/30 text-teal text-sm px-4 py-3 rounded-xl">
                         Password reset successfully! Please sign in.
                     </div>
                    )}
                    
                 {/* Form */}
                 <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                     <div className="flex flex-col gap-1.5">
                         <label className="text-[13px] font-medium text-muted-2">
                             Email address
                         </label>
                         <input
                             type="email"
                             name="email"
                             placeholder="john@example.com"
                             value={form.email}
                             autoComplete="email"
                             onChange={handleChange}
                             className="bg-panel-2 border border-border rounded-[10px] px-3.5 py-2.75 text-sm text-text placeholder:text-muted outline-none focus:border-teal transition-colors duration-150 w-full"
                         />
                     </div>

                     <div className="flex flex-col gap-1.5">
                         <label className="text-[13px] font-medium text-muted-2">
                             Password
                         </label>
                         <input
                             type="password"
                             name="password"
                             placeholder="••••••••"
                             value={form.password}
                             autoComplete="current-password"
                             onChange={handleChange}
                             className="bg-panel-2 border border-border rounded-[10px] px-3.5 py-2.75 text-sm text-text placeholder:text-muted outline-none focus:border-teal transition-colors duration-150 w-full"
                         />
                     </div>

                     <div className="text-right -mt-2">
                         <Link
                             to="/forgot-password"
                             className="text-xs text-muted hover:text-teal transition-colors"
                         >
                             Forgot password?
                         </Link>
                     </div>

                     <button
                         type="submit"
                         disabled={loading}
                         className="w-full py-[11px] bg-teal text-bg text-sm font-semibold rounded-[10px] hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center cursor-pointer"
                     >
                         {loading ? (
                             <span className="w-4 h-4 border-2 border-bg/30 border-t-bg rounded-full animate-spin" />
                         ) : (
                             "Sign in"
                         )}
                     </button>
                 </form>

                 {/* Divider */}
                 <div className="flex items-center gap-3">
                     <div className="flex-1 h-px bg-border" />
                     <span className="text-xs text-muted">
                         or continue with
                     </span>
                     <div className="flex-1 h-px bg-border" />
                 </div>

                 {/* Google */}
                 <button
                     onClick={handleGoogle}
                     className="w-full py-[11px] bg-panel-2 border border-border rounded-[10px] flex items-center justify-center gap-2.5 text-sm font-medium text-text hover:border-muted-2 transition-colors cursor-pointer"
                 >
                     <svg width="18" height="18" viewBox="0 0 48 48">
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
                     Continue with Google
                 </button>

                 {/* Footer */}
                 <p className="text-center text-[13px] text-muted">
                     Don't have an account?{" "}
                     <Link
                         to="/register"
                         className="text-teal font-medium hover:underline"
                     >
                         Sign up
                     </Link>
                 </p>
             </div>
         </div>
     );
};

export default Login;