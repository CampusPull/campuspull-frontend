import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

import * as resourceService from "../services/resourceService";

export const AcademicContext = createContext();

const EMPTY_FOLDER_CONTENTS = {
  folder: null,
  teacher: null,
  breadcrumbs: [],
  folders: [],
  dynamicFolders: [],
  resources: [],
  canUpload: false,
};

export const AcademicProvider = ({ children }) => {
  /* -------------------------------------------------------------------------- */
  /*                                   State                                    */
  /* -------------------------------------------------------------------------- */

  const [folderTree, setFolderTree] = useState([]);
  const [currentSection, setCurrentSection] = useState(null);
  const [currentFolder, setCurrentFolder] = useState(null);

  const [folderContents, setFolderContents] = useState(EMPTY_FOLDER_CONTENTS);

  const [bookmarks, setBookmarks] = useState([]);

  const [searchResults, setSearchResults] = useState({
    folders: [],
    resources: [],
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /* -------------------------------------------------------------------------- */
  /*                                Folder APIs                                 */
  /* -------------------------------------------------------------------------- */

  const fetchFolderTree = useCallback(async (section) => {
    try {
      setLoading(true);
      setError(null);

      const data = await resourceService.getFolderTree(section);

      setCurrentSection(section);
      // NEW
      setCurrentFolder(null);

      setFolderContents(EMPTY_FOLDER_CONTENTS);
      setFolderTree(Array.isArray(data) ? data : []);
    } catch (err) {
      setFolderTree([]);
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchFolderContents = useCallback(async (folderId) => {
    try {
      setLoading(true);
      setError(null);

      const data = await resourceService.getFolderContents(folderId);

      setCurrentFolder(folderId);
      setFolderContents(data);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchTeacherFolderContents = useCallback(
    async (folderId, teacherId) => {
      try {
        setLoading(true);
        setError(null);

        const data = await resourceService.getTeacherFolderContents(
          folderId,
          teacherId,
        );

        setCurrentFolder(folderId);
        setFolderContents(data);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const addFolder = async (payload) => {
    try {
      setLoading(true);

      const folder = await resourceService.createFolder(payload);

      if (currentSection) {
        await fetchFolderTree(currentSection);
      }

      if (currentFolder) {
        await fetchFolderContents(currentFolder);
      }

      return folder;
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const editFolder = async (folderId, payload) => {
    try {
      setLoading(true);

      const folder = await resourceService.updateFolder(folderId, payload);

      if (currentSection) {
        await fetchFolderTree(currentSection);
      }

      if (currentFolder) {
        await fetchFolderContents(currentFolder);
      }

      return folder;
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const removeFolder = async (folderId) => {
    try {
      setLoading(true);

      await resourceService.deleteFolder(folderId);

      if (currentSection) {
        await fetchFolderTree(currentSection);
      }

      if (currentFolder) {
        await fetchFolderContents(currentFolder);
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /* -------------------------------------------------------------------------- */
  /*                               Resource APIs                                */
  /* -------------------------------------------------------------------------- */

  const uploadResource = async (formData) => {
    try {
      setLoading(true);

      const resource = await resourceService.uploadResource(formData);

      if (currentFolder) {
        await fetchFolderContents(currentFolder);
      }

      return resource;
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateResource = async (resourceId, formData) => {
    try {
      setLoading(true);

      const resource = await resourceService.updateResource(
        resourceId,
        formData,
      );

      if (currentFolder) {
        await fetchFolderContents(currentFolder);
      }

      return resource;
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const removeResource = async (resourceId) => {
    try {
      setLoading(true);

      await resourceService.deleteResource(resourceId);

      if (currentFolder) {
        await fetchFolderContents(currentFolder);
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /* -------------------------------------------------------------------------- */
  /*                                Search API                                  */
  /* -------------------------------------------------------------------------- */

  const search = async (query) => {
    try {
      setLoading(true);

      const results = await resourceService.searchResources(query);

      setSearchResults(results);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  /* -------------------------------------------------------------------------- */
  /*                               Bookmark API                                 */
  /* -------------------------------------------------------------------------- */

  const fetchBookmarks = async () => {
    try {
      const data = await resourceService.getBookmarks();
      setBookmarks(data);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };

  const toggleBookmark = async (resourceId) => {
    try {
      await resourceService.toggleBookmark(resourceId);

      await fetchBookmarks();

      if (currentFolder) {
        await fetchFolderContents(currentFolder);
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };

  /* -------------------------------------------------------------------------- */
  /*                             View / Download                                */
  /* -------------------------------------------------------------------------- */

  const viewResource = async (resourceId) => {
    const data = await resourceService.viewResource(resourceId);

    if (data?.success && data?.viewUrl) {
      window.open(data.viewUrl, "_blank", "noopener,noreferrer");
    }

    return data;
  };
  
 const downloadResource = async (resourceId) => {
  const data = await resourceService.downloadResource(resourceId);

  if (data?.success && data?.downloadUrl) {
    window.open(
      data.downloadUrl,
      "_blank",
      "noopener,noreferrer"
    );
  }

  return data;
};

  /*                           Clear Current Section                             */

  const clearCurrentSection = () => {
    setCurrentSection(null);
    setCurrentFolder(null);
    setFolderTree([]);

    setFolderContents(EMPTY_FOLDER_CONTENTS);
  };

  const clearCurrentFolder = () => {
    setCurrentFolder(null);

    setFolderContents(EMPTY_FOLDER_CONTENTS);
  };

  /* -------------------------------------------------------------------------- */

  const value = useMemo(
    () => ({
      folderTree,
      currentSection,
      currentFolder,
      folderContents,
      bookmarks,
      searchResults,
      loading,
      error,

      fetchFolderTree,
      fetchFolderContents,
      fetchTeacherFolderContents,
      clearCurrentSection,
      clearCurrentFolder,

      addFolder,
      editFolder,
      removeFolder,

      uploadResource,
      updateResource,
      removeResource,

      search,

      fetchBookmarks,
      toggleBookmark,

      viewResource,
      downloadResource,
    }),
    [
      folderTree,
      currentSection,
      currentFolder,
      folderContents,
      bookmarks,
      searchResults,
      loading,
      error,
      fetchFolderTree,
      fetchFolderContents,
      fetchTeacherFolderContents,
    ],
  );

  return (
    <AcademicContext.Provider value={value}>
      {children}
    </AcademicContext.Provider>
  );
};

export const useAcademic = () => useContext(AcademicContext);
