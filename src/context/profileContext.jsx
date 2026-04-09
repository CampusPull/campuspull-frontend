import React, { createContext, useState, useEffect, useCallback, useMemo } from "react";
import api from "../utils/api";
import { useAuth } from "./AuthContext";

export const ProfileContext = createContext();

export const ProfileProvider = ({ children }) => {
  const { accessToken } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(!!accessToken);
  const [error, setError] = useState(null);

  // --- 1. Fetch Profile ---
  const fetchProfile = useCallback(async () => {
    if (!accessToken) {
      setLoading(false);
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const { data } = await api.get("/profile", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setProfile(data);
    } catch (err) {
      console.error("Fetch Profile Error:", err);
      setError(err.response?.data?.message || "Failed to fetch profile");
    } finally {
      setLoading(false);
    }
  }, [accessToken]);

  // --- 2. Generic Update (For Bio, Name, Links etc.) ---
  // Keeps existing functionality for non-array fields
  const updateProfile = useCallback(async (updates) => {
    if (!accessToken) return;
    setError(null);
    try {
      const { data } = await api.put("/profile", updates, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setProfile(data); // Full profile update
      return data;
    } catch (err) {
      console.error("Update Profile Error:", err);
      throw err;
    }
  }, [accessToken]);

  // --- 3. 🚀 NEW: Add Item (Projects, Exp, Certs, Education) ---
  // Calls: POST /api/profile/:section
  const addItemToProfile = useCallback(async (section, newItem) => {
    if (!accessToken) return;
    try {
      const { data } = await api.post(`/profile/${section}`, newItem, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      // Backend returns ONLY the updated array (e.g., just the projects list)
      // We merge it into the local state
      setProfile((prev) => ({ ...prev, [section]: data }));
      return data;
    } catch (err) {
      console.error(`Error adding to ${section}:`, err);
      throw err;
    }
  }, [accessToken]);

  // --- 4. 🚀 NEW: Edit Item (Projects, Exp, Certs, Education) ---
  // Calls: PUT /api/profile/:section/:itemId
  const editArrayItem = useCallback(async (section, itemId, updates) => {
    if (!accessToken) return;
    try {
      const { data } = await api.put(`/profile/${section}/${itemId}`, updates, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      // Backend returns updated array
      setProfile((prev) => ({ ...prev, [section]: data.data || data })); 
      return data;
    } catch (err) {
      console.error(`Error editing ${section}:`, err);
      throw err;
    }
  }, [accessToken]);

  // --- 5. 🚀 NEW: Delete Item (Projects, Exp, Certs, Education) ---
  // Calls: DELETE /api/profile/:section/:itemId
  const deleteArrayItem = useCallback(async (section, itemId) => {
    if (!accessToken) return;
    try {
      const { data } = await api.delete(`/profile/${section}/${itemId}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      // Backend returns updated array
      setProfile((prev) => ({ ...prev, [section]: data.data || data })); 
    } catch (err) {
      console.error(`Error deleting from ${section}:`, err);
      throw err;
    }
  }, [accessToken]);

  // --- 6. 🚀 NEW: Skill Management ---
  const addSkill = useCallback(async (newSkill) => {
    if (!accessToken) return;
    try {
      // Send as array: { skills: ["Java"] }
      const { data } = await api.post("/profile/skills", { skills: [newSkill] }, {
         headers: { Authorization: `Bearer ${accessToken}` },
      });
      setProfile((prev) => ({ ...prev, skills: data }));
    } catch (err) {
      console.error("Error adding skill:", err);
      throw err;
    }
  }, [accessToken]);

  const removeSkill = useCallback(async (skillName) => {
    if (!accessToken) return;
    try {
      const { data } = await api.delete(`/profile/skills/${skillName}`, {
         headers: { Authorization: `Bearer ${accessToken}` },
      });
      setProfile((prev) => ({ ...prev, skills: data }));
    } catch (err) {
      console.error("Error removing skill:", err);
      throw err;
    }
  }, [accessToken]);


  // --- 7. Upload Image Logic (Updated) ---
  const uploadPhoto = useCallback(async (file) => {
    if (!accessToken) return;
    const formData = new FormData();
    formData.append("photo", file);

    try {
      const { data } = await api.post("/profile/upload-photo", formData, {
        headers: { 
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${accessToken}` 
        },
      });

      const photoUrl = data.photoUrl || data.url;
      // Manually update local state so UI updates instantly
      setProfile(prev => ({ ...prev, profileImage: photoUrl }));
      
      return photoUrl;
    } catch (err) {
      console.error("Upload Logic Error:", err);
      throw err;
    }
  }, [accessToken]);

  // --- 8. 🚀 NEW: Delete Profile Photo ---
  const deleteProfilePhoto = useCallback(async () => {
    if (!accessToken) return;
    try {
      await api.delete("/profile/photo", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setProfile((prev) => ({ ...prev, profileImage: "" }));
    } catch (err) {
       console.error("Error deleting photo:", err);
       throw err;
    }
  }, [accessToken]);

  const sendPasswordOTP = useCallback(async () => {
    if (!accessToken) return;
    try {
      // Assuming your route is /api/users/change-password-otp
      // Adjust the URL if your backend route prefix is different
      const { data } = await api.post("/profile/change-password-otp", {}, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      return data;
    } catch (err) {
      console.error("Error sending OTP:", err);
      throw err;
    }
  }, [accessToken]);

  const verifyPasswordOTP = useCallback(async (otp, newPassword) => {
    if (!accessToken) return;
    try {
      const { data } = await api.put("/profile/change-password-verify", 
        { otp, newPassword }, 
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      return data;
    } catch (err) {
      console.error("Error verifying password:", err);
      throw err;
    }
  }, [accessToken]);


  // Initial Load
  useEffect(() => {
    if (accessToken) fetchProfile();
    else {
        setProfile(null);
        setLoading(false);
    }
  }, [fetchProfile, accessToken]);

  const contextValue = useMemo(
    () => ({ 
        profile, 
        loading, 
        error, 
        fetchProfile, 
        updateProfile,
        addItemToProfile, 
        editArrayItem,
        deleteArrayItem,
        addSkill,
        removeSkill,
        sendPasswordOTP,
        verifyPasswordOTP,
        uploadPhoto,
        deleteProfilePhoto
    }),
    [profile, loading, error, fetchProfile, updateProfile, addItemToProfile, editArrayItem, deleteArrayItem, addSkill, removeSkill, uploadPhoto, deleteProfilePhoto, sendPasswordOTP, verifyPasswordOTP]
  );

  return <ProfileContext.Provider value={contextValue}>{children}</ProfileContext.Provider>;
};