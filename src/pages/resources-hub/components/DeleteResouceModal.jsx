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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md relative">

        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <Icon name="X" size={20} />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-red-100 rounded-full">
            <Icon name="Trash2" size={22} className="text-red-600" />
          </div>
          <h2 className="text-xl font-semibold text-wisdom-charcoal">
            Delete {resource.type}
          </h2>
        </div>

        <p className="text-sm text-gray-600 mb-4">
          Are you sure you want to permanently delete{" "}
          <span className="font-medium text-gray-900">
            {getResourceLabel()}
          </span>
          ? This action cannot be undone.
        </p>

        {error && (
          <p className="text-sm text-red-500 mb-3">
            {error}
          </p>
        )}

        <div className="flex justify-end gap-3">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </Button>

          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={loading}
          >
            {loading ? "Deleting..." : "Delete"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DeleteResourceModal;
