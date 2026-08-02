import {
  FolderOpen,
  GraduationCap,
  Upload,
} from "lucide-react";

import { useAcademic } from "../../../../context/AcademicContext";

const FolderHeader = ({ onUpload }) => {
  const { folderContents } = useAcademic();

  const { folder, teacher, canUpload } = folderContents;

  if (!folder) return null;

  const isTeacherFolder = folder.type === "TEACHER_FOLDER";

  return (
    <div className="rounded-2xl border bg-white p-7 shadow-sm">
      <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
        <div className="flex gap-5">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-50 text-teal-600">
            {isTeacherFolder ? (
              <GraduationCap size={28} />
            ) : (
              <FolderOpen size={28} />
            )}
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-3xl font-bold text-slate-900">
                {folder.name}
              </h1>

              {isTeacherFolder && (
                <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
                  Teacher Folder
                </span>
              )}
            </div>

            {teacher && (
              <p className="mt-2 text-sm font-medium text-teal-600">
                {teacher.name}
              </p>
            )}

            {folder.description && (
              <p className="mt-4 max-w-3xl leading-7 text-slate-600">
                {folder.description}
              </p>
            )}
          </div>
        </div>

        {canUpload && (
          <button
            onClick={onUpload}
            className="inline-flex items-center gap-2 rounded-xl bg-teal-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-teal-700"
          >
            <Upload size={18} />
            Upload Resource
          </button>
        )}
      </div>
    </div>
  );
};

export default FolderHeader;