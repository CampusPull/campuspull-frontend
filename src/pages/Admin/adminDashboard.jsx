import React, { useEffect, useState } from "react";
import api from "../../utils/api";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const AdminDashboard = () => {
  const [stats, setStats] = useState({ totalUsers: 0, newUsersLastWeek: 0 });
  const [users, setUsers] = useState([]); // State for filtered users
  const [selectedYear, setSelectedYear] = useState("all"); // State for year filter
  const [selectedGradYear, setSelectedGradYear] = useState("all");
  const [loading, setLoading] = useState(false);

  // 1. Fetch Stats (Runs once)
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get("/admin/stats");
        setStats(res.data);
      } catch (err) {
        console.error("Error fetching stats");
      }
    };
    fetchStats();
  }, []);

  // 2. Fetch Filtered Users (Runs every time selectedYear changes)
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        // Passing the year as a query parameter
        const res = await api.get(`/admin/users?year=${selectedYear}`);
        setUsers(res.data);
      } catch (err) {
        console.error("Error fetching users");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [selectedYear, selectedGradYear]);

  const chartData = [
    { name: "Last Week", users: stats.newUsersLastWeek },
    { name: "Total", users: stats.totalUsers },
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>

        {/* Year Filter Dropdown */}
        <div className="flex items-center gap-3 bg-white p-2 rounded-lg shadow-sm border">
          <label className="text-sm font-semibold text-gray-600">
            Filter Year:
          </label>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="outline-none bg-transparent text-indigo-600 font-bold text-sm cursor-pointer"
          >
            <option value="all">All Students</option>
            <option value="1">1st Year</option>
            <option value="2">2nd Year</option>
            <option value="3">3rd Year</option>
            <option value="4">4th Year</option>
          </select>
        </div>
        <div className="flex items-center gap-3 bg-white p-2 rounded-lg shadow-sm border">
          <label className="text-sm font-semibold text-gray-600">
            Grad Year:
          </label>
          <select
            value={selectedGradYear}
            onChange={(e) => setSelectedGradYear(e.target.value)}
            className="outline-none bg-transparent text-indigo-600 font-bold text-sm cursor-pointer"
          >
            <option value="all">All</option>
            <option value="2025">2025</option>
            <option value="2026">2026</option>
            <option value="2027">2027</option>
            <option value="2028">2028</option>
          </select>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
          <h3 className="text-gray-500 text-sm">Total Users</h3>
          <p className="text-4xl font-bold">{stats.totalUsers}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
          <h3 className="text-gray-500 text-sm">New Users (7 Days)</h3>
          <p className="text-4xl font-bold">{stats.newUsersLastWeek}</p>
        </div>
      </div>

      {/* Main Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart Section */}
        <div className="lg:col-span-1 bg-white p-6 rounded-lg shadow-md h-96">
          <h2 className="text-xl font-bold mb-4">User Growth</h2>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="users" fill="#4F46E5" barSize={50} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* User List Section */}
        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md overflow-hidden flex flex-col h-96">
          <h2 className="text-xl font-bold mb-4">
            Student List {selectedYear !== "all" && `(Year ${selectedYear})`}
          </h2>

          <div className="overflow-y-auto flex-1 border rounded-lg">
            {loading ? (
              <p className="p-4 text-center text-gray-500">
                Loading students...
              </p>
            ) : (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">
                      Name
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">
                      Year
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">
                      Role
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.length > 0 ? (
                    users.map((u) => (
                      <tr key={u._id}>
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                          {u.name}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                          {u.year || "N/A"}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 capitalize">
                          {u.role}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="3"
                        className="px-4 py-10 text-center text-gray-400"
                      >
                        No students found for this year.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
