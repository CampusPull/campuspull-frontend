import React, { useContext, useState } from "react";
import { ResourceContext } from "../../../context/resourceContext";
import Icon from "../../../components/AppIcon";
import Button from "../../../components/ui/Button";

const DeleteResourceModal = ({ isOpen, onClose, resource }) => {
  const {
    deleteNote,
    deleteRoadmap,
    deletePYQ,
  } = useContext(ResourceContext);

  if (!isOpen || !resource?.type) {
    return null;
  }

  const { type, _id, title, company } = resource;

  // Normalize type
  const resourceKey = type.startsWith("Interview")
    ? "pyq"
    : type.toLowerCase();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleDelete = async () => {
    setLoading(true);
    setError(null);

    try {
      if (resourceKey === "notes") {
        await deleteNote(_id);
      } else if (resourceKey === "roadmap") {
        await deleteRoadmap(_id);
      } else if (resourceKey === "pyq") {
        await deletePYQ(_id);
      }

      onClose();
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  };

  const getResourceLabel = () => {
    if (resourceKey === "notes") return title;
    if (resourceKey === "roadmap") return title;
    if (resourceKey === "pyq") return company;
    return "this resource";
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="bg-white border border-slate-100 rounded-3xl p-6 w-full max-w-md relative text-slate-800 shadow-2xl">

        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200/60 text-slate-400 hover:text-slate-600 focus:outline-none transition-all duration-200 cursor-pointer"
        >
          <Icon name="X" size={16} />
        </button>

        <div className="flex items-center gap-3 mb-4 text-left">
          <div className="p-2.5 bg-rose-50 border border-rose-100 rounded-full flex items-center justify-center">
            <Icon name="Trash2" size={20} className="text-red-500" />
          </div>
          <h2 className="text-xl font-extrabold text-slate-800 font-poppins">
            Delete {resource.type}
          </h2>
        </div>

        <p className="text-sm text-slate-400 mb-6 text-left leading-relaxed font-semibold">
          Are you sure you want to permanently delete{" "}
          <span className="font-extrabold text-slate-700">
            {getResourceLabel()}
          </span>
          ? This action cannot be undone.
        </p>

        {error && (
          <p className="text-xs font-bold text-center text-red-600 bg-rose-50 border border-rose-200 py-2 px-3 rounded-xl animate-pulse mb-4">
            {error}
          </p>
        )}

        <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
          <button
            className="border border-slate-200 hover:border-slate-300 text-slate-500 hover:text-slate-800 hover:bg-slate-50 font-bold text-xs py-2.5 px-4 rounded-xl bg-transparent cursor-pointer"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </button>

          <button
            className="bg-red-600 hover:bg-red-700 text-white border-none font-bold text-xs py-2.5 px-5 rounded-xl cursor-pointer shadow-sm hover:shadow-lg shadow-red-500/10 flex items-center justify-center min-w-[72px]"
            onClick={handleDelete}
            disabled={loading}
          >
            {loading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteResourceModal;
