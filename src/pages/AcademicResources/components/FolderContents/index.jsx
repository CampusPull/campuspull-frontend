import { Loader2 } from "lucide-react";

import { useAcademic } from "../../../../context/AcademicContext";

import FolderHeader from "./FolderHeader";
import FolderGrid from "./FolderGrid";
import ResourceGrid from "./ResourceGrid";
import EmptyState from "./EmptyState";

const FolderContents = ({ onUpload, onEdit, onDelete }) => {
  const { folderContents, loading } = useAcademic();

  const {
    folders = [],
    dynamicFolders = [],
    resources = [],
  } = folderContents;

  const childFolders = [...folders, ...dynamicFolders];

  if (loading) {
    return (
      <div className="flex h-72 items-center justify-center rounded-2xl border bg-white">
        <div className="flex flex-col items-center gap-3">
          <Loader2
            size={30}
            className="animate-spin text-teal-600"
          />

          <p className="text-sm text-slate-500">
            Loading resources...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <FolderHeader onUpload={onUpload} />

      {/* Child folders (subfolders / teachers) */}
      {childFolders.length > 0 && (
        <section className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Browse Further
            </h2>

            <p className="text-sm text-slate-500">
              Select a folder to continue.
            </p>
          </div>

          <FolderGrid folders={childFolders} />
        </section>
      )}

      {/* Resources */}
      {resources.length > 0 && (
        <section className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Resources
            </h2>

            <p className="text-sm text-slate-500">
              Notes, PDFs, presentations and study material.
            </p>
          </div>

          <ResourceGrid
            resources={resources}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        </section>
      )}

      {/* Empty */}
      {!childFolders.length && !resources.length && (
        <EmptyState />
      )}
    </div>
  );
};

export default FolderContents;