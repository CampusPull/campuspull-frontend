import React, { useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "react-hot-toast";

import { ResourceProvider, useResource } from "../../context/ResourceContext";
import { useAuth } from "../../context/AuthContext";

import ResourceNavigator from "./components/ResourceNavigator";
import Breadcrumbs from "./components/Breadcrumbs";
import FolderContents from "./components/FolderContents";
import FolderGrid from "./components/FolderContents/FolderGrid";
import FolderModal from "./components/Folder/FolderModal";
import DeleteFolderModal from "./components/Folder/DeleteFolderModal";
import UploadModal from "./components/Resource/UploadModal";
import DeleteResourceModal from "./components/Resource/DeleteResourceModal";

const ResourcePage = () => {
  const {
    currentSection,
    currentFolder,
    folderTree,
    folderContents,
    addFolder,
    editFolder,
    removeFolder,
    removeResource,
  } = useResource();

  const { user } = useAuth();
  const isTeacherFolder = Boolean(folderContents?.teacher);

  const [showFolderModal, setShowFolderModal] = useState(false);
  const [editingFolder, setEditingFolder] = useState(null);

  const [creatingFolder, setCreatingFolder] = useState(false);

  const [deleteModal, setDeleteModal] = useState({
    open: false,
    mode: "confirm",
  });

  const [deletingFolder, setDeletingFolder] = useState(false);

  // Resource Upload/Edit Modal
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [editingResource, setEditingResource] = useState(null);

  const [deleteResourceModal, setDeleteResourceModal] = useState(false);
  const [deletingResource, setDeletingResource] = useState(null);
  const [isDeletingResource, setIsDeletingResource] = useState(false);

  const openCreateResourceModal = () => {
    setEditingResource(null);
    setShowUploadModal(true);
  };

  const openEditResourceModal = (resource) => {
    setEditingResource(resource);
    setShowUploadModal(true);
  };

  const closeUploadModal = () => {
    setShowUploadModal(false);
    setEditingResource(null);
  };

  const openDeleteResourceModal = (resource) => {
    setDeletingResource(resource);
    setDeleteResourceModal(true);
  };

  const closeDeleteResourceModal = () => {
    setDeleteResourceModal(false);
    setDeletingResource(null);
  };

  const confirmDeleteResource = async () => {
    if (!deletingResource) return;

    try {
      setIsDeletingResource(true);

      await removeResource(deletingResource._id);

      toast.success("Resource deleted successfully.");

      closeDeleteResourceModal();
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to delete resource.",
      );
    } finally {
      setIsDeletingResource(false);
    }
  };

  /* -------------------------------------------------------------------------- */
  /*                               Create Folder                                */
  /* -------------------------------------------------------------------------- */

  const handleCreateFolder = async (folderData) => {
    try {
      setCreatingFolder(true);

      await addFolder(folderData);

      toast.success("Folder created successfully.");

      setShowFolderModal(false);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to create folder.");
    } finally {
      setCreatingFolder(false);
    }
  };

  /* -------------------------------------------------------------------------- */
  /*                                Edit Folder                                 */
  /* -------------------------------------------------------------------------- */

  const handleEditFolder = async (folderData) => {
    try {
      setCreatingFolder(true);

      await editFolder(editingFolder._id, folderData);

      toast.success("Folder updated successfully.");

      setShowFolderModal(false);
      setEditingFolder(null);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to update folder.");
    } finally {
      setCreatingFolder(false);
    }
  };

  const openEditFolder = () => {
    setEditingFolder(folderContents.folder);
    setShowFolderModal(true);
  };

  const handleDeleteFolder = () => {
    if (!folderContents?.folder) return;

    const resourceCount = folderContents.resources?.length || 0;
    const folderCount = folderContents.folders?.length || 0;
    const dynamicFolderCount = folderContents.dynamicFolders?.length || 0;

    setDeleteModal({
      open: true,
      mode:
        resourceCount > 0 || folderCount > 0 || dynamicFolderCount > 0
          ? "blocked"
          : "confirm",
    });
  };

  const confirmDeleteFolder = async () => {
    try {
      setDeletingFolder(true);

      await removeFolder(folderContents.folder._id);

      toast.success("Folder deleted successfully.");

      setDeleteModal({
        open: false,
        mode: "confirm",
      });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to delete folder.");
    } finally {
      setDeletingFolder(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-100 pt-24">
      <div className="mx-auto max-w-[1600px] px-6 pb-10">
        {/* Hero */}
        <div className="mb-8 overflow-hidden rounded-3xl bg-gradient-to-r from-teal-700 via-teal-600 to-emerald-600 p-8 text-white shadow-xl">
          <div className="max-w-3xl">
            <span className="inline-flex items-center rounded-full bg-white/15 px-4 py-1 text-sm font-medium backdrop-blur">
              📚 CampusPull Resources
            </span>

            <h1 className="mt-4 text-4xl font-bold">Learn. Organize. Share.</h1>

            <p className="mt-3 text-base text-teal-50">
              Browse academic resources, placement material, roadmaps and study
              notes organised into sections and folders.
            </p>
          </div>
        </div>

        {/* Navigation */}
        <div className="mb-8 flex items-center justify-center gap-8">
          <ResourceNavigator />

          {user?.role === "admin" && currentSection && !isTeacherFolder && (
            <button
              onClick={() => {
                setEditingFolder(null);
                setShowFolderModal(true);
              }}
              className="inline-flex items-center gap-2 rounded-xl bg-teal-600 px-5 py-3 text-sm font-semibold text-white shadow transition hover:bg-teal-700"
            >
              <Plus size={18} />
              New Folder
            </button>
          )}
        </div>

        <FolderModal
          open={showFolderModal}
          onClose={() => {
            setShowFolderModal(false);
            setEditingFolder(null);
          }}
          mode={editingFolder ? "edit" : "create"}
          initialData={editingFolder}
          onSubmit={editingFolder ? handleEditFolder : handleCreateFolder}
          loading={creatingFolder}
          currentSection={currentSection}
          currentFolder={currentFolder}
          folderTree={folderTree}
        />

        <DeleteFolderModal
          open={deleteModal.open}
          mode={deleteModal.mode}
          folderName={folderContents.folder?.name}
          resourceCount={folderContents.resources?.length || 0}
          folderCount={folderContents.folders?.length || 0}
          dynamicFolderCount={folderContents.dynamicFolders?.length || 0}
          loading={deletingFolder}
          onConfirm={confirmDeleteFolder}
          onCancel={() =>
            setDeleteModal({
              open: false,
              mode: "confirm",
            })
          }
        />

        <UploadModal
          isOpen={showUploadModal}
          onClose={closeUploadModal}
          mode={editingResource ? "edit" : "create"}
          initialData={editingResource}
        />

        <DeleteResourceModal
          open={deleteResourceModal}
          resourceTitle={deletingResource?.title}
          loading={isDeletingResource}
          onConfirm={confirmDeleteResource}
          onCancel={closeDeleteResourceModal}
        />

        {/* Main */}
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <Breadcrumbs />

          {currentSection && !currentFolder && (
            <div className="mt-8">
              <FolderGrid folders={folderTree} />
            </div>
          )}

          {currentFolder && (
            <>
              {user?.role === "admin" && !isTeacherFolder && (
                <div className="mb-5 flex justify-end gap-3">
                  <button
                    onClick={openEditFolder}
                    className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-amber-600"
                  >
                    <Pencil size={16} />
                    Edit Folder
                  </button>

                  <button
                    onClick={handleDeleteFolder}
                    className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
                  >
                    <Trash2 size={16} />
                    Delete Folder
                  </button>
                </div>
              )}

              <div className="mt-8">
                <FolderContents
                  onUpload={openCreateResourceModal}
                  onEdit={openEditResourceModal}
                  onDelete={openDeleteResourceModal}
                />
              </div>
            </>
          )}

          {!currentSection && (
            <div className="py-24 text-center">
              <h2 className="text-2xl font-bold text-slate-800">
                Select a Resource Section
              </h2>

              <p className="mt-3 text-slate-500">
                Choose Academic, Placements, Roadmaps or General to begin
                browsing.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const ResourceLibrary = () => {
  return (
    <ResourceProvider>
      <ResourcePage />
    </ResourceProvider>
  );
};

export default ResourceLibrary;
