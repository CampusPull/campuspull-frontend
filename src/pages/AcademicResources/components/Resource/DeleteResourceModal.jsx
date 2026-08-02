import { AlertTriangle, FileText } from "lucide-react";

const DeleteResourceModal = ({
  open,
  resourceTitle = "",
  loading = false,
  onConfirm,
  onCancel,
}) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="border-b px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-red-100 p-3">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Delete Resource
              </h2>

              <p className="text-sm text-gray-500">
                This action cannot be undone.
              </p>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="px-6 py-5">
          <p className="text-gray-700">
            Are you sure you want to permanently delete this resource?
          </p>

          <div className="mt-4 flex items-center gap-3 rounded-xl bg-gray-100 px-4 py-3">
            <FileText className="h-5 w-5 text-teal-600" />

            <span className="font-semibold text-gray-900">
              {resourceTitle}
            </span>
          </div>

          <p className="mt-4 text-sm text-red-600">
            Once deleted, this resource cannot be recovered.
          </p>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 border-t px-6 py-4">
          <button
            onClick={onCancel}
            disabled={loading}
            className="rounded-xl border border-gray-300 px-5 py-2 font-medium hover:bg-gray-50"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            disabled={loading}
            className="rounded-xl bg-red-600 px-5 py-2 font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Deleting..." : "Delete Resource"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteResourceModal;