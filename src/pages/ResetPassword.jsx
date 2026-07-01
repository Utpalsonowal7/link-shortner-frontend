import { useState } from "react";
import { useNavigate, useLocation, Navigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { resetPassword } from "../features/auth/authThunks";
import useAuth from "../hooks/useAuth";
import useTitle from "../hooks/useTitle";

const ResetPassword = () => {
    useTitle("Reset password");
    const { state } = useLocation();
    const email = state?.email;
    const otp = state?.otp;
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { loading, error, clear } = useAuth();

    const [form, setForm] = useState({ password: "", confirm: "" });
    const [matchError, setMatchError] = useState(null);

    if (!email || !otp) return <Navigate to="/forgot-password" replace />;

    const handleChange = (e) => {
        clear();
        setMatchError(null);
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (form.password !== form.confirm) {
            setMatchError("Passwords do not match");
            return;
        }
        const res = await dispatch(
            resetPassword({
                email,
                otp: Number(otp),
                password: form.password,
            }),
        );
        if (res.meta.requestStatus === "fulfilled") {
            navigate("/login", { state: { passwordReset: true } });
        }
    };

    return (
        <div className="min-h-screen bg-bg flex items-center justify-center px-4">
            <div className="w-full max-w-[400px] bg-panel border border-border rounded-2xl p-9 flex flex-col gap-6">
                <div className="flex flex-col gap-1.5">
                    <h1 className="text-[22px] font-semibold text-text tracking-tight">
                        Reset password
                    </h1>
                    <p className="text-sm text-muted">
                        Enter your new password below
                    </p>
                </div>

                {(error || matchError) && (
                    <div className="bg-red/10 border border-red/30 text-red text-sm px-4 py-3 rounded-xl">
                        {matchError || error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1.5">
                        <label className="text-[13px] font-medium text-muted-2">
                            New password
                        </label>
                        <input
                            type="password"
                            name="password"
                            placeholder="••••••••"
                            value={form.password}
                            onChange={handleChange}
                            className="bg-panel-2 border border-border rounded-[10px] px-3.5 py-[11px] text-sm text-text placeholder:text-muted outline-none focus:border-teal transition-colors duration-150 w-full"
                        />
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="text-[13px] font-medium text-muted-2">
                            Confirm password
                        </label>
                        <input
                            type="password"
                            name="confirm"
                            placeholder="••••••••"
                            value={form.confirm}
                            onChange={handleChange}
                            className="bg-panel-2 border border-border rounded-[10px] px-3.5 py-[11px] text-sm text-text placeholder:text-muted outline-none focus:border-teal transition-colors duration-150 w-full"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading || !form.password || !form.confirm}
                        className="w-full py-[11px] bg-teal text-bg text-sm font-semibold rounded-[10px] hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center cursor-pointer mt-1"
                    >
                        {loading ? (
                            <span className="w-4 h-4 border-2 border-bg/30 border-t-bg rounded-full animate-spin" />
                        ) : (
                            "Reset password"
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ResetPassword;
