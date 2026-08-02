// src/pages/ResourceLibrary/components/modals/FolderModal.jsx

import { useEffect, useState } from "react";
import { X } from "lucide-react";

const AVAILABLE_ROLES = ["admin", "teacher", "alumni"];

const FolderModal = ({
  open,
  onClose,
  onSubmit,
  loading = false,
  mode = "create",
  initialData = null,
  currentSection,
  folderTree = [],
  currentFolder = null,
}) => {
  const [name, setName] = useState("");
  const [parentFolder, setParentFolder] = useState("");
  const [uploadRoles, setUploadRoles] = useState(["admin"]);

  useEffect(() => {
    if (!open) return;

    if (mode === "edit" && initialData) {
      setName(initialData.name || "");
      setUploadRoles(initialData.uploadRoles || ["admin"]);
      setParentFolder("");
      return;
    }

    setName("");
    setParentFolder(currentFolder?._id || "");
    setUploadRoles(["admin"]);
  }, [open, mode, initialData, currentFolder]);

  const handleRoleToggle = (role) => {
    if (uploadRoles.includes(role)) {
      setUploadRoles((prev) => prev.filter((r) => r !== role));
    } else {
      setUploadRoles((prev) => [...prev, role]);
    }
  };

  const flattenFolders = (folders, depth = 0) => {
    let result = [];

    folders.forEach((folder) => {
      result.push({
        _id: folder._id,
        name: `${"— ".repeat(depth)}${folder.name}`,
      });

      if (folder.children?.length) {
        result = result.concat(flattenFolders(folder.children, depth + 1));
      }
    });

    return result;
  };

  const folderOptions = flattenFolders(folderTree);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name.trim()) return;

    if (uploadRoles.length === 0) return;

    if (mode === "edit") {
      onSubmit({
        name: name.trim(),
        uploadRoles,
      });
    } else {
      onSubmit({
        name: name.trim(),
        section: currentSection,
        parentFolder: parentFolder || null,
        uploadRoles,
      });
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
          <h2 className="text-xl font-semibold text-slate-800">
            {mode === "edit" ? "Edit Folder" : "Create Folder"}
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 transition hover:bg-slate-100"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="space-y-6 p-6">

          {/* Folder Name */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Folder Name
            </label>

            <input
              autoFocus
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter folder name"
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-teal-500"
            />
          </div>

          {/* Parent Folder */}
          {mode === "create" && (
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Parent Folder
              </label>

              <select
                value={parentFolder}
                onChange={(e) => setParentFolder(e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-teal-500"
              >
                <option value="">None</option>

                {folderOptions.map((folder) => (
                  <option key={folder._id} value={folder._id}>
                    {folder.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Upload Roles */}
          <div>
            <label className="mb-3 block text-sm font-medium text-slate-700">
              Who can upload?
            </label>

            <div className="space-y-3">
              {AVAILABLE_ROLES.map((role) => (
                <label
                  key={role}
                  className="flex items-center gap-3"
                >
                  <input
                    type="checkbox"
                    checked={uploadRoles.includes(role)}
                    onChange={() => handleRoleToggle(role)}
                  />

                  <span className="capitalize text-slate-700">
                    {role}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 border-t border-slate-200 pt-5">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-300 px-5 py-2.5 font-medium text-slate-700 transition hover:bg-slate-100"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="rounded-xl bg-teal-600 px-5 py-2.5 font-medium text-white transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading
                ? mode === "edit"
                  ? "Saving..."
                  : "Creating..."
                : mode === "edit"
                ? "Save Changes"
                : "Create Folder"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FolderModal;