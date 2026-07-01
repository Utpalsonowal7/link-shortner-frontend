import { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate, Navigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { verifyOtp, resendOtp } from "../features/auth/authThunks";
import useAuth from "../hooks/useAuth";
import useTitle from "../hooks/useTitle";

const VerifyOtp = () => {
    useTitle("Verify email");

    const { state } = useLocation();
    const email = state?.email;
    const type = state?.type;
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { loading, error, clear } = useAuth();

    const [otp, setOtp] = useState(["", "", "", ""]);
    const [resendLoading, setResendLoading] = useState(false);
    const [resendError, setResendError] = useState(null);
    const [resendSuccess, setResendSuccess] = useState(false);
    const [countdown, setCountdown] = useState(0);

    const inputRefs = useRef([]);

    useEffect(() => {
        inputRefs.current[0]?.focus();
    }, []);

    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(
                () => setCountdown((prev) => prev - 1),
                1000,
            );
            return () => clearTimeout(timer);
        }
    }, [countdown]);

    if (!email) return <Navigate to="/register" replace />;

    const handleChange = (index, value) => {
        clear();
        if (!/^\d*$/.test(value)) return; // only numbers
        const newOtp = [...otp];
        newOtp[index] = value.slice(-1); // only last digit
        setOtp(newOtp);

        // auto focus next
        if (value && index < 3) {
            inputRefs.current[index + 1]?.focus();
        }

        // auto submit when all filled
        if (newOtp.every((d) => d !== "") && value) {
            handleSubmit(newOtp.join(""));
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const pasted = e.clipboardData
            .getData("text")
            .replace(/\D/g, "")
            .slice(0, 4);
        if (pasted.length === 4) {
            const newOtp = pasted.split("");
            setOtp(newOtp);
            inputRefs.current[3]?.focus(); // ✅ focus last (index 3 not 5)
            handleSubmit(pasted);
        }
    };

    const handleSubmit = async (otpValue) => {
        if (type === "reset-password") {
            navigate("/reset-password", {
                state: { email, otp: otpValue }, // ✅ just pass otp, no API call
            });
        } else {
            const res = await dispatch(
                verifyOtp({ email, otp: Number(otpValue) }),
            );
            if (res.meta.requestStatus === "fulfilled") {
                navigate("/login", { state: { verified: true } });
            }
        }
    };

    const handleResend = async () => {
        setResendLoading(true);
        setResendError(null);
        setResendSuccess(false);
        const res = await dispatch(resendOtp({ email }));
        setResendLoading(false);
        if (res.meta.requestStatus === "fulfilled") {
            setResendSuccess(true);
            setCountdown(300); // 60 second cooldown
            setOtp(["", "", "", ""]);
            inputRefs.current[0]?.focus();
        } else {
            setResendError(res.payload);
        }
    };

    return (
        <div className="min-h-screen bg-bg flex items-center justify-center px-4">
            <div className="w-full max-w-100 bg-panel border border-border rounded-2xl p-9 flex flex-col gap-6">

                {/* Header */}
                <div className="flex flex-col gap-1.5">
                    <h1 className="text-[22px] font-semibold text-text tracking-tight">
                        Check your email
                    </h1>
                    <p className="text-sm text-muted">
                        We sent a 4-digit code to{" "}
                        <span className="text-text font-medium">{email}</span>
                    </p>
                </div>

                {/* Error */}
                {error && (
                    <div className="bg-red/10 border border-red/30 text-red text-sm px-4 py-3 rounded-xl">
                        {error}
                    </div>
                )}

                {/* Resend error */}
                {resendError && (
                    <div className="bg-red/10 border border-red/30 text-red text-sm px-4 py-3 rounded-xl">
                        {resendError}
                    </div>
                )}

                {/* Resend success */}
                {resendSuccess && (
                    <div className="bg-teal/10 border border-teal/30 text-teal text-sm px-4 py-3 rounded-xl">
                        New OTP sent successfully!
                    </div>
                )}

                {/* OTP inputs */}
                <div
                    className="flex gap-2 justify-between"
                    onPaste={handlePaste}
                >
                    {otp.map((digit, index) => (
                        <input
                            key={index}
                            ref={(el) => (inputRefs.current[index] = el)}
                            type="text"
                            inputMode="numeric"
                            maxLength={1}
                            value={digit}
                            onChange={(e) =>
                                handleChange(index, e.target.value)
                            }
                            onKeyDown={(e) => handleKeyDown(index, e)}
                            className="w-12 h-12 text-center text-lg font-semibold bg-panel-2 border border-border rounded-xl text-text outline-none focus:border-teal transition-colors duration-150"
                        />
                    ))}
                </div>

                {/* Submit button */}
                <button
                    onClick={() => handleSubmit(otp.join(""))}
                    disabled={loading || otp.some((d) => d === "")}
                    className="w-full py-2.75 bg-teal text-bg text-sm font-semibold rounded-[10px] hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center cursor-pointer"
                >
                    {loading ? (
                        <span className="w-4 h-4 border-2 border-bg/30 border-t-bg rounded-full animate-spin" />
                    ) : (
                        "Verify email"
                    )}
                </button>

                {/* Resend */}
                <div className="text-center text-sm text-muted">
                    Didn't receive the code?{" "}
                    {countdown > 0 ? (
                        <span className="text-muted-2">
                            Resend in {countdown}s
                        </span>
                    ) : (
                        <button
                            onClick={handleResend}
                            disabled={resendLoading}
                            className="text-teal font-medium hover:underline cursor-pointer disabled:opacity-50"
                        >
                            {resendLoading ? "Sending..." : "Resend code"}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default VerifyOtp;
