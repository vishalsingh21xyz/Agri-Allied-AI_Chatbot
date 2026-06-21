/**
 * @component Input
 * @param {Object} props
 * @param {string} props.label - Explanatory top field text label
 * @param {string} [props.placeholder] - Text entry prompt hint
 * @param {string} [props.type='text'] - Standard HTML input type attribute
 * @param {string} props.value - Controlled input form binding string
 * @param {Function} props.onChange - Value alteration event handling callback
 * @param {string} [props.error] - Alert message string that renders field validation flags
 */
export default function Input({ label, placeholder, type = 'text', value, onChange, error }) {
  return (
    <div className="flex flex-col gap-1 w-full">
      <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">{label}</label>
      <input 
        type={type} 
        placeholder={placeholder} 
        value={value} 
        onChange={onChange} 
        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-all dark:bg-slate-900 dark:text-white ${error ? 'border-red-500 focus:ring-red-400 focus:border-red-500' : 'border-slate-300 focus:ring-emerald-500 dark:border-slate-700'}`}
      />
      {error && <span className="text-xs text-red-500 font-medium mt-0.5">{error}</span>}
    </div>
  );
}