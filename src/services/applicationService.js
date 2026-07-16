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
  // Week 2: response key is "applications" not "data"
  const res = await api.get(`/internships/${internshipId}/applications`);
  return res.data;
};

/**
 * Fetch details of a specific application by ID (Admin authenticated).
 * Route: GET /applications/:applicationId
 */
export const getApplicationById = async (applicationId) => {
  // Week 2: response key is "application" not "data"
  const res = await api.get(`/applications/${applicationId}`);
  return res.data;
};

/**
 * Fetch all applications for the admin dashboard.
 * Route: GET /applications
 */
export const getAllApplications = async (params) => {
  const res = await api.get("/applications", { params });
  return res.data;
};

/**
 * Fetch application statistics for the admin dashboard.
 * Route: GET /applications/stats
 */
export const getApplicationStats = async () => {
  const res = await api.get("/applications/stats");
  return res.data;
};

/**
 * Submit a new internship application.
 * Route: POST /applications
 */
export const createApplication = async (applicationData, resumeFile, resumeUrl) => {
  const formData = new FormData();
  formData.append("internshipId", applicationData.internshipId);
  formData.append("fullName", applicationData.fullName);
  formData.append("email", applicationData.email);
  formData.append("phone", applicationData.phone);
  formData.append("college", applicationData.college);
  formData.append("branch", applicationData.branch);
  formData.append("year", applicationData.year);
  
  if (applicationData.linkedin) formData.append("linkedin", applicationData.linkedin);
  if (applicationData.github) formData.append("github", applicationData.github);
  if (applicationData.portfolio) formData.append("portfolio", applicationData.portfolio);

  if (applicationData.additionalResponses) {
    formData.append("additionalResponses", JSON.stringify(applicationData.additionalResponses));
  }

  if (resumeFile) {
    formData.append("resume", resumeFile);
  } else if (resumeUrl) {
    formData.append("resumeUrl", resumeUrl);
  }

  const res = await api.post("/applications", formData);
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

export const getDashboardStats = async () => {
  const res = await api.get("/dashboard/stats");
  return res.data;
};

export const getRecentApplications = async () => {
  const res = await api.get("/dashboard/recent-applications");
  return res.data;
};

export const getInternshipStats = async (internshipId) => {
  const res = await api.get(`/internships/${internshipId}/stats`);
  return res.data;
};

export const exportApplications = async (params = {}) => {
  const res = await api.get("/applications/export", {
    params,
    responseType: "blob",
  });
  return res;
};

export const exportInternshipApplications = async (internshipId, params = {}) => {
  const res = await api.get(`/internships/${internshipId}/export`, {
    params,
    responseType: "blob",
  });
  return res;
};

// ─── Week 2: Mentorship Payment & Session functions ──────────────────────────

/**
 * Fetch payment history for the logged-in student.
 * Route: GET /payments/my-payments
 */
export const getMyPayments = async () => {
  const res = await api.get("/payments/my-payments");
  return res.data;
};

/**
 * Fetch revenue stats for the admin dashboard.
 * Route: GET /admin/revenue
 */
export const getAdminRevenue = async () => {
  const res = await api.get("/admin/revenue");
  return res.data;
};

/**
 * Fetch all payment records for the admin dashboard.
 * Route: GET /admin/payments
 */
export const getAdminPayments = async () => {
  const res = await api.get("/admin/payments");
  return res.data;
};

/**
 * Issue a refund for a given payment (Admin authenticated).
 * Route: POST /admin/refund/:paymentId
 */
export const issueRefund = async (paymentId) => {
  const res = await api.post(`/admin/refund/${paymentId}`);
  return res.data;
};

/**
 * Mark a session as completed (Admin authenticated).
 * Route: PATCH /admin/sessions/:sessionId/complete
 */
export const markSessionComplete = async (sessionId) => {
  const res = await api.patch(`/admin/sessions/${sessionId}/complete`);
  return res.data;
};
