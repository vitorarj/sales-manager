import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  "https://sales-management-backend-iapk.onrender.com/api";

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Types
export interface User {
  id: number;
  name: string;
  email: string;
  role: "ADMIN" | "CLIENTE" | "VENDEDOR";
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  active: boolean;
}

export interface Order {
  id: number;
  customer: User;
  seller?: User;
  status: "PENDENTE" | "APROVADO" | "REJEITADO" | "FINALIZADO" | "CANCELADO";
  totalAmount: number;
  items: OrderItem[];
  createdAt: string;
  updatedAt?: string;
  notes?: string;
}

export interface OrderItem {
  id: number;
  product: Product;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  email: string;
  role: string;
  userId: number;
  name: string;
  message: string;
}

export interface DashboardData {
  totalUsers: number;
  totalProducts: number;
  totalOrders: number;
  ordersByStatus: Record<string, number>;
  totalSales: number;
  pendingSales: number;
  lowStockProducts: number;
  lastUpdated: string;
}

export interface SalesSummary {
  totalOrders: number;
  completedOrders: number;
  pendingOrders: number;
  totalRevenue: number;
  averageTicket: number;
  totalItemsSold: number;
}

export interface TopCustomer {
  customerId: number;
  customerName: string;
  customerEmail: string;
  totalOrders: number;
  totalSpent: number;
}

export interface TopProduct {
  productId: number;
  productName: string;
  quantitySold: number;
  revenue: number;
  currentStock: number;
  unitPrice: number;
}

// API Functions
export const authAPI = {
  login: (credentials: LoginRequest): Promise<LoginResponse> =>
    api.post("/auth/login", credentials).then((res) => res.data),

  loginTest: (email: string): Promise<LoginResponse> =>
    api.get(`/auth/login-test/${email}`).then((res) => res.data),

  getUsersForLogin: () =>
    api.get("/auth/users-for-login").then((res) => res.data),
};

export const userAPI = {
  getAll: (): Promise<User[]> => api.get("/users").then((res) => res.data),

  getCount: (): Promise<string> =>
    api.get("/users/count").then((res) => res.data),

  createDemo: (): Promise<string> =>
    api.get("/users/create-demo-users").then((res) => res.data),
};

export const productAPI = {
  getAll: (): Promise<Product[]> =>
    api.get("/products").then((res) => res.data),

  getInStock: (): Promise<Product[]> =>
    api.get("/products/in-stock").then((res) => res.data),

  getCount: (): Promise<string> =>
    api.get("/products/count").then((res) => res.data),

  createDemo: (): Promise<string> =>
    api.get("/products/create-demo-products").then((res) => res.data),
};

export const orderAPI = {
  getAll: (): Promise<Order[]> => api.get("/orders").then((res) => res.data),

  getPending: (): Promise<Order[]> =>
    api.get("/orders/pending").then((res) => res.data),

  getByStatus: (status: string): Promise<Order[]> =>
    api.get(`/orders/status/${status}`).then((res) => res.data),

  approve: (orderId: number, sellerId: number): Promise<Order> =>
    api.get(`/orders/${orderId}/approve/${sellerId}`).then((res) => res.data),

  reject: (orderId: number, sellerId: number): Promise<Order> =>
    api.get(`/orders/${orderId}/reject/${sellerId}`).then((res) => res.data),

  complete: (orderId: number): Promise<Order> =>
    api.get(`/orders/${orderId}/complete`).then((res) => res.data),

  getCount: (): Promise<string> =>
    api.get("/orders/count").then((res) => res.data),

  createDemo: (): Promise<string> =>
    api.get("/orders/create-demo-orders").then((res) => res.data),
};

export const reportsAPI = {
  getDashboard: (): Promise<DashboardData> =>
    api.get("/reports/dashboard").then((res) => res.data),

  getSalesSummary: (): Promise<SalesSummary> =>
    api.get("/reports/sales-summary").then((res) => res.data),

  getTopCustomers: (): Promise<TopCustomer[]> =>
    api.get("/reports/top-customers").then((res) => res.data),

  getTopProducts: (): Promise<TopProduct[]> =>
    api.get("/reports/top-products").then((res) => res.data),

  getLowStock: (): Promise<Product[]> =>
    api.get("/reports/low-stock").then((res) => res.data),

  getSalesTrend: (): Promise<any[]> =>
    api.get("/reports/sales-trend").then((res) => res.data),

  getSystemStatus: (): Promise<any> =>
    api.get("/reports/system-status").then((res) => res.data),
};

export default api;
