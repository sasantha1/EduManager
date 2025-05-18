// API base URL - adjust based on your environment
const API_BASE_URL = "http://localhost:8080/api";

// Type definitions
export interface RegisterStudentData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  studentId: string;
  program: string;
  year: string;
}

export interface RegisterTeacherData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  teacherId: string;
  department: string;
  specialization: string;
}

export interface RegisterAdminData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  adminId: string;
  position: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
}

export interface JwtResponse {
  token: string;
  type: string;
  id: number;
  name: string;
  email: string;
  role: string;
}

// API functions
export const api = {
  // Authentication
  auth: {
    login: async (data: LoginData) => {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Login failed");
      }
      
      const result = await response.json();
      console.log("Login result:", result.success, result.data);
      
      // Store the JWT token for future authenticated requests
      if (result.success && result.data.token) {
        tokenUtils.setToken(result.data.token);
        tokenUtils.setUserData(result.data);
      }
      
      return result;
    },
    
    registerStudent: async (data: RegisterStudentData) => {
      const response = await fetch(`${API_BASE_URL}/auth/register/student`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Student registration failed");
      }
      
      return response.json();
    },
    
    registerTeacher: async (data: RegisterTeacherData) => {
      const response = await fetch(`${API_BASE_URL}/auth/register/teacher`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Teacher registration failed");
      }
      
      return response.json();
    },
    
    registerAdmin: async (data: RegisterAdminData) => {
      const response = await fetch(`${API_BASE_URL}/auth/register/admin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Admin registration failed");
      }
      
      return response.json();
    },
    
    logout: () => {
      tokenUtils.clearAll();
    }
  },
  
  // Protected API calls
  protected: {
    // Function to make authenticated requests
    fetchWithAuth: async (url: string, options: RequestInit = {}) => {
      const token = tokenUtils.getToken();
      
      if (!token) {
        throw new Error("No authentication token found");
      }
      
      const authOptions = {
        ...options,
        headers: {
          ...options.headers,
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      };
      
      const response = await fetch(`${API_BASE_URL}${url}`, authOptions);
      
      if (!response.ok) {
        if (response.status === 401) {
          // Token expired or invalid, clear session
          tokenUtils.clearAll();
          window.location.href = '/login';
          throw new Error("Session expired. Please login again.");
        }
        
        const errorData = await response.json();
        throw new Error(errorData.message || "Request failed");
      }
      
      return response.json();
    },
    
    // User profile
    getProfile: async () => {
      return api.protected.fetchWithAuth("/user/profile");
    },
    
    // Course endpoints
    getCourses: async () => {
      return api.protected.fetchWithAuth("/courses");
    },
    
    getCourseById: async (id: string) => {
      return api.protected.fetchWithAuth(`/courses/${id}`);
    },
    
    // Student endpoints
    getEnrolledCourses: async () => {
      return api.protected.fetchWithAuth("/student/courses");
    },
    
    enrollInCourse: async (courseId: string) => {
      return api.protected.fetchWithAuth("/student/enroll", {
        method: "POST",
        body: JSON.stringify({ courseId }),
      });
    },
    
    // Teacher endpoints
    getTeacherCourses: async () => {
      return api.protected.fetchWithAuth("/teacher/courses");
    },
    
    // Admin endpoints
    getAllUsers: async () => {
      return api.protected.fetchWithAuth("/admin/users");
    },
  },
};

// Token and user data handling utilities
export const tokenUtils = {
  setToken: (token: string) => {
    localStorage.setItem("token", token);
  },
  
  getToken: () => {
    return localStorage.getItem("token");
  },
  
  setUserData: (userData: JwtResponse) => {
    localStorage.setItem("userData", JSON.stringify(userData));
  },
  
  getUserData: () => {
    const userData = localStorage.getItem("userData");
    return userData ? JSON.parse(userData) : null;
  },
  
  getUserRole: () => {
    const userData = tokenUtils.getUserData();
    return userData ? userData.role : null;
  },
  
  clearToken: () => {
    localStorage.removeItem("token");
  },
  
  clearUserData: () => {
    localStorage.removeItem("userData");
  },
  
  clearAll: () => {
    tokenUtils.clearToken();
    tokenUtils.clearUserData();
  },
  
  isAuthenticated: () => {
    return !!tokenUtils.getToken();
  }
};

// Error handling utility
export const handleApiError = (error: any) => {
  console.error("API Error:", error);
  return {
    success: false,
    message: error.message || "An unknown error occurred",
    data: null,
    timestamp: new Date().toISOString()
  };
};