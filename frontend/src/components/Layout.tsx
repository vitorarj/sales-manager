import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Menu,
  X,
  BarChart3,
  Users,
  Package,
  ShoppingCart,
  LogOut,
  User,
  Settings,
  ChevronDown,
} from "lucide-react";
import type { LoginResponse } from "../services/api";

interface LayoutProps {
  children: React.ReactNode;
  user: LoginResponse;
  onLogout: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, user, onLogout }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const getNavigationItems = () => {
    const baseItems = [
      { path: "/dashboard", icon: BarChart3, label: "Dashboard" },
    ];

    switch (user.role) {
      case "ADMIN":
        return [
          ...baseItems,
          { path: "/admin", icon: Settings, label: "Administração" },
          { path: "/users", icon: Users, label: "Usuários" },
          { path: "/products", icon: Package, label: "Produtos" },
          { path: "/orders", icon: ShoppingCart, label: "Pedidos" },
        ];

      case "VENDEDOR":
        return [
          ...baseItems,
          { path: "/seller", icon: Settings, label: "Painel Vendedor" },
          {
            path: "/manage-orders",
            icon: ShoppingCart,
            label: "Gerenciar Pedidos",
          },
          {
            path: "/manage-products",
            icon: Package,
            label: "Gerenciar Produtos",
          },
        ];

      case "CLIENTE":
        return [
          ...baseItems,
          { path: "/client", icon: User, label: "Meu Painel" },
          { path: "/catalog", icon: Package, label: "Catálogo" },
          { path: "/my-orders", icon: ShoppingCart, label: "Meus Pedidos" },
        ];

      default:
        return baseItems;
    }
  };

  const navigationItems = getNavigationItems();

  const getRoleColor = (role: string) => {
    switch (role) {
      case "ADMIN":
        return "bg-purple-100 text-purple-800";
      case "VENDEDOR":
        return "bg-green-100 text-green-800";
      case "CLIENTE":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case "ADMIN":
        return "Administrador";
      case "VENDEDOR":
        return "Vendedor";
      case "CLIENTE":
        return "Cliente";
      default:
        return role;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out lg:translate-x-0`}
      >
        {/* Logo */}
        <div className="flex items-center justify-between h-16 px-6 bg-blue-600 text-white">
          <div className="flex items-center">
            <BarChart3 className="w-8 h-8 mr-2" />
            <span className="font-bold text-lg">SalesManager</span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-white hover:text-gray-200"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* User Info */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900">{user.name}</p>
              <p className="text-xs text-gray-500">{user.email}</p>
            </div>
          </div>
          <div className="mt-3">
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(
                user.role
              )}`}
            >
              {getRoleLabel(user.role)}
            </span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="mt-6 px-6">
          <ul className="space-y-2">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                      isActive(item.path)
                        ? "bg-blue-100 text-blue-700"
                        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                    }`}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <Icon className="w-5 h-5 mr-3" />
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Logout Button */}
        <div className="absolute bottom-6 left-6 right-6">
          <button
            onClick={onLogout}
            className="flex items-center w-full px-4 py-3 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50 transition-colors"
          >
            <LogOut className="w-5 h-5 mr-3" />
            Sair
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:ml-64">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between h-16 px-6">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-gray-600 hover:text-gray-900"
            >
              <Menu className="w-6 h-6" />
            </button>

            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">
                Sistema de Gestão de Vendas
              </h1>
            </div>

            <div className="flex items-center space-x-4">
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center text-sm text-gray-600 hover:text-gray-900"
                >
                  <span className="mr-2">{user.name}</span>
                  <ChevronDown className="w-4 h-4" />
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-10">
                    <div className="px-4 py-2 border-b border-gray-200">
                      <p className="text-sm font-medium text-gray-900">
                        {user.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {getRoleLabel(user.role)}
                      </p>
                    </div>
                    <button
                      onClick={onLogout}
                      className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Sair
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">{children}</main>
      </div>

      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default Layout;
