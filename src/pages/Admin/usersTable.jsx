import React, { useEffect, useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import api from '../../utils/api';
import { ModuleRegistry, AllCommunityModule, themeQuartz } from 'ag-grid-community';

ModuleRegistry.registerModules([AllCommunityModule]);

// Receive selectedYear and selectedGradYear as props from AdminDashboard
const UsersTable = ({ selectedYear = 'all', selectedGradYear = 'all' }) => {
  const [rowData, setRowData] = useState([]);
  const [loading, setLoading] = useState(false);

  const colDefs = [
    { field: "name", headerName: "Name", flex: 1, filter: true, pinned: 'left' },
    { field: "email", headerName: "Email", flex: 1.5, filter: true },
    { field: "year", headerName: "Year", width: 100, filter: true },
    { field: "graduationYear", headerName: "Grad Year", width: 130, filter: true },
    { 
      field: "role", 
      headerName: "Role", 
      width: 100, 
      filter: true,
      cellClass: (params) => params.value === 'admin' ? 'text-red-600 font-bold' : ''
    },
    {
      headerName: "Actions",
      field: "_id",
      width: 120,
      cellRenderer: (params) => (
        <button 
          onClick={() => deleteUser(params.value)}
          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-xs transition-all"
        >
          Delete
        </button>
      )
    }
  ];

  useEffect(() => {
    const fetchUsers = async () => {
      // Prevent fetching if values are accidentally undefined strings
      if (selectedYear === 'undefined' || selectedGradYear === 'undefined') return;
      
      setLoading(true);
      try {
        const res = await api.get(`/admin/users?year=${selectedYear}&graduationYear=${selectedGradYear}`);
        setRowData(res.data);
      } catch (err) {
        console.error("Error loading users:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [selectedYear, selectedGradYear]);

  const deleteUser = async (id) => {
    if (!window.confirm("Are you sure? This action is permanent.")) return;
    try {
      await api.delete(`/admin/user/${id}`); 
      setRowData(prev => prev.filter(user => user._id !== id));
    } catch (err) {
      console.error("Delete User Error:", err);
      alert("Failed to delete user");
    }
  };

  return (
    <div className="p-6 bg-gray-50 h-full">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-gray-800">User Database</h1>
        {loading && <span className="text-sm text-indigo-600 animate-pulse font-medium">Updating...</span>}
      </div>
      
      <div className="ag-theme-quartz shadow-sm rounded-xl overflow-hidden" style={{ height: 'calc(100vh - 200px)', width: '100%' }}>
        <AgGridReact 
            rowData={rowData} 
            columnDefs={colDefs}
            theme={themeQuartz}
            pagination={true}
            paginationPageSize={20}
        />
      </div>
    </div>
  );
};

export default UsersTable;