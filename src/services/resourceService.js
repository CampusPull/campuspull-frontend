// src/services/resourceService.js

import api from "../utils/api";

const BASE_URL = "/resources";

/* -------------------------------------------------------------------------- */
/*                                 Folder APIs                                */
/* -------------------------------------------------------------------------- */

export const getFolderTree = async (section) => {
  const { data } = await api.get(`${BASE_URL}/folders/tree`, {
    params: { section },
  });

  return data.tree;
};

export const getFolderContents = async (folderId) => {
  const { data } = await api.get(`${BASE_URL}/folders/${folderId}`);
  return data;
};

export const getTeacherFolderContents = async (
  folderId,
  teacherId
) => {
  const { data } = await api.get(
    `${BASE_URL}/${folderId}/teacher/${teacherId}`
  );

  return data;
};

export const createFolder = async (payload) => {
  const { data } = await api.post(`${BASE_URL}/folders`, payload);
  return data;
};

export const updateFolder = async (folderId, payload) => {
  const { data } = await api.put(
    `${BASE_URL}/folders/${folderId}`,
    payload
  );
  return data;
};

export const deleteFolder = async (folderId) => {
  const { data } = await api.delete(
    `${BASE_URL}/folders/${folderId}`
  );
  return data;
};

/* -------------------------------------------------------------------------- */
/*                               Resource APIs                                */
/* -------------------------------------------------------------------------- */

export const uploadResource = async (formData) => {
  const { data } = await api.post(
    BASE_URL,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return data;
};

export const getResourceById = async (resourceId) => {
  const { data } = await api.get(
    `${BASE_URL}/${resourceId}`
  );

  return data;
};

export const updateResource = async (resourceId, formData) => {
  const { data } = await api.put(
    `${BASE_URL}/${resourceId}`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return data;
};

export const deleteResource = async (resourceId) => {
  const { data } = await api.delete(
    `${BASE_URL}/${resourceId}`
  );

  return data;
};

/* -------------------------------------------------------------------------- */
/*                                Search API                                  */
/* -------------------------------------------------------------------------- */

export const searchResources = async (query) => {
  const { data } = await api.get(
    `${BASE_URL}/search`,
    {
      params: { q: query },
    }
  );

  return data;
};

/* -------------------------------------------------------------------------- */
/*                               Bookmark APIs                                */
/* -------------------------------------------------------------------------- */

export const toggleBookmark = async (resourceId) => {
  const { data } = await api.post(
    `${BASE_URL}/bookmarks/${resourceId}`
  );

  return data;
};

export const getBookmarks = async () => {
  const { data } = await api.get(
    `${BASE_URL}/bookmarks/me`
  );

  return data;
};

/* -------------------------------------------------------------------------- */
/*                          View / Download APIs                              */
/* -------------------------------------------------------------------------- */

export const viewResource = async (resourceId) => {
  const { data } = await api.get(
    `${BASE_URL}/${resourceId}/view`
  );

  return data;
};

export const downloadResource = async (resourceId) => {
  const { data } = await api.get(
    `${BASE_URL}/${resourceId}/download`
  );

  return data;
};