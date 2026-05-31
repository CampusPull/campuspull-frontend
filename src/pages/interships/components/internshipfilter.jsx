import { useState } from "react";
import { FiSearch, FiMapPin, FiCreditCard, FiRefreshCw, FiFilter } from "react-icons/fi";

const FilterField = ({ label, icon: Icon, children }) => (
  <div className="space-y-2.5">
    <label className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-widest text-slate-400">
      {Icon && <Icon size={12} className="text-slate-400/80" />}
      {label}
    </label>
    {children}
  </div>
);

const inputBaseClass =
  "w-full px-4 py-3 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50/80 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all duration-300 outline-none text-sm text-slate-700 placeholder-slate-400/80 font-semibold shadow-inner-sm";

const InternshipFilter = ({ onFilter }) => {
  const [filters, setFilters] = useState({
    location: "",
    stipendMin: "",
    stipendMax: "",
    search: "",
  });

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onFilter(filters);
  };

  const handleClear = () => {
    const cleared = {
      location: "",
      stipendMin: "",
      stipendMax: "",
      search: "",
    };
    setFilters(cleared);
    onFilter(cleared);
  };

  const hasActiveFilters = Object.values(filters).some((v) => v !== "");

  return (
    <div 
      className="bg-white/80 backdrop-blur-2xl rounded-3xl border border-slate-100 p-6 transition-all duration-300 hover:shadow-brand-md" 
      style={{ boxShadow: "0 4px 24px rgba(0, 0, 0, 0.04), 0 1px 2px rgba(0, 0, 0, 0.02)" }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-blue-500 rounded-xl flex items-center justify-center shadow-md shadow-indigo-500/10">
            <FiFilter size={15} className="text-white" />
          </div>
          <h2 className="text-base font-extrabold text-slate-800 tracking-tight">Filters</h2>
        </div>
        {hasActiveFilters && (
          <span className="text-[10px] font-extrabold px-2.5 py-1 bg-indigo-50 text-indigo-600 rounded-full border border-indigo-100">
            Active
          </span>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Search */}
        <FilterField label="Search" icon={FiSearch}>
          <div className="relative group">
            <FiSearch size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-hover:text-indigo-500 transition-colors pointer-events-none duration-300" />
            <input
              name="search"
              value={filters.search}
              onChange={handleChange}
              placeholder="Role, company, skills..."
              className={`${inputBaseClass} pl-11`}
            />
          </div>
        </FilterField>

        {/* Location */}
        <FilterField label="Location" icon={FiMapPin}>
          <div className="relative group">
            <FiMapPin size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-hover:text-indigo-500 transition-colors pointer-events-none duration-300" />
            <input
              name="location"
              value={filters.location}
              onChange={handleChange}
              placeholder="Remote, Delhi..."
              className={`${inputBaseClass} pl-11`}
            />
          </div>
        </FilterField>

        {/* Stipend Range */}
        <FilterField label="Monthly Stipend (₹)" icon={FiCreditCard}>
          <div className="flex items-center gap-3">
            <div className="relative flex-1 group">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[11px] font-extrabold text-slate-400 group-hover:text-indigo-500 transition-colors pointer-events-none">₹</span>
              <input
                name="stipendMin"
                type="number"
                min="0"
                value={filters.stipendMin}
                onChange={handleChange}
                placeholder="Min"
                className={`${inputBaseClass} pl-7 pr-2.5 py-2.5`}
              />
            </div>
            <span className="text-slate-300 font-black text-sm select-none">—</span>
            <div className="relative flex-1 group">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[11px] font-extrabold text-slate-400 group-hover:text-indigo-500 transition-colors pointer-events-none">₹</span>
              <input
                name="stipendMax"
                type="number"
                min="0"
                value={filters.stipendMax}
                onChange={handleChange}
                placeholder="Max"
                className={`${inputBaseClass} pl-7 pr-2.5 py-2.5`}
              />
            </div>
          </div>
        </FilterField>

        {/* Divider */}
        <div className="h-px bg-slate-100" />

        {/* Actions */}
        <div className="space-y-3 pt-1">
          <button
            type="submit"
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-extrabold text-sm hover:shadow-lg hover:shadow-indigo-500/20 hover:-translate-y-0.5 transition-all duration-300 active:scale-98 cursor-pointer flex items-center justify-center gap-2"
          >
            Apply Filters
          </button>
          <button
            type="button"
            onClick={handleClear}
            disabled={!hasActiveFilters}
            className="w-full py-3 rounded-2xl border border-transparent text-slate-400 font-bold text-sm hover:text-rose-600 hover:bg-rose-50 hover:border-rose-100 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:text-slate-400 disabled:hover:bg-transparent transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <FiRefreshCw size={13} />
            Reset Filters
          </button>
        </div>
      </form>
    </div>
  );
};

export default InternshipFilter;
