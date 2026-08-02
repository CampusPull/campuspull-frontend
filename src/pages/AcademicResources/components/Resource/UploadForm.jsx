import { useState } from "react";
import { FileText, Link2 } from "lucide-react";

import FileDropzone from "./FileDropzone";
import { useAcademic } from "../../../../context/AcademicContext";

const UploadForm = ({ onClose, mode = "create", initialData = null }) => {
  const { folderContents, uploadResource, updateResource, loading } =
    useAcademic();
  const isEdit = mode === "edit";
  const folderId = folderContents?.folder?._id;

  const [uploadMethod, setUploadMethod] = useState(
    initialData?.resourceType || "FILE",
  );

  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    description: initialData?.description || "",
    externalUrl: initialData?.externalUrl || "",
    tags: initialData?.tags?.join(", ") || "",
  });

  const [file, setFile] = useState(null);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (uploadMethod === "FILE" && !isEdit && !file) {
      return alert("Please select a file.");
    }

    if (uploadMethod === "LINK" && !formData.externalUrl.trim()) {
      return alert("Please enter a resource URL.");
    }

    try {
      const data = new FormData();

      data.append("title", formData.title);
      data.append("description", formData.description);
      if (!isEdit) {
        data.append("folder", folderId);
      }

      if (formData.tags.trim()) {
        data.append("tags", formData.tags);
      }

      if (uploadMethod === "FILE") {
        if (file) {
          data.append("file", file);
        }
      } else {
        data.append("externalUrl", formData.externalUrl);
      }

      if (isEdit) {
        await updateResource(initialData._id, data);
      } else {
        await uploadResource(data);
      }

      if (!isEdit) {
        setFormData({
          title: "",
          description: "",
          externalUrl: "",
          tags: "",
        });

        setFile(null);
        setUploadMethod("FILE");
      }

      onClose();
    } catch (error) {
      console.error(error);

      alert(error.response?.data?.message || "Failed to upload resource.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Upload Method */}
      <div>
        <label className="mb-3 block text-sm font-semibold text-slate-700">
          {isEdit ? "Resource Type" : "Upload Method"}
        </label>

        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            disabled={isEdit}
            onClick={() => setUploadMethod("FILE")}
            className={`rounded-2xl border p-5 text-left transition ${
              isEdit ? "cursor-not-allowed opacity-60" : ""
            } ${
              uploadMethod === "FILE"
                ? "border-teal-600 bg-teal-50"
                : "border-slate-200 hover:border-teal-300 hover:bg-slate-50"
            }`}
          >
            <FileText className="mb-3 text-teal-600" size={28} />

            <h3 className="font-semibold text-slate-900">Upload File</h3>
          </button>

          <button
            type="button"
            disabled={isEdit}
            onClick={() => setUploadMethod("LINK")}
            className={`rounded-2xl border p-5 text-left transition ${
              isEdit ? "cursor-not-allowed opacity-60" : ""
            } ${
              uploadMethod === "LINK"
                ? "border-teal-600 bg-teal-50"
                : "border-slate-200 hover:border-teal-300 hover:bg-slate-50"
            }`}
          >
            <Link2 className="mb-3 text-teal-600" size={28} />

            <h3 className="font-semibold text-slate-900">External Link</h3>
          </button>
        </div>
      </div>

      {/* Upload Area */}
      {uploadMethod === "FILE" ? (
        <>
          {isEdit && (
            <p className="mb-3 text-sm text-slate-500">
              Leave empty if you don't want to replace the existing file.
            </p>
          )}

          <FileDropzone file={file} setFile={setFile} />
        </>
      ) : (
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            {isEdit ? "Resource URL" : "Resource URL *"}
          </label>

          <input
            type="url"
            name="externalUrl"
            value={formData.externalUrl}
            onChange={handleChange}
            placeholder="https://example.com/resource"
            className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
            required
          />
        </div>
      )}

      {/* Title & Tags */}
      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Title *
          </label>

          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Operating Systems Unit 1 Notes"
            className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
            required
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Tags
          </label>

          <input
            type="text"
            name="tags"
            value={formData.tags}
            onChange={handleChange}
            placeholder="OS, Notes, Unit 1"
            className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
          />
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">
          Description
        </label>

        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={4}
          placeholder="Add a short description about this resource..."
          className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
        />
      </div>

      {/* Footer */}
      <div className="flex justify-end gap-3 border-t border-slate-200 pt-5">
        <button
          type="button"
          onClick={onClose}
          className="rounded-xl border border-slate-300 px-5 py-2.5 font-medium transition hover:bg-slate-100"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={loading}
          className="rounded-xl bg-teal-600 px-6 py-2.5 font-medium text-white transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading
            ? isEdit
              ? "Updating..."
              : "Uploading..."
            : isEdit
              ? "Update Resource"
              : "Upload"}
        </button>
      </div>
    </form>
  );
};

export default UploadForm;
