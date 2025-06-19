import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  Users,
  Package,
  ShoppingCart,
  DollarSign,
  AlertTriangle,
  RefreshCw,
  Calendar,
} from "lucide-react";
import {
  reportsAPI,
  type DashboardData,
  type SalesSummary,
  type TopCustomer,
  type TopProduct,
} from "../services/api";

const Dashboard: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null
  );
  const [salesSummary, setSalesSummary] = useState<SalesSummary | null>(null);
  const [topCustomers, setTopCustomers] = useState<TopCustomer[]>([]);
  const [topProducts, setTopProducts] = useState<TopProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [dashboard, sales, customers, products] = await Promise.all([
        reportsAPI.getDashboard(),
        reportsAPI.getSalesSummary(),
        reportsAPI.getTopCustomers(),
        reportsAPI.getTopProducts(),
      ]);

      setDashboardData(dashboard);
      setSalesSummary(sales);
      setTopCustomers(customers);
      setTopProducts(products);
    } catch (err: any) {
      setError("Erro ao carregar dados do dashboard");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="w-8 h-8 animate-spin text-blue-600" />
        <span className="ml-2 text-gray-600">Carregando dashboard...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
        {error}
      </div>
    );
  }

  // Prepare chart data
  const orderStatusData = dashboardData?.ordersByStatus
    ? Object.entries(dashboardData.ordersByStatus).map(([status, count]) => ({
        status,
        count,
        color: getStatusColor(status),
      }))
    : [];

  const topCustomersChart = topCustomers.slice(0, 5).map((customer) => ({
    name: customer.customerName.split(" ")[0], // First name only
    orders: customer.totalOrders,
    spent: customer.totalSpent,
  }));

  const topProductsChart = topProducts.slice(0, 5).map((product) => ({
    name:
      product.productName.length > 15
        ? product.productName.substring(0, 15) + "..."
        : product.productName,
    sold: product.quantitySold,
    revenue: product.revenue,
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Dashboard Executivo
          </h1>
          <p className="text-gray-600 mt-1">
            Visão geral das vendas e performance
          </p>
        </div>
        <button
          onClick={loadDashboardData}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Atualizar
        </button>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total de Usuários"
          value={dashboardData?.totalUsers || 0}
          icon={Users}
          color="blue"
        />
        <MetricCard
          title="Produtos"
          value={dashboardData?.totalProducts || 0}
          icon={Package}
          color="green"
        />
        <MetricCard
          title="Pedidos"
          value={dashboardData?.totalOrders || 0}
          icon={ShoppingCart}
          color="purple"
        />
        <MetricCard
          title="Vendas Realizadas"
          value={`R$ ${dashboardData?.totalSales?.toFixed(2) || "0.00"}`}
          icon={DollarSign}
          color="emerald"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Order Status Chart */}
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Status dos Pedidos
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={orderStatusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ status, count }) => `${status}: ${count}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="count"
              >
                {orderStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Top Customers Chart */}
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Top Clientes
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={topCustomersChart}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip
                formatter={(value, name) => [
                  name === "orders" ? `${value} pedidos` : `R$ ${value}`,
                  name === "orders" ? "Pedidos" : "Gasto Total",
                ]}
              />
              <Legend />
              <Bar dataKey="orders" fill="#3B82F6" name="Pedidos" />
              <Bar dataKey="spent" fill="#10B981" name="Gasto Total" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Top Products Chart */}
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Produtos Mais Vendidos
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={topProductsChart} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" width={80} />
              <Tooltip
                formatter={(value) => [`${value} unidades`, "Vendidos"]}
              />
              <Bar dataKey="sold" fill="#8B5CF6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Sales Summary */}
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Resumo de Vendas
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total de Pedidos:</span>
              <span className="font-semibold">
                {salesSummary?.totalOrders || 0}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Pedidos Finalizados:</span>
              <span className="font-semibold text-green-600">
                {salesSummary?.completedOrders || 0}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Pedidos Pendentes:</span>
              <span className="font-semibold text-yellow-600">
                {salesSummary?.pendingOrders || 0}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Receita Total:</span>
              <span className="font-semibold text-emerald-600">
                R$ {salesSummary?.totalRevenue?.toFixed(2) || "0.00"}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Ticket Médio:</span>
              <span className="font-semibold">
                R$ {salesSummary?.averageTicket?.toFixed(2) || "0.00"}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Itens Vendidos:</span>
              <span className="font-semibold">
                {salesSummary?.totalItemsSold || 0}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Alerts */}
      {dashboardData && dashboardData.lowStockProducts > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center">
            <AlertTriangle className="w-5 h-5 text-yellow-600 mr-2" />
            <span className="text-yellow-800">
              <strong>Atenção:</strong> {dashboardData.lowStockProducts}{" "}
              produto(s) com estoque baixo
            </span>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="text-center text-gray-500 text-sm">
        <Calendar className="w-4 h-4 inline mr-1" />
        Última atualização: {dashboardData?.lastUpdated}
      </div>
    </div>
  );
};

// Metric Card Component
interface MetricCardProps {
  title: string;
  value: string | number;
  icon: React.ComponentType<any>;
  color: string;
}

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  icon: Icon,
  color,
}) => {
  const colorClasses = {
    blue: "bg-blue-100 text-blue-600",
    green: "bg-green-100 text-green-600",
    purple: "bg-purple-100 text-purple-600",
    emerald: "bg-emerald-100 text-emerald-600",
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
        </div>
        <div
          className={`p-3 rounded-lg ${
            colorClasses[color as keyof typeof colorClasses]
          }`}
        >
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
};

// Helper function for status colors
const getStatusColor = (status: string): string => {
  const colors: Record<string, string> = {
    PENDENTE: "#F59E0B",
    APROVADO: "#3B82F6",
    FINALIZADO: "#10B981",
    REJEITADO: "#EF4444",
    CANCELADO: "#6B7280",
  };
  return colors[status] || "#6B7280";
};

export default Dashboard;
