import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { getOpenInternships } from "../../services/applicationService";
import AddInternshipModal from "./AddInternshipModal";
import EditInternshipModal from "./EditInternshipModal";
import DeleteConfirmModal from "./DeleteConfirmModal";
import { Plus, Edit, Trash2, ShieldCheck, AlertCircle, Calendar, MapPin, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";

const SkeletonRow = () => (
  <tr className="animate-pulse border-b border-slate-100">
    <td className="p-4"><div className="h-4 bg-slate-100 rounded w-2/3"></div></td>
    <td className="p-4"><div className="h-4 bg-slate-100 rounded w-3/4"></div></td>
    <td className="p-4"><div className="h-4 bg-slate-100 rounded w-1/2"></div></td>
    <td className="p-4"><div className="h-6 bg-slate-100 rounded-full w-16"></div></td>
    <td className="p-4 flex gap-2"><div className="h-8 bg-slate-100 rounded w-10"></div><div className="h-8 bg-slate-100 rounded w-10"></div></td>
  </tr>
);

export default function AdminOpenInternships() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Page tracking state
  const initialPage = parseInt(searchParams.get("page") || "1", 10);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal Control States
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedInternship, setSelectedInternship] = useState(null);

  // Sync current page with URL search params
  useEffect(() => {
    const params = {};
    if (currentPage > 1) params.page = currentPage.toString();
    setSearchParams(params);
  }, [currentPage, setSearchParams]);

  const fetchListings = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getOpenInternships({
        page: currentPage,
        limit: 10,
        includeExpired: "true", // Admins always view all listings, expired or active
      });
      if (res && res.success) {
        setInternships(res.data || []);
        setTotalPages(res.totalPages || 1);
        setTotalItems(res.totalItems || 0);
      } else {
        throw new Error(res?.message || "Failed to fetch internships");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to fetch listings. Please check authorization or connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();
  }, [currentPage]);

  const handleEditClick = (item) => {
    setSelectedInternship(item);
    setIsEditOpen(true);
  };

  const handleDeleteClick = (item) => {
    setSelectedInternship(item);
    setIsDeleteOpen(true);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const isExpired = (deadlineStr) => {
    const deadline = new Date(deadlineStr);
    const now = new Date();
    // Normalize date parts to compare full days
    const cleanDeadline = new Date(deadline.getFullYear(), deadline.getMonth(), deadline.getDate());
    const cleanNow = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    return cleanDeadline < cleanNow;
  };

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20 pt-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        
        {/* ── SECTION A — HEADER + ACTION ── */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 bg-white border border-slate-100 p-6 rounded-3xl shadow-sm">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 border border-emerald-100 shadow-sm shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-800 leading-tight">Manage Open Internships</h1>
              <p className="text-xs font-semibold text-slate-400 mt-0.5">
                Open Internships: External opportunities linked from other platforms (students apply on original websites)
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsAddOpen(true)}
            className="flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-extrabold text-sm rounded-2xl hover:shadow-lg hover:shadow-emerald-500/20 transition-all cursor-pointer border border-emerald-400/20 active:scale-98 shrink-0"
          >
            <Plus className="w-4 h-4" />
            Add Open Internship
          </button>
        </div>

        {/* ── SECTION B & D — TABLE / STATES ── */}
        {loading ? (
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-xs font-black text-slate-400 uppercase tracking-widest">
                  <th className="p-4">Company</th>
                  <th className="p-4">Title</th>
                  <th className="p-4">Deadline</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: 5 }).map((_, idx) => (
                  <SkeletonRow key={idx} />
                ))}
              </tbody>
            </table>
          </div>
        ) : error ? (
          <div className="bg-white rounded-3xl border border-slate-100 p-16 text-center shadow-sm">
            <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="text-rose-500 w-8 h-8" />
            </div>
            <h3 className="text-lg font-extrabold text-slate-800 mb-2">Error Occurred</h3>
            <p className="text-slate-500 text-sm max-w-md mx-auto mb-6">{error}</p>
            <button
              onClick={fetchListings}
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl transition-all shadow-md shadow-indigo-600/10 cursor-pointer"
            >
              Retry
            </button>
          </div>
        ) : internships.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-100 p-16 text-center shadow-sm">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShieldCheck className="text-slate-400 w-8 h-8" />
            </div>
            <h3 className="text-lg font-extrabold text-slate-800 mb-2">No Internships Created</h3>
            <p className="text-slate-500 text-sm max-w-md mx-auto mb-6">
              There are no external internships posted yet. Click Add New Internship to create your first notice.
            </p>
            <button
              onClick={() => setIsAddOpen(true)}
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl transition-all shadow-md shadow-indigo-600/10 cursor-pointer"
            >
              Add New Internship
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[700px]">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    <th className="p-4">Company</th>
                    <th className="p-4">Title</th>
                    <th className="p-4">Deadline</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {internships.map((item) => {
                    const expired = isExpired(item.deadline);
                    return (
                      <tr key={item._id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="p-4">
                          <div className="font-extrabold text-slate-800 text-sm">{item.companyName}</div>
                          {item.location && (
                            <div className="text-[11px] font-bold text-slate-400 flex items-center gap-0.5 mt-0.5">
                              <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                              <span>{item.location}</span>
                            </div>
                          )}
                        </td>
                        <td className="p-4 font-bold text-slate-700 text-sm">{item.title}</td>
                        <td className="p-4 text-xs font-semibold text-slate-500">
                          {formatDate(item.deadline)}
                        </td>
                        <td className="p-4">
                          {expired ? (
                            <span className="inline-flex items-center px-2.5 py-1 text-[10px] font-extrabold rounded-full bg-rose-50 text-rose-700 border border-rose-100 uppercase tracking-wider">
                              Expired
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-1 text-[10px] font-extrabold rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 uppercase tracking-wider">
                              Active
                            </span>
                          )}
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleEditClick(item)}
                              className="p-2 border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
                              title="Edit Internship"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteClick(item)}
                              className="p-2 border border-slate-200 rounded-xl hover:bg-slate-50 text-rose-500 hover:text-rose-700 hover:bg-rose-50 transition-colors cursor-pointer"
                              title="Delete Internship"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                            <a
                              href={item.applyLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-500 hover:text-indigo-600 transition-colors cursor-pointer"
                              title="Visit Original Link"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── SECTION C — PAGINATION ── */}
        {!loading && totalPages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-100 mt-8 pt-6">
            <span className="text-xs font-bold text-slate-500">
              Showing Page {currentPage} of {totalPages}
            </span>
            <div className="flex items-center gap-2">
              <button
                disabled={currentPage <= 1}
                onClick={() => handlePageChange(currentPage - 1)}
                className="px-4 py-2.5 border border-slate-200 rounded-xl text-xs font-black text-slate-600 bg-white hover:bg-slate-50 disabled:opacity-50 disabled:pointer-events-none transition-all cursor-pointer"
              >
                Previous
              </button>
              <button
                disabled={currentPage >= totalPages}
                onClick={() => handlePageChange(currentPage + 1)}
                className="px-4 py-2.5 border border-slate-200 rounded-xl text-xs font-black text-slate-600 bg-white hover:bg-slate-50 disabled:opacity-50 disabled:pointer-events-none transition-all cursor-pointer"
              >
                Next
              </button>
            </div>
          </div>
        )}

      </div>

      {/* ── MODALS ── */}
      <AddInternshipModal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onSuccess={() => {
          setCurrentPage(1);
          fetchListings();
        }}
      />

      <EditInternshipModal
        isOpen={isEditOpen}
        onClose={() => {
          setIsEditOpen(false);
          setSelectedInternship(null);
        }}
        internship={selectedInternship}
        onSuccess={fetchListings}
      />

      <DeleteConfirmModal
        isOpen={isDeleteOpen}
        onClose={() => {
          setIsDeleteOpen(false);
          setSelectedInternship(null);
        }}
        internship={selectedInternship}
        onSuccess={fetchListings}
      />
    </div>
  );
}
