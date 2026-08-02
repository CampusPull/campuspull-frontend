import { ChevronRight, Home } from "lucide-react";
import { useResource } from "../../../context/ResourceContext";

const Breadcrumbs = () => {
  const {
    currentSection,
    folderContents,
    fetchFolderTree,
    fetchFolderContents,
    clearCurrentSection,
  } = useResource();

  const breadcrumbs = folderContents?.breadcrumbs || [];

  if (!currentSection) return null;

  const sectionName =
    currentSection.charAt(0) +
    currentSection.slice(1).toLowerCase();

  return (
    <div className="mb-8 border-b border-slate-200 pb-4">
      <nav className="flex flex-wrap items-center gap-2 text-sm">
        {/* Resource Hub */}
        <button
          onClick={clearCurrentSection}
          className="flex items-center gap-1 rounded-md px-2 py-1 text-slate-500 transition hover:bg-slate-100 hover:text-teal-600"
        >
          <Home size={16} />
          <span>Resources</span>
        </button>

        <ChevronRight size={16} className="text-slate-400" />

        {/* Section */}
        <button
          onClick={() => fetchFolderTree(currentSection)}
          className={`rounded-md px-2 py-1 transition ${
            breadcrumbs.length === 0
              ? "cursor-default font-semibold text-teal-600"
              : "text-slate-500 hover:bg-slate-100 hover:text-teal-600"
          }`}
          disabled={breadcrumbs.length === 0}
        >
          {sectionName}
        </button>

        {/* Folder Path */}
        {breadcrumbs.map((item, index) => {
          const isLast = index === breadcrumbs.length - 1;

          return (
            <div
              key={item._id}
              className="flex items-center gap-2"
            >
              <ChevronRight
                size={16}
                className="text-slate-400"
              />

              <button
                disabled={isLast}
                onClick={() =>
                  !isLast && fetchFolderContents(item._id)
                }
                className={`rounded-md px-2 py-1 transition ${
                  isLast
                    ? "cursor-default font-semibold text-slate-900"
                    : "text-slate-500 hover:bg-slate-100 hover:text-teal-600"
                }`}
              >
                {item.name}
              </button>
            </div>
          );
        })}
      </nav>
    </div>
  );
};

export default Breadcrumbs;