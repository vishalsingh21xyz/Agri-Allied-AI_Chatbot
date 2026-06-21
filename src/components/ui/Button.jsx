/**
 * @component Button
 * @param {Object} props
 * @param {'primary' | 'secondary' | 'outline'} [props.variant='primary'] - Visual style theme variant
 * @param {'sm' | 'md' | 'lg'} [props.size='md'] - Button box dimension sizing
 * @param {boolean} [props.disabled=false] - Disables user interactions and applies faded opacity
 * @param {Function} props.onClick - Click event action callback function
 * @param {React.ReactNode} props.children - Inner content nodes
 */
export default function Button({ variant = 'primary', size = 'md', disabled = false, onClick, children }) {
  const baseStyle = "font-medium rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-emerald-700 hover:bg-emerald-800 text-white focus:ring-emerald-500 dark:bg-emerald-600 dark:hover:bg-emerald-700",
    secondary: "bg-slate-600 hover:bg-slate-700 text-white focus:ring-slate-500 dark:bg-slate-700 dark:hover:bg-slate-600",
    outline: "border border-slate-300 hover:bg-slate-100 text-slate-700 focus:ring-slate-400 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-5 py-3 text-lg"
  };

  return (
    <button 
      disabled={disabled} 
      onClick={onClick} 
      className={`${baseStyle} ${variants[variant]} ${sizes[size]}`}
    >
      {children}
    </button>
  );
}