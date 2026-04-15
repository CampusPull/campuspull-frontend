import { useState } from "react";
import { FiSearch, FiMapPin, FiClock, FiCreditCard, FiRefreshCw, FiFilter } from "react-icons/fi";

const FilterField = ({ label, icon: Icon, children }) => (
  <div className="space-y-2">
    <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-gray-400">
      {Icon && <Icon size={11} />}
      {label}
    </label>
    {children}
  </div>
);

const inputClass =
  "w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all outline-none text-sm text-gray-700 placeholder-gray-400 font-medium";

const InternshipFilter = ({ onFilter }) => {
  const [filters, setFilters] = useState({
    location: "",
    durationValue: "",
    durationUnit: "",
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
      durationValue: "",
      durationUnit: "",
      stipendMin: "",
      stipendMax: "",
      search: "",
    };
    setFilters(cleared);
    onFilter(cleared);
  };

  const hasActiveFilters = Object.values(filters).some((v) => v !== "");

  return (
    <div className="bg-white rounded-3xl border border-gray-100 p-6" style={{ boxShadow: "0 2px 16px rgba(0,0,0,0.06)" }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-50 rounded-xl flex items-center justify-center">
            <FiFilter size={14} className="text-indigo-600" />
          </div>
          <h2 className="text-base font-extrabold text-gray-900">Filters</h2>
        </div>
        {hasActiveFilters && (
          <span className="text-[10px] font-bold px-2 py-1 bg-indigo-100 text-indigo-600 rounded-full">
            Active
          </span>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Search */}
        <FilterField label="Search" icon={FiSearch}>
          <div className="relative">
            <FiSearch size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            <input
              name="search"
              value={filters.search}
              onChange={handleChange}
              placeholder="Role, company, skills..."
              className={`${inputClass} pl-9`}
            />
          </div>
        </FilterField>

        {/* Location */}
        <FilterField label="Location" icon={FiMapPin}>
          <div className="relative">
            <FiMapPin size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            <input
              name="location"
              value={filters.location}
              onChange={handleChange}
              placeholder="Remote, Delhi..."
              className={`${inputClass} pl-9`}
            />
          </div>
        </FilterField>

        {/* Duration */}
        <FilterField label="Duration" icon={FiClock}>
          <div className="flex gap-2">
            <input
              name="durationValue"
              type="number"
              min="1"
              value={filters.durationValue}
              onChange={handleChange}
              placeholder="Qty"
              className={`${inputClass} w-20`}
            />
            <select
              name="durationUnit"
              value={filters.durationUnit}
              onChange={handleChange}
              className={`${inputClass} flex-grow cursor-pointer`}
            >
              <option value="">Unit</option>
              <option value="week">Weeks</option>
              <option value="month">Months</option>
            </select>
          </div>
        </FilterField>

        {/* Stipend Range */}
        <FilterField label="Stipend (₹)" icon={FiCreditCard}>
          <div className="flex items-center gap-2">
            <input
              name="stipendMin"
              type="number"
              min="0"
              value={filters.stipendMin}
              onChange={handleChange}
              placeholder="Min"
              className={inputClass}
            />
            <span className="text-gray-300 font-bold">—</span>
            <input
              name="stipendMax"
              type="number"
              min="0"
              value={filters.stipendMax}
              onChange={handleChange}
              placeholder="Max"
              className={inputClass}
            />
          </div>
        </FilterField>

        {/* Divider */}
        <div className="h-px bg-gray-100" />

        {/* Actions */}
        <div className="space-y-2.5 pt-1">
          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-bold text-sm hover:shadow-lg hover:shadow-indigo-200 hover:-translate-y-0.5 transition-all duration-200 active:scale-95"
          >
            Apply Filters
          </button>
          <button
            type="button"
            onClick={handleClear}
            disabled={!hasActiveFilters}
            className="w-full py-2.5 rounded-xl border border-transparent text-gray-400 font-semibold text-sm hover:text-red-500 hover:bg-red-50 hover:border-red-100 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:text-gray-400 disabled:hover:bg-transparent transition-all flex items-center justify-center gap-1.5"
          >
            <FiRefreshCw size={12} />
            Reset Filters
          </button>
        </div>
      </form>
    </div>
  );
};

export default InternshipFilter;
