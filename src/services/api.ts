// @ts-ignore
import axios, { AxiosRequestConfig, InternalAxiosRequestConfig } from "axios";
import { getAuthToken } from "../utils/auth";

const API_URL = "https://backendbooktrack-production.up.railway.app"; // Ganti APInya

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const token = await getAuthToken();
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const login = async (username: string, password: string) => {
  try {
    const response = await api.post("/api/auth/login", {
      username: username.trim(),
      password: password,
    });
    return response.data;
  } catch (error) {
    const apiError = error as any;
    throw apiError.response?.data || { message: "Network error" };
  }
};

export const register = async (
  username: string,
  password: string,
  email: string
) => {
  try {
    const response = await api.post("/api/auth/register", {
      username: username.trim(),
      password: password,
      email: email.trim().toLowerCase(),
      name: username.trim(),
    });
    return response.data;
  } catch (error) {
    const apiError = error as any;
    if (apiError.response?.data?.errors) {
      const errors = apiError.response.data.errors;
      const errorMessages = Object.values(errors).join(", ");
      throw new Error(errorMessages);
    }
    throw apiError.response?.data || { message: "Network error" };
  }
};

export const fetchUserProfile = async () => {
  try {
    const response = await api.get("/api/profile");
    return response.data.data;
  } catch (error) {
    const apiError = error as any;
    throw apiError.response?.data || { message: "Network error" };
  }
};

export const getBookDetail = async (bookId: string) => {
  try {
    const response = await axios.get(`${BASE_URL}/books/${bookId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Fungsi untuk mendapatkan semua buku
export const getAllBooks = async () => {
  try {
    const response = await api.get("/api/books");
    return response.data;
  } catch (error) {
    const apiError = error as any;
    throw apiError.response?.data || { message: "Network error" };
  }
};

// Fungsi untuk mendapatkan detail buku
export const getBookById = async (bookId: string) => {
  try {
    const response = await api.get(`/api/books/${bookId}`);
    return response.data;
  } catch (error) {
    const apiError = error as any;
    throw apiError.response?.data || { message: "Network error" };
  }
};

// Fungsi untuk menambah buku baru
export const createBook = async (bookData: {
  title: string;
  author: string;
  description: string;
  genre: string;
}) => {
  try {
    const formattedData = {
      title: bookData.title,
      author: bookData.author,
      description: bookData.description,
      genre: bookData.genre,
    };

    console.log("Creating book with data:", formattedData);
    const response = await api.post("/api/books", formattedData);
    console.log("Create book response:", response.data);

    if (response.data) {
      return {
        success: true,
        data: response.data,
        message: "Book created successfully",
      };
    } else {
      throw new Error("Invalid response format");
    }
  } catch (error: any) {
    console.error("Create book error:", error.response?.data);
    if (error.response?.data?.error) {
      const errorMessages = Array.isArray(error.response.data.error)
        ? error.response.data.error.join(", ")
        : error.response.data.error;
      throw new Error(errorMessages);
    }
    throw new Error(error.response?.data?.message || "Failed to create book");
  }
};

// Fungsi untuk mengupdate buku
export const updateBook = async (
  bookId: string,
  bookData: {
    title: string;
    author: string;
    description: string;
    genre: string;
  }
) => {
  try {
    const formattedData = {
      title: bookData.title,
      author: bookData.author,
      description: bookData.description,
      genre: bookData.genre,
    };

    console.log("Updating book with data:", formattedData);
    const response = await api.put(`/api/books/${bookId}`, formattedData);
    console.log("Update response:", response.data);

    if (response.data) {
      return {
        success: true,
        data: response.data,
        message: "Book updated successfully",
      };
    } else {
      throw new Error("Invalid response format");
    }
  } catch (error: any) {
    console.error("Update book error:", error.response?.data);
    if (error.response?.data?.errors) {
      const errorMessage = Object.values(error.response.data.errors).join(", ");
      throw new Error(errorMessage);
    }
    throw new Error(error.response?.data?.message || "Failed to update book");
  }
};

// Fungsi untuk menghapus buku
export const deleteBook = async (bookId: string) => {
  try {
    const response = await api.delete(`/api/books/${bookId}`);
    return response.data;
  } catch (error) {
    const apiError = error as any;
    throw apiError.response?.data || { message: "Network error" };
  }
};
