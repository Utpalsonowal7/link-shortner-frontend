const Toggle = ({ checked, onChange, disabled }) => (
     <button
          onClick={onChange}
          disabled={disabled}
          className={`w-9 h-5 rounded-full transition-colors duration-200 relative flex-shrink-0 cursor-pointer disabled:opacity-50 ${checked ? "bg-teal" : "bg-panel-2 border border-border"}`}
     >
          <span
               className={`absolute top-0.5 w-4 h-4 rounded-full transition-all duration-200 ${checked ? "left-4.5 bg-bg" : "left-0.5 bg-muted"}`}
          />
     </button>
);

export default Toggle;
