import UploadForm from "./UploadForm";

const UploadModal = ({
  isOpen,
  onClose,
  mode = "create",
  initialData = null,
}) => {
  if (!isOpen) return null;

  const isEdit = mode === "edit";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-xl overflow-hidden rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <h2 className="text-xl font-semibold text-slate-900">
            {isEdit ? "Edit Resource" : "Upload Resource"}
          </h2>

          <button
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="max-h-[75vh] overflow-y-auto p-6">
          <UploadForm
            onClose={onClose}
            mode={mode}
            initialData={initialData}
          />
        </div>
      </div>
    </div>
  );
};

export default UploadModal;