import {
  BookOpen,
  Briefcase,
  Map,
  Folder,
} from "lucide-react";

import { useAcademic } from "../../../context/AcademicContext";

const SECTIONS = [
  {
    id: "ACADEMIC",
    label: "Academic",
    icon: BookOpen,
  },
  {
    id: "PLACEMENTS",
    label: "Placements",
    icon: Briefcase,
  },
  {
    id: "ROADMAPS",
    label: "Roadmaps",
    icon: Map,
  },
  {
    id: "GENERAL",
    label: "General",
    icon: Folder,
  },
];

const ResourceNavigator = () => {
  const {
    currentSection,
    fetchFolderTree,
  } = useAcademic();

  return (
    <div className="flex justify-center">
      <div className="inline-flex flex-wrap items-center gap-3 rounded-2xl border border-slate-200 bg-white p-2 shadow-sm">
        {SECTIONS.map((section) => {
          const Icon = section.icon;

          const active =
            currentSection === section.id;

          return (
            <button
              key={section.id}
              onClick={() =>
                fetchFolderTree(section.id)
              }
              className={`flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition-all duration-200 ${
                active
                  ? "bg-teal-600 text-white shadow-md"
                  : "text-slate-600 hover:bg-slate-100 hover:text-teal-600"
              }`}
            >
              <Icon size={18} />

              {section.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ResourceNavigator;