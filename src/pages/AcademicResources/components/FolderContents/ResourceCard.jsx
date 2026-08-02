import {
  CalendarDays,
  Download,
  FileText,
  Pencil,
  Trash2,
} from "lucide-react";

import { useAcademic } from "../../../../context/AcademicContext";
import { useAuth } from "../../../../context/AuthContext";

const ResourceCard = ({ resource, onEdit, onDelete }) => {
  const { folderContents, downloadResource } = useAcademic();
  const { user } = useAuth();

  const canEdit =
    user?.role === "admin" ||
    folderContents?.teacher?._id === user?._id;

  const handleDownload = async () => {
    try {
      await downloadResource(resource._id);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="group rounded-2xl border border-slate-200 bg-white p-5 transition-all duration-200 hover:-translate-y-1 hover:border-teal-300 hover:shadow-lg">
      <div className="flex items-start gap-4">
        {/* File Icon */}
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-teal-50 to-emerald-100 text-teal-600">
          <FileText size={24} />
        </div>

        {/* Content */}
        <div className="min-w-0 flex-1">
          <h3 className="line-clamp-2 text-lg font-semibold text-slate-900">
            {resource.title}
          </h3>

          {resource.description && (
            <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-500">
              {resource.description}
            </p>
          )}

          <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-slate-500">
            <div className="flex items-center gap-2">
              <CalendarDays size={15} />
              <span>
                {new Date(resource.createdAt).toLocaleDateString()}
              </span>
            </div>

            <div className="flex items-center gap-2 text-teal-700 font-medium">
              <Download size={15} />
              <span>{resource.downloads || 0} Downloads</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex shrink-0 flex-col gap-2">
          {canEdit && (
            <>
              <button
                onClick={() => onEdit(resource)}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-600 transition hover:border-teal-300 hover:bg-teal-50 hover:text-teal-700"
                title="Edit Resource"
              >
                <Pencil size={18} />
              </button>

              <button
                onClick={() => onDelete(resource)}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-red-200 text-red-600 transition hover:border-red-300 hover:bg-red-50"
                title="Delete Resource"
              >
                <Trash2 size={18} />
              </button>
            </>
          )}

          <button
            onClick={handleDownload}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-600 text-white transition hover:bg-teal-700"
            title="Download Resource"
          >
            <Download size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResourceCard;