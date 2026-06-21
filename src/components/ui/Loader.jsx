/**
 * @component Loader
 * @param {Object} props
 * @param {boolean} [props.fullScreen=false] - Dictates whether overlay blocks the entire screen space
 */
export default function Loader({ fullScreen = false }) {
  const spinner = (
    <div className="animate-spin rounded-full h-10 w-10 border-4 border-slate-200 border-t-emerald-700 dark:border-slate-800 dark:border-t-emerald-500"></div>
  );
  if (fullScreen) {
    return <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/70 dark:bg-slate-950/70">{spinner}</div>;
  }
  return <div className="flex items-center justify-center p-4">{spinner}</div>;
}