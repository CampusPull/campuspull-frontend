import api from "../utils/api";

/**
 * Fetch applications submitted by the logged-in student.
 * Route: GET /applications/me
 */
export const getApplications = async () => {
  const res = await api.get("/applications/me");
  return res.data;
};

/**
 * Fetch all applications for a specific internship (Admin authenticated).
 * Route: GET /internships/:internshipId/applications
 */
export const getInternshipApplications = async (internshipId) => {
  const res = await api.get(`/internships/${internshipId}/applications`);
  return res.data;
};

/**
 * Fetch details of a specific application by ID (Admin authenticated).
 * Route: GET /applications/:applicationId
 */
export const getApplicationById = async (applicationId) => {
  const res = await api.get(`/applications/${applicationId}`);
  return res.data;
};

/**
 * Submit a new internship application.
 * Route: POST /applications
 */
export const createApplication = async (applicationData) => {
  const res = await api.post("/applications", applicationData);
  return res.data;
};

/**
 * Update the status of a candidate's application (Admin authenticated).
 * Route: PATCH /applications/:applicationId/status
 */
export const updateApplicationStatus = async (applicationId, status) => {
  const res = await api.patch(`/applications/${applicationId}/status`, { status });
  return res.data;
};

/**
 * Update admin notes on a candidate's application (Admin authenticated).
 * Route: PATCH /applications/:applicationId/notes
 */
export const updateApplicationNotes = async (applicationId, adminNotes) => {
  const res = await api.patch(`/applications/${applicationId}/notes`, { adminNotes });
  return res.data;
};
