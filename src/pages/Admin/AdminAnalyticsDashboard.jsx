import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  getAnalyticsOverview,
  getAnalyticsApis,
  getAnalyticsModules,
  getAnalyticsDaily,
  getAnalyticsMonthly,
  getAnalyticsTopApis,
  getAnalyticsActiveUsers,
} from "../../services/applicationService";
import Icon from "../../components/AppIcon";

// Custom helper to format date range params
const formatDate = (date) => {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};

const getDatesForFilter = (filterType) => {
  const today = new Date();
  let startDate = new Date();
  const endDate = today;

  if (filterType === "Today") {
    startDate = today;
  } else if (filterType === "Last 7 Days") {
    startDate = new Date();
    startDate.setDate(today.getDate() - 7);
  } else if (filterType === "Last 30 Days") {
    startDate = new Date();
    startDate.setDate(today.getDate() - 30);
  } else if (filterType === "This Month") {
    startDate = new Date(today.getFullYear(), today.getMonth(), 1);
  }

  return {
    startDate: formatDate(startDate),
    endDate: formatDate(endDate),
  };
};

export default function AdminAnalyticsDashboard() {
  const [selectedFilter, setSelectedFilter] = useState("Last 7 Days");
  const [chartMode, setChartMode] = useState("daily"); // "daily" or "monthly"
  const [currentPage, setCurrentPage] = useState(1);

  // Individual section states to support independent error handling/retries
  const [sections, setSections] = useState({
    overview: { data: null, loading: true, error: null },
    daily: { data: null, loading: true, error: null },
    monthly: { data: null, loading: true, error: null },
    modules: { data: null, loading: true, error: null },
    topApis: { data: null, loading: true, error: null },
    apis: { data: null, loading: true, error: null },
    activeUsers: { data: null, loading: true, error: null },
  });

  // Master fetch function utilizing Promise.allSettled()
  const fetchAllAnalytics = async (filter) => {
    // Set all to loading state
    setSections((prev) => {
      const next = {};
      Object.keys(prev).forEach((key) => {
        next[key] = { ...prev[key], loading: true, error: null };
      });
      return next;
    });

    const params = getDatesForFilter(filter);

    const promises = [
      getAnalyticsOverview(params).then((res) => ({ key: "overview", data: res?.data || res })),
      getAnalyticsDaily(params).then((res) => ({ key: "daily", data: res?.data || res })),
      getAnalyticsMonthly(params).then((res) => ({ key: "monthly", data: res?.data || res })),
      getAnalyticsModules(params).then((res) => ({ key: "modules", data: res?.data || res })),
      getAnalyticsTopApis(params).then((res) => ({ key: "topApis", data: res?.data || res })),
      getAnalyticsApis(params).then((res) => ({ key: "apis", data: res?.data || res })),
      getAnalyticsActiveUsers(params).then((res) => ({ key: "activeUsers", data: res?.data || res })),
    ];

    const results = await Promise.allSettled(promises);

    const keys = ["overview", "daily", "monthly", "modules", "topApis", "apis", "activeUsers"];

    results.forEach((result, idx) => {
      const key = keys[idx];
      if (result.status === "fulfilled") {
        setSections((prev) => ({
          ...prev,
          [key]: { data: result.value.data, loading: false, error: null },
        }));
      } else {
        console.error(`Error fetching analytics endpoint (${key}):`, result.reason);
        const is404 = result.reason?.response?.status === 404;
        
        // Setup default empty values for 404 (backend fallback)
        let fallbackData = null;
        if (is404) {
          if (key === "overview") {
            fallbackData = {
              totalRequests: 0,
              todayRequests: 0,
              successRate: 0,
              failedRequests: 0,
              activeUsers: 0,
              averageResponseTime: 0,
            };
          } else {
            fallbackData = [];
          }
        }

        setSections((prev) => ({
          ...prev,
          [key]: {
            data: fallbackData,
            loading: false,
            error: is404 ? null : (result.reason?.message || "Failed to load"),
          },
        }));
      }
    });
  };

  // Section-specific retry helper
  const fetchSingleSection = async (key) => {
    setSections((prev) => ({
      ...prev,
      [key]: { ...prev[key], loading: true, error: null },
    }));

    const params = getDatesForFilter(selectedFilter);

    try {
      let res;
      if (key === "overview") res = await getAnalyticsOverview(params);
      else if (key === "daily") res = await getAnalyticsDaily(params);
      else if (key === "monthly") res = await getAnalyticsMonthly(params);
      else if (key === "modules") res = await getAnalyticsModules(params);
      else if (key === "topApis") res = await getAnalyticsTopApis(params);
      else if (key === "apis") res = await getAnalyticsApis(params);
      else if (key === "activeUsers") res = await getAnalyticsActiveUsers(params);

      setSections((prev) => ({
        ...prev,
        [key]: { data: res?.data || res, loading: false, error: null },
      }));
    } catch (err) {
      console.error(`Retry error for section ${key}:`, err);
      const is404 = err?.response?.status === 404;

      let fallbackData = null;
      if (is404) {
        if (key === "overview") {
          fallbackData = {
            totalRequests: 0,
            todayRequests: 0,
            successRate: 0,
            failedRequests: 0,
            activeUsers: 0,
            averageResponseTime: 0,
          };
        } else {
          fallbackData = [];
        }
      }

      setSections((prev) => ({
        ...prev,
        [key]: {
          data: fallbackData,
          loading: false,
          error: is404 ? null : (err?.message || "Failed to load"),
        },
      }));
    }
  };

  useEffect(() => {
    fetchAllAnalytics(selectedFilter);
    setCurrentPage(1);
  }, [selectedFilter]);

  // Section A - Date Filter options
  const filterOptions = ["Today", "Last 7 Days", "Last 30 Days", "This Month"];

  // Helper mapping for GET, POST, etc badges
  const getMethodBadge = (method) => {
    const m = (method || "").toUpperCase();
    let badgeClasses = "bg-gray-50 text-gray-700 border-gray-200";

    if (m === "GET") {
      badgeClasses = "bg-emerald-50 text-emerald-700 border-emerald-250";
    } else if (m === "POST") {
      badgeClasses = "bg-blue-50 text-blue-700 border-blue-250";
    } else if (m === "PATCH" || m === "PUT") {
      badgeClasses = "bg-amber-50 text-amber-700 border-amber-250";
    } else if (m === "DELETE") {
      badgeClasses = "bg-rose-50 text-rose-700 border-rose-250";
    }

    return (
      <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-black border uppercase tracking-wider ${badgeClasses}`}>
        {m}
      </span>
    );
  };

  // Helper formatting for Avg Response Time color indicators
  const getAvgResponseColor = (ms) => {
    const val = Number(ms) || 0;
    if (val < 100) return "text-emerald-600 font-bold";
    if (val <= 300) return "text-amber-600 font-bold";
    return "text-rose-600 font-bold";
  };

  // Format date helper for chart lines
  const formatChartDate = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const formatChartMonth = (monthStr) => {
    if (!monthStr) return "";
    // Construct valid date
    const date = new Date(monthStr + "-02");
    if (isNaN(date.getTime())) return monthStr;
    return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
  };

  // Format timestamp helper
  const formatTimestamp = (isoString) => {
    if (!isoString) return "—";
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return "—";
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // 1. Overview data extraction
  const overview = sections.overview.data || {};
  const cards = [
    {
      title: "Total Requests",
      value: overview.totalRequests ?? 0,
      color: "border-l-4 border-indigo-500 text-indigo-600 bg-indigo-50/50",
      icon: "Activity",
      iconColor: "text-indigo-600 bg-indigo-50",
    },
    {
      title: "Today's Requests",
      value: overview.todayRequests ?? 0,
      color: "border-l-4 border-blue-500 text-blue-600 bg-blue-50/50",
      icon: "Zap",
      iconColor: "text-blue-600 bg-blue-50",
    },
    {
      title: "Success Rate",
      value: `${overview.successRate ?? 0}%`,
      color: "border-l-4 border-emerald-500 text-emerald-600 bg-emerald-50/50",
      icon: "CheckCircle2",
      iconColor: "text-emerald-600 bg-emerald-50",
    },
    {
      title: "Failed Requests",
      value: overview.failedRequests ?? 0,
      color: "border-l-4 border-rose-500 text-rose-600 bg-rose-50/50",
      icon: "AlertTriangle",
      iconColor: "text-rose-600 bg-rose-50",
    },
    {
      title: "Active Users",
      value: overview.activeUsers ?? 0,
      color: "border-l-4 border-amber-500 text-amber-600 bg-amber-50/50",
      icon: "Users",
      iconColor: "text-amber-600 bg-amber-50",
    },
    {
      title: "Avg Response Time",
      value: `${overview.averageResponseTime ?? overview.averageResponseTimeMs ?? 0} ms`,
      color: "border-l-4 border-slate-500 text-slate-600 bg-slate-50/50",
      icon: "Clock",
      iconColor: "text-slate-600 bg-slate-50",
    },
  ];

  // 2. Charts variables
  const isTrafficTrendLoading = sections[chartMode].loading;
  const isTrafficTrendError = sections[chartMode].error;
  const trafficTrendData = sections[chartMode].data || [];

  const modulesDataRaw = sections.modules.data || [];
  const modulesData = Array.isArray(modulesDataRaw) ? modulesDataRaw : [];

  // Pie chart theme colors
  const PIE_COLORS = [
    "#6366F1", // indigo
    "#3B82F6", // blue
    "#10B981", // emerald
    "#EF4444", // rose
    "#F59E0B", // amber
    "#8B5CF6", // purple
    "#EC4899", // pink
    "#06B6D4", // cyan
    "#14B8A6", // teal
    "#64748B", // slate
  ];

  // 3. Tables calculations
  const topApisRaw = sections.topApis.data || [];
  const topApis = Array.isArray(topApisRaw) ? topApisRaw.slice(0, 10) : [];

  // Sort modules data by requests descending for statistics table
  const sortedModules = [...modulesData].sort((a, b) => (b.requests || 0) - (a.requests || 0));
  const totalModuleRequests = modulesData.reduce((sum, item) => sum + (item.requests || 0), 0);

  // 4. Performance table calculations
  const apisRaw = sections.apis.data || [];
  const apisData = Array.isArray(apisRaw) ? apisRaw : [];
  const itemsPerPage = 10;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const totalPages = Math.ceil(apisData.length / itemsPerPage);
  const paginatedApis = apisData.slice(startIndex, startIndex + itemsPerPage);

  // Reusable error element inside cards
  const renderErrorState = (sectionKey, text) => (
    <div className="flex flex-col items-center justify-center py-10 text-center space-y-3">
      <Icon name="AlertTriangle" className="text-rose-500 animate-pulse" size={32} />
      <p className="text-sm font-semibold text-gray-500">{text || "Failed to load data"}</p>
      <button
        onClick={() => fetchSingleSection(sectionKey)}
        className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-sm transition cursor-pointer"
      >
        <Icon name="RotateCw" size={12} />
        <span>Retry</span>
      </button>
    </div>
  );

  return (
    <div className="p-6 pt-28 md:pt-32 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Main Dashboard Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-200 pb-5">
          <div className="space-y-1">
            <h1 className="text-2xl md:text-3xl font-black text-gray-800 tracking-tight flex items-center gap-2">
              <Icon name="BarChart2" className="text-indigo-600" size={32} />
              <span>Admin Analytics Dashboard</span>
            </h1>
            <p className="text-sm font-medium text-gray-500">
              Insightful aggregations, api statistics, traffic graphs and response time logs.
            </p>
          </div>

          {/* Section A: Date Filter Bar */}
          <div className="flex flex-wrap items-center gap-2 bg-white p-1 rounded-2xl border border-gray-150 shadow-sm w-fit self-start md:self-center">
            {filterOptions.map((opt) => (
              <button
                key={opt}
                onClick={() => setSelectedFilter(opt)}
                className={`px-3.5 py-1.5 text-xs font-extrabold rounded-xl transition-all duration-200 cursor-pointer ${
                  selectedFilter === opt
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-100"
                    : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        {/* Section B: Overview Cards */}
        {sections.overview.loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="bg-white p-6 rounded-2xl border border-gray-150 shadow-sm h-28 flex items-center justify-between"
              >
                <div className="space-y-3 flex-1">
                  <div className="h-3.5 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                </div>
                <div className="w-12 h-12 bg-gray-250 rounded-xl"></div>
              </div>
            ))}
          </div>
        ) : sections.overview.error ? (
          <div className="bg-white p-8 rounded-2xl border border-gray-150 shadow-sm">
            {renderErrorState("overview", "Failed to load overview statistics")}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {cards.map((card, idx) => (
              <div
                key={idx}
                className={`bg-white p-6 rounded-2xl border border-gray-150 shadow-sm flex items-center justify-between hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 ${card.color}`}
              >
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">
                    {card.title}
                  </span>
                  <p className="text-3xl font-black text-gray-800 tracking-tight">{card.value}</p>
                </div>
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${card.iconColor}`}>
                  <Icon name={card.icon} size={24} />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Section C: Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Traffic Trend Chart (60% width) */}
          <div className="lg:col-span-3 bg-white p-6 rounded-2xl border border-gray-150 shadow-sm flex flex-col min-h-[380px]">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-4">
              <div className="flex items-center gap-2">
                <Icon name="Activity" className="text-indigo-600" size={20} />
                <h3 className="text-base font-bold text-gray-800">Traffic Trend</h3>
              </div>

              {/* Chart mode toggle (Daily vs Monthly) */}
              <div className="flex bg-gray-100 p-0.5 rounded-lg border border-gray-200">
                <button
                  onClick={() => setChartMode("daily")}
                  className={`px-3 py-1 text-[10px] font-black rounded-md uppercase tracking-wider transition cursor-pointer ${
                    chartMode === "daily"
                      ? "bg-white text-indigo-600 shadow-sm border border-gray-200"
                      : "text-gray-500 hover:text-gray-800"
                  }`}
                >
                  Daily
                </button>
                <button
                  onClick={() => setChartMode("monthly")}
                  className={`px-3 py-1 text-[10px] font-black rounded-md uppercase tracking-wider transition cursor-pointer ${
                    chartMode === "monthly"
                      ? "bg-white text-indigo-600 shadow-sm border border-gray-200"
                      : "text-gray-500 hover:text-gray-800"
                  }`}
                >
                  Monthly
                </button>
              </div>
            </div>

            <div className="flex-1 flex flex-col justify-center">
              {isTrafficTrendLoading ? (
                <div className="h-64 bg-gray-50 rounded-2xl border border-gray-150 animate-pulse flex items-center justify-center text-sm font-semibold text-gray-400">
                  Loading chart statistics...
                </div>
              ) : isTrafficTrendError ? (
                renderErrorState(chartMode, "Failed to load traffic chart")
              ) : trafficTrendData.length === 0 ? (
                <div className="h-64 flex flex-col items-center justify-center bg-gray-50 rounded-2xl border border-dashed border-gray-200 text-center">
                  <Icon name="BarChart2" className="text-gray-305 mb-2" size={36} />
                  <p className="text-sm font-semibold text-gray-400">No data available</p>
                </div>
              ) : (
                <div className="w-full h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={trafficTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                      <XAxis
                        dataKey={chartMode === "daily" ? "date" : "month"}
                        tickFormatter={chartMode === "daily" ? formatChartDate : formatChartMonth}
                        tickLine={false}
                        axisLine={false}
                        tick={{ fill: "#64748B", fontSize: 10, fontWeight: "bold" }}
                      />
                      <YAxis
                        tickLine={false}
                        axisLine={false}
                        tick={{ fill: "#64748B", fontSize: 10, fontWeight: "bold" }}
                      />
                      <Tooltip
                        contentStyle={{
                          background: "#fff",
                          border: "1px solid #E2E8F0",
                          borderRadius: "12px",
                          boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.05)",
                        }}
                        labelFormatter={(label) =>
                          chartMode === "daily" ? formatChartDate(label) : formatChartMonth(label)
                        }
                      />
                      <Legend iconType="circle" wrapperStyle={{ fontSize: 11, fontWeight: "bold" }} />
                      <Line
                        type="monotone"
                        dataKey="totalRequests"
                        name="Total Requests"
                        stroke="#3B82F6"
                        strokeWidth={3}
                        dot={false}
                        activeDot={{ r: 6 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="activeUsers"
                        name="Active Users"
                        stroke="#10B981"
                        strokeWidth={3}
                        dot={false}
                        activeDot={{ r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          </div>

          {/* Module Usage Pie/Donut Chart (40% width) */}
          <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-150 shadow-sm flex flex-col min-h-[380px]">
            <div className="flex items-center gap-2 border-b border-gray-100 pb-4 mb-4">
              <Icon name="PieChart" className="text-indigo-600" size={20} />
              <h3 className="text-base font-bold text-gray-800">Module Usage</h3>
            </div>

            <div className="flex-1 flex flex-col justify-center">
              {sections.modules.loading ? (
                <div className="h-64 bg-gray-50 rounded-2xl border border-gray-150 animate-pulse flex items-center justify-center text-sm font-semibold text-gray-400">
                  Loading module statistics...
                </div>
              ) : sections.modules.error ? (
                renderErrorState("modules", "Failed to load module usage")
              ) : modulesData.length === 0 ? (
                <div className="h-64 flex flex-col items-center justify-center bg-gray-50 rounded-2xl border border-dashed border-gray-200 text-center">
                  <Icon name="PieChart" className="text-gray-305 mb-2" size={36} />
                  <p className="text-sm font-semibold text-gray-400">No data available</p>
                </div>
              ) : (
                <div className="w-full h-64 flex flex-col justify-between">
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        data={modulesData}
                        dataKey="requests"
                        nameKey="module"
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={75}
                        paddingAngle={3}
                      >
                        {modulesData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value) => [`${value.toLocaleString()} requests`, "Requests"]}
                        contentStyle={{
                          background: "#fff",
                          border: "1px solid #E2E8F0",
                          borderRadius: "12px",
                        }}
                      />
                      <Legend
                        layout="horizontal"
                        verticalAlign="bottom"
                        align="center"
                        iconType="circle"
                        wrapperStyle={{ fontSize: 10, fontWeight: "bold" }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Section D: Tables Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Table 1: Top APIs */}
          <div className="bg-white p-6 rounded-2xl border border-gray-150 shadow-sm flex flex-col min-h-[350px]">
            <div className="flex items-center gap-2 border-b border-gray-100 pb-4 mb-4">
              <Icon name="TrendingUp" className="text-indigo-600" size={20} />
              <h3 className="text-base font-bold text-gray-800">Top APIs</h3>
            </div>

            <div className="flex-1 flex flex-col justify-center">
              {sections.topApis.loading ? (
                <div className="space-y-4 animate-pulse w-full">
                  <div className="h-6 bg-gray-100 rounded w-full"></div>
                  <div className="h-10 bg-gray-50 rounded w-full"></div>
                  <div className="h-10 bg-gray-50 rounded w-full"></div>
                  <div className="h-10 bg-gray-50 rounded w-full"></div>
                </div>
              ) : sections.topApis.error ? (
                renderErrorState("topApis", "Failed to load top APIs")
              ) : topApis.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Icon name="Inbox" className="text-gray-305" size={36} />
                  <p className="text-sm font-semibold text-gray-400 mt-2">No data available</p>
                </div>
              ) : (
                <div className="overflow-x-auto border rounded-xl border-gray-150">
                  <table className="min-w-full divide-y divide-gray-150">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                          #
                        </th>
                        <th className="px-4 py-3 text-left text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                          Method
                        </th>
                        <th className="px-4 py-3 text-left text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                          Route
                        </th>
                        <th className="px-4 py-3 text-right text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                          Requests
                        </th>
                        <th className="px-4 py-3 text-right text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                          Avg Response
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100">
                      {topApis.map((row, index) => (
                        <tr key={index} className="hover:bg-gray-50/50 transition">
                          <td className="px-4 py-3 text-xs font-bold text-gray-400">{index + 1}</td>
                          <td className="px-4 py-3">{getMethodBadge(row.method)}</td>
                          <td className="px-4 py-3 text-xs font-semibold text-gray-700 font-mono tracking-tight">
                            {row.route}
                          </td>
                          <td className="px-4 py-3 text-right text-xs font-bold text-gray-600">
                            {row.totalRequests?.toLocaleString()}
                          </td>
                          <td className="px-4 py-3 text-right text-xs">
                            <span className={getAvgResponseColor(row.averageResponseTime)}>
                              {row.averageResponseTime} ms
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          {/* Table 2: Module Statistics */}
          <div className="bg-white p-6 rounded-2xl border border-gray-150 shadow-sm flex flex-col min-h-[350px]">
            <div className="flex items-center gap-2 border-b border-gray-100 pb-4 mb-4">
              <Icon name="Compass" className="text-indigo-600" size={20} />
              <h3 className="text-base font-bold text-gray-800">Module Statistics</h3>
            </div>

            <div className="flex-1 flex flex-col justify-center">
              {sections.modules.loading ? (
                <div className="space-y-4 animate-pulse w-full">
                  <div className="h-6 bg-gray-100 rounded w-full"></div>
                  <div className="h-10 bg-gray-50 rounded w-full"></div>
                  <div className="h-10 bg-gray-50 rounded w-full"></div>
                  <div className="h-10 bg-gray-50 rounded w-full"></div>
                </div>
              ) : sections.modules.error ? (
                renderErrorState("modules", "Failed to load module statistics")
              ) : sortedModules.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Icon name="Inbox" className="text-gray-305" size={36} />
                  <p className="text-sm font-semibold text-gray-400 mt-2">No data available</p>
                </div>
              ) : (
                <div className="overflow-x-auto border rounded-xl border-gray-150">
                  <table className="min-w-full divide-y divide-gray-150">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                          Module
                        </th>
                        <th className="px-4 py-3 text-right text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                          Requests
                        </th>
                        <th className="px-4 py-3 text-right text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                          % of Total
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100">
                      {sortedModules.map((row, index) => {
                        const pct =
                          totalModuleRequests > 0
                            ? ((row.requests / totalModuleRequests) * 100).toFixed(1)
                            : "0.0";
                        return (
                          <tr key={index} className="hover:bg-gray-50/50 transition">
                            <td className="px-4 py-3 text-xs font-bold text-gray-700">{row.module}</td>
                            <td className="px-4 py-3 text-right text-xs font-bold text-gray-650">
                              {row.requests?.toLocaleString()}
                            </td>
                            <td className="px-4 py-3 text-right">
                              <div className="flex items-center justify-end gap-3">
                                <span className="text-xs font-bold text-indigo-600">{pct}%</span>
                                <div className="w-16 bg-gray-100 rounded-full h-1.5 overflow-hidden">
                                  <div
                                    className="bg-indigo-500 h-1.5 rounded-full"
                                    style={{ width: `${Math.min(Number(pct), 100)}%` }}
                                  ></div>
                                </div>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Section E: Response Time Table */}
        <div className="bg-white p-6 rounded-2xl border border-gray-150 shadow-sm flex flex-col min-h-[420px]">
          <div className="flex items-center gap-2 border-b border-gray-100 pb-4 mb-4">
            <Icon name="Activity" className="text-indigo-600" size={20} />
            <h3 className="text-base font-bold text-gray-800">API Performance</h3>
          </div>

          <div className="flex-1 flex flex-col justify-between">
            {sections.apis.loading ? (
              <div className="space-y-4 animate-pulse w-full">
                <div className="h-6 bg-gray-100 rounded w-full"></div>
                <div className="h-10 bg-gray-50 rounded w-full"></div>
                <div className="h-10 bg-gray-50 rounded w-full"></div>
                <div className="h-10 bg-gray-50 rounded w-full"></div>
              </div>
            ) : sections.apis.error ? (
              renderErrorState("apis", "Failed to load API performance logs")
            ) : apisData.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <Icon name="Inbox" className="text-gray-305" size={40} />
                <p className="text-sm font-semibold text-gray-400 mt-2">No data available</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="overflow-x-auto border rounded-xl border-gray-150">
                  <table className="min-w-full divide-y divide-gray-150">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                          Method
                        </th>
                        <th className="px-4 py-3 text-left text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                          Route
                        </th>
                        <th className="px-4 py-3 text-right text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                          Total
                        </th>
                        <th className="px-4 py-3 text-right text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                          Success
                        </th>
                        <th className="px-4 py-3 text-right text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                          Failed
                        </th>
                        <th className="px-4 py-3 text-right text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                          Avg Response
                        </th>
                        <th className="px-4 py-3 text-left text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                          Last Accessed
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100">
                      {paginatedApis.map((row, index) => (
                        <tr key={index} className="hover:bg-gray-50/50 transition">
                          <td className="px-4 py-3">{getMethodBadge(row.method)}</td>
                          <td className="px-4 py-3 text-xs font-semibold text-gray-700 font-mono tracking-tight">
                            {row.route}
                          </td>
                          <td className="px-4 py-3 text-right text-xs font-bold text-gray-600">
                            {row.totalRequests?.toLocaleString()}
                          </td>
                          <td className="px-4 py-3 text-right text-xs font-bold text-emerald-600">
                            {row.successRequests?.toLocaleString()}
                          </td>
                          <td className="px-4 py-3 text-right text-xs font-bold text-rose-500">
                            {row.failedRequests?.toLocaleString()}
                          </td>
                          <td className="px-4 py-3 text-right text-xs">
                            <span className={getAvgResponseColor(row.averageResponseTime)}>
                              {row.averageResponseTime} ms
                            </span>
                          </td>
                          <td className="px-4 py-3 text-xs font-bold text-gray-400">
                            {formatTimestamp(row.lastAccessed)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination Controls */}
                <div className="flex items-center justify-between border-t border-gray-100 pt-4">
                  <span className="text-xs text-gray-500 font-medium">
                    Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, apisData.length)} of {apisData.length} endpoints
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-all ${
                        currentPage === 1
                          ? "text-gray-300 border-gray-100 bg-gray-50 cursor-not-allowed"
                          : "text-gray-600 border-gray-200 hover:bg-gray-50 cursor-pointer"
                      }`}
                    >
                      Previous
                    </button>
                    <span className="text-xs font-bold text-gray-700">
                      Page {currentPage} of {totalPages || 1}
                    </span>
                    <button
                      onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages || totalPages === 0}
                      className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-all ${
                        currentPage === totalPages || totalPages === 0
                          ? "text-gray-300 border-gray-100 bg-gray-50 cursor-not-allowed"
                          : "text-gray-600 border-gray-200 hover:bg-gray-50 cursor-pointer"
                      }`}
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
