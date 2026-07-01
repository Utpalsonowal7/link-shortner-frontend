const Input = ({ label, type = "text", placeholder, value, onChange, error, className = "", name }) => {
     return (
          <div className="flex flex-col gap-1.5 w-full">
               {label && (
                    <label className="text-sm font-medium text-muted-2">{label}</label>
               )}
               <input
                    type={type}
                    name={name}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    className={`w-full bg-panel-2 border border-border text-text placeholder:text-muted text-sm px-4 py-2.5 rounded-lg outline-none focus:border-teal transition-colors duration-200 ${error ? "border-red" : ""} ${className}`}
               />
               {error && (
                    <span className="text-red text-xs">{error}</span>
               )}
          </div>
     );
};

export default Input;