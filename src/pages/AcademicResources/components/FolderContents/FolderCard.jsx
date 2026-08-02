import {
  ChevronRight,
  FolderOpen,
  GraduationCap,
} from "lucide-react";

import { useAcademic } from "../../../../context/AcademicContext";

const FolderCard = ({ folder }) => {
  const {
    currentFolder,
    fetchFolderContents,
    fetchTeacherFolderContents,
  } = useAcademic();

  const isTeacherFolder =
    folder.type === "TEACHER_FOLDER";

  const handleFolderClick = () => {
    if (isTeacherFolder) {
      fetchTeacherFolderContents(currentFolder, folder._id);
      return;
    }

    fetchFolderContents(folder._id);
  };

  return (
    <button
      onClick={handleFolderClick}
      className="group w-full rounded-2xl border border-slate-200 bg-white p-5 text-left transition-all duration-200 hover:-translate-y-1 hover:border-teal-300 hover:shadow-lg"
    >
      <div className="flex items-start justify-between">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-teal-50 to-emerald-100 text-teal-600 transition group-hover:bg-teal-100">
          {isTeacherFolder ? (
            <GraduationCap size={24} />
          ) : (
            <FolderOpen size={24} />
          )}
        </div>

        <ChevronRight
          size={18}
          className="text-slate-400 transition group-hover:translate-x-1 group-hover:text-teal-600"
        />
      </div>

      <div className="mt-5">
        <div className="flex items-center gap-2">
          <h3 className="line-clamp-2 text-lg font-semibold text-slate-900">
            {folder.name}
          </h3>

          {isTeacherFolder && (
            <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-amber-700">
              Teacher
            </span>
          )}
        </div>

        {folder.description && (
          <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-500">
            {folder.description}
          </p>
        )}
      </div>

      <div className="mt-5 flex items-center justify-between border-t pt-4">
        <span className="text-xs font-medium text-slate-400">
          {isTeacherFolder ? "Open Teacher Folder" : "Open Folder"}
        </span>

        <span className="text-sm font-semibold text-teal-600 transition group-hover:translate-x-1">
          View →
        </span>
      </div>
    </button>
  );
};

export default FolderCard;