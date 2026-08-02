import { AlertTriangle, Folder, FileText } from "lucide-react";

const DeleteFolderModal = ({
  open,
  mode = "confirm", // "confirm" | "blocked"
  folderName = "",
  resourceCount = 0,
  folderCount = 0,
  dynamicFolderCount = 0,
  loading = false,
  onConfirm,
  onCancel,
}) => {
  if (!open) return null;

  const isBlocked = mode === "blocked";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl">

        {/* Header */}
        <div className="border-b px-6 py-5">
          <div className="flex items-center gap-3">
            <div
              className={`rounded-full p-3 ${
                isBlocked ? "bg-amber-100" : "bg-red-100"
              }`}
            >
              <AlertTriangle
                className={`h-6 w-6 ${
                  isBlocked ? "text-amber-600" : "text-red-600"
                }`}
              />
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                {isBlocked ? "Cannot Delete Folder" : "Delete Folder"}
              </h2>

              <p className="text-sm text-gray-500">
                {isBlocked
                  ? "This folder still contains items."
                  : "This action cannot be undone."}
              </p>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="px-6 py-5">
          {isBlocked ? (
            <>
              <p className="text-sm text-gray-600">
               Remove all resources, subfolders, and teacher folders before deleting this folder.
              </p>

              <div className="mt-5 space-y-3 rounded-xl bg-gray-50 p-4">

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Folder className="h-5 w-5 text-blue-600" />
                    <span className="text-sm font-medium">
                      Subfolders
                    </span>
                  </div>

                  <span className="rounded-lg bg-blue-100 px-3 py-1 text-sm font-semibold text-blue-700">
                    {folderCount}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Folder className="h-5 w-5 text-blue-600" />
                    <span className="text-sm font-medium">
                        Teacher Folders
                    </span>
                  </div>

                  <span className="rounded-lg bg-blue-100 px-3 py-1 text-sm font-semibold text-blue-700">
                    {dynamicFolderCount}
                  </span>
                </div>



                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-green-600" />
                    <span className="text-sm font-medium">
                      Resources
                    </span>
                  </div>

                  <span className="rounded-lg bg-green-100 px-3 py-1 text-sm font-semibold text-green-700">
                    {resourceCount}
                  </span>
                </div>

              </div>

              <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 p-3">
                <p className="text-sm text-amber-800">
                  Folder deletion is only allowed when the folder is completely
                  empty to prevent accidental loss of study materials.
                </p>
              </div>
            </>
          ) : (
            <>
              <p className="text-gray-700">
                Are you sure you want to permanently delete this folder?
              </p>

              <div className="mt-4 rounded-xl bg-gray-100 px-4 py-3 font-semibold text-gray-900">
                {folderName}
              </div>

              <p className="mt-4 text-sm text-red-600">
                Once deleted, this folder cannot be recovered.
              </p>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 border-t px-6 py-4">
          {isBlocked ? (
            <button
              onClick={onCancel}
              className="rounded-xl bg-teal-600 px-5 py-2 font-medium text-white transition hover:bg-teal-700"
            >
              Got it
            </button>
          ) : (
            <>
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
                {loading ? "Deleting..." : "Delete Folder"}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default DeleteFolderModal;