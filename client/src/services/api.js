import axios from "axios";
import { API_URL } from "../config/env.js";

const API_BASE_URL = `${API_URL}/api/`;

// Create an Axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor - runs before each request
api.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const token = localStorage.getItem("token");

    // If token exists, add it to request headers
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - runs after each response
api.interceptors.response.use(
  (response) => {
    // Return just the data part of the response
    return response.data;
  },
  (error) => {
    // Handle errors
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      const message = error.response.data.message || "An error occurred";
      return Promise.reject(new Error(message));
    } else if (error.request) {
      // The request was made but no response was received
      return Promise.reject(new Error("No response from server"));
    } else {
      // Something happened in setting up the request that triggered an Error
      return Promise.reject(error);
    }
  }
);

// Auth API endpoints
export const authAPI = {
  login: (credentials) => api.post("/login", credentials),
  logout: () => api.post("/admin/logout"),
  forgotPassword: (email) => api.post("/forgot-password", { email }),
  resetPassword: (token, password) =>
    api.post("/reset-password", { token, password }),

  // Nuevos métodos para activación de cuenta
  checkSetPasswordToken: (token) =>
    api.post(`/check-set-password-token`, { token }),
  setPassword: (token, password, confirm_password) =>
    api.post("/set-password", { token, password, confirm_password }),
  verifyResetToken: (token) => api.get(`/verify-reset-token?token=${token}`),
  resetPassword: (token, password) =>
    api.post("/reset-password", { token, password }),
};

// Admin API endpoints
export const adminAPI = {
  getAdmins: (params) => api.get("/admin/admins", { params }),
  createAdmin: (userData) => api.post("/admin/admins", userData),
  updateAdmin: (id, userData) => api.put(`/admin/admins/${id}`, userData),
  deleteAdmin: (id) => api.delete(`/admin/admins/${id}`),
  getPermissions: () => api.get("/admin/get_permissions"),
};

export const industriesAPI = {
  getIndustries: () => api.get("/get_industries"),
};

export const skillsAPI = {
  searchSkills: (params) => api.get("/search_skills?search", { params }),
  getNewSkills: () => api.get("/skills/newskills"),
  createSkill: (skillData) => api.post("/admin/skills", skillData),
};

export const employeesAPI = {
  getEmployees: (params) => api.get("/admin/employees", { params }),
  getEmployeeById: (id) => api.get(`/admin/employees/detail/${id}`),
  updateEmployee: (id, userData) => api.put(`/admin/employees/${id}`, userData),
  updateEmployeeSkill: (id, skillData) => api.put(`/admin/employees/${id}/skill`, {skills: skillData}),
  deleteEmployee: (id) => api.delete(`/admin/employee/${id}`),
  getEmployeeCV: (id) => api.get(`/admin/employee_requests/${id}/cv/view`, { responseType: "blob" }),
};

export const areasAPI = {
  getAreas: () => api.get("/admin/areas"),
};

export const applicantsAPI = {
  submitApplication: (data) => api.post("/generate_request", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  }),
  getApplicants: (params) => api.get("/admin/employee_requests", { params }),
  getApplicant: (id) => api.get(`/admin/employee_request/detail/${id}`),
  getApplicantCV: (id) => api.get(`/admin/employee_requests/${id}/cv/view`, { responseType: "blob" }),
  acceptApplicant: (id) => api.put(`/admin/employee_requests/${id}/status`, { status: "accepted" }),
  rejectApplicant: (id) => api.put(`/admin/employee_requests/${id}/status`, { status: "rejected" }),
};
// export const examsAPI = {
//   createExam: (examData) => api.post("/exams", examData),
//   getExams: (params) => api.get("/exams", { params }),
//   getExamById: (id) => api.get(`/exams/${id}`),
//   updateExam: (id, examData) => api.put(`/exams/${id}`, examData),
//   deleteExam: (id) => api.delete(`/exams/${id}`),
//   validateExam: (id) => api.put("/exams/validate-exam", { id }),
//   getChartData: (period, params) => {
//     return api.get(`/exams/chart-data/${period}`, { params });
//   },
// };

// Public API for exam results (no authentication required)
// export const examResultsAPI = {
//   getByToken: (token) => axios.get(`${API_BASE_URL}/results/${token}`),
//   downloadPDF: (token) =>
//     axios.get(`${API_BASE_URL}/results/${token}/pdf`, {
//       responseType: "blob",
//     }),
//   generateToken: (data) => api.post("/exams/generate-results-token", data),
//   sendExamResults: (data) => api.post("/exams/send-results", data),
//   updateMessageStatus: (id, status) =>
//     api.put(`/exams/update-message-status/${id}`, { status }),
// };

// Export the api instance for direct use if needed
export default api;
