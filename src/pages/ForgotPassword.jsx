import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { forgotPassword } from "../features/auth/authThunks";
import useAuth from "../hooks/useAuth";
import useTitle from "../hooks/useTitle";

const ForgotPassword = () => {
    useTitle("SHORTLY || Forgot password");
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, error, clear } = useAuth();
    const [email, setEmail] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        const res = await dispatch(forgotPassword({ email }));
        if (res.meta.requestStatus === "fulfilled") {
            navigate("/verify-otp", {
                state: { email, type: "reset-password" },
            });
        }
    };

    return (
        <div className="min-h-screen bg-bg flex items-center justify-center px-4">
            <div className="w-full max-w-[400px] bg-panel border border-border rounded-2xl p-9 flex flex-col gap-6">

                <div className="flex flex-col gap-1.5">
                    <h1 className="text-[22px] font-semibold text-text tracking-tight">
                        Forgot password?
                    </h1>
                    <p className="text-sm text-muted">
                        Enter your email and we'll send you a reset code
                    </p>
                </div>

                {error && (
                    <div className="bg-red/10 border border-red/30 text-red text-sm px-4 py-3 rounded-xl">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1.5">
                        <label className="text-[13px] font-medium text-muted-2">
                            Email address
                        </label>
                        <input
                            type="email"
                            placeholder="john@example.com"
                            value={email}
                            onChange={(e) => {
                                clear();
                                setEmail(e.target.value);
                            }}
                            className="bg-panel-2 border border-border rounded-[10px] px-3.5 py-[11px] text-sm text-text placeholder:text-muted outline-none focus:border-teal transition-colors duration-150 w-full"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading || !email}
                        className="w-full py-[11px] bg-teal text-bg text-sm font-semibold rounded-[10px] hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center cursor-pointer mt-1"
                    >
                        {loading ? (
                            <span className="w-4 h-4 border-2 border-bg/30 border-t-bg rounded-full animate-spin" />
                        ) : (
                            "Send reset code"
                        )}
                    </button>
                </form>

                <p className="text-center text-[13px] text-muted">
                    Remember your password?{" "}
                    <Link
                        to="/login"
                        className="text-teal font-medium hover:underline"
                    >
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default ForgotPassword;
