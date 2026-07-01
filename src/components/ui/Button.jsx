const Button = ({ children, onClick, type = "button", variant = "primary", loading = false, className = "" }) => {
     const base = "px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2";

     const variants = {
          primary: "bg-teal text-bg hover:opacity-90",
          outline: "border border-border text-text hover:bg-panel-2",
          danger: "bg-red text-white hover:opacity-90",
          ghost: "text-muted hover:text-text hover:bg-panel-2",
     };

     return (
          <button
               type={type}
               onClick={onClick}
               disabled={loading}
               className={`${base} ${variants[variant]} ${className}`}
          >
               {loading ? (
                    <span className="w-4 h-4 border-2 border-bg border-t-transparent rounded-full animate-spin" />
               ) : children}
          </button>
     );
};

export default Button;