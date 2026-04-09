import { useState } from "react";

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

  return (
    <div className="bg-white border border-gray-100 rounded-[2rem] shadow-xl shadow-gray-200/50 p-7">
      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-800">Filters</h2>
        <div className="h-1 w-12 bg-blue-500 rounded-full mt-2"></div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Search */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase text-gray-400 ml-1">Search</label>
          <div className="relative">
            <input
              name="search"
              value={filters.search}
              onChange={handleChange}
              placeholder="Keywords..."
              className="w-full pl-4 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none text-sm"
            />
          </div>
        </div>

        {/* Location */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase text-gray-400 ml-1">Location</label>
          <input
            name="location"
            value={filters.location}
            onChange={handleChange}
            placeholder="e.g. Remote, Delhi"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 transition-all outline-none text-sm"
          />
        </div>

        {/* Duration */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase text-gray-400 ml-1">Duration</label>
          <div className="flex gap-2">
            <input
              name="durationValue"
              type="number"
              value={filters.durationValue}
              onChange={handleChange}
              placeholder="Qty"
              className="w-20 px-3 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white outline-none text-sm"
            />
            <select
              name="durationUnit"
              value={filters.durationUnit}
              onChange={handleChange}
              className="flex-grow px-3 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white outline-none text-sm cursor-pointer"
            >
              <option value="">Unit</option>
              <option value="week">Weeks</option>
              <option value="month">Months</option>
            </select>
          </div>
        </div>

        {/* Stipend Range */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase text-gray-400 ml-1">Stipend (₹)</label>
          <div className="flex items-center gap-2">
            <input
              name="stipendMin"
              value={filters.stipendMin}
              onChange={handleChange}
              placeholder="Min"
              className="w-full px-3 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white outline-none text-sm"
            />
            <span className="text-gray-300">-</span>
            <input
              name="stipendMax"
              value={filters.stipendMax}
              onChange={handleChange}
              placeholder="Max"
              className="w-full px-3 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white outline-none text-sm"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="pt-6 space-y-3">
          <button
            type="submit"
            className="w-full py-4 rounded-xl bg-gray-900 text-white font-bold text-sm hover:bg-blue-600 transition-colors shadow-lg shadow-gray-200"
          >
            Apply Filters
          </button>
          <button
            type="button"
            onClick={handleClear}
            className="w-full py-3 rounded-xl border border-transparent text-gray-400 font-medium text-sm hover:text-red-500 transition-colors"
          >
            Reset All
          </button>
        </div>
      </form>
    </div>
  );
};

export default InternshipFilter;
