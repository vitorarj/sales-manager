import React, { useState, useEffect } from "react";
import {
  CheckCircle,
  XCircle,
  Clock,
  TrendingUp,
  AlertTriangle,
  RefreshCw,
} from "lucide-react";
import {
  orderAPI,
  productAPI,
  type Order,
  type Product,
  type LoginResponse,
} from "../services/api";

interface SellerPanelProps {
  user: LoginResponse;
}

const SellerPanel: React.FC<SellerPanelProps> = ({ user }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [pendingOrders, setPendingOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [allOrders, pending, productsData] = await Promise.all([
        orderAPI.getAll(),
        orderAPI.getPending(),
        productAPI.getAll(),
      ]);
      setOrders(allOrders);
      setPendingOrders(pending);
      setProducts(productsData);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveOrder = async (orderId: number) => {
    try {
      await orderAPI.approve(orderId, user.userId);
      await loadData(); // Reload data
    } catch (error) {
      console.error("Error approving order:", error);
    }
  };

  const handleRejectOrder = async (orderId: number) => {
    try {
      await orderAPI.reject(orderId, user.userId);
      await loadData(); // Reload data
    } catch (error) {
      console.error("Error rejecting order:", error);
    }
  };

  const handleCompleteOrder = async (orderId: number) => {
    try {
      await orderAPI.complete(orderId);
      await loadData(); // Reload data
    } catch (error) {
      console.error("Error completing order:", error);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      PENDENTE: { color: "bg-yellow-100 text-yellow-800", icon: Clock },
      APROVADO: { color: "bg-blue-100 text-blue-800", icon: CheckCircle },
      FINALIZADO: { color: "bg-green-100 text-green-800", icon: CheckCircle },
      REJEITADO: { color: "bg-red-100 text-red-800", icon: XCircle },
      CANCELADO: { color: "bg-gray-100 text-gray-800", icon: XCircle },
    };

    const config =
      statusConfig[status as keyof typeof statusConfig] ||
      statusConfig["PENDENTE"];
    const Icon = config.icon;

    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}
      >
        <Icon className="w-3 h-3 mr-1" />
        {status}
      </span>
    );
  };

  const lowStockProducts = products.filter((p) => p.stock < 5 && p.active);
  const completedOrders = orders.filter((o) => o.status === "FINALIZADO");
  const totalRevenue = completedOrders.reduce(
    (sum, order) => sum + order.totalAmount,
    0
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Painel do Vendedor
          </h1>
          <p className="text-gray-600 mt-1">
            Gerencie pedidos e controle de estoque
          </p>
        </div>
        <button
          onClick={loadData}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center disabled:opacity-50"
        >
          <RefreshCw
            className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`}
          />
          Atualizar
        </button>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Pedidos Pendentes</p>
              <p className="text-2xl font-bold text-yellow-600 mt-1">
                {pendingOrders.length}
              </p>
            </div>
            <Clock className="w-8 h-8 text-yellow-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Pedidos Finalizados</p>
              <p className="text-2xl font-bold text-green-600 mt-1">
                {completedOrders.length}
              </p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Receita Total</p>
              <p className="text-2xl font-bold text-emerald-600 mt-1">
                R$ {totalRevenue.toFixed(2)}
              </p>
            </div>
            <TrendingUp className="w-8 h-8 text-emerald-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Estoque Baixo</p>
              <p className="text-2xl font-bold text-red-600 mt-1">
                {lowStockProducts.length}
              </p>
            </div>
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
        </div>
      </div>

      {/* Pending Orders Section */}
      <div className="bg-white rounded-xl shadow-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Pedidos Pendentes de Aprovação
          </h3>
        </div>
        <div className="p-6">
          {pendingOrders.length === 0 ? (
            <div className="text-center py-8">
              <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
              <p className="text-gray-500">
                Nenhum pedido pendente no momento!
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {pendingOrders.map((order) => (
                <div
                  key={order.id}
                  className="border border-gray-200 rounded-lg p-4"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-gray-900">
                          Pedido #{order.id}
                        </h4>
                        {getStatusBadge(order.status)}
                      </div>
                      <p className="text-sm text-gray-600 mb-1">
                        <strong>Cliente:</strong> {order.customer.name} (
                        {order.customer.email})
                      </p>
                      <p className="text-sm text-gray-600 mb-1">
                        <strong>Total:</strong> R${" "}
                        {order.totalAmount.toFixed(2)}
                      </p>
                      <p className="text-sm text-gray-600 mb-1">
                        <strong>Itens:</strong> {order.items.length} produto(s)
                      </p>
                      <p className="text-sm text-gray-600">
                        <strong>Data:</strong>{" "}
                        {new Date(order.createdAt).toLocaleDateString("pt-BR")}
                      </p>
                    </div>
                    <div className="flex space-x-2 ml-4">
                      <button
                        onClick={() => handleApproveOrder(order.id)}
                        className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm flex items-center"
                      >
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Aprovar
                      </button>
                      <button
                        onClick={() => handleRejectOrder(order.id)}
                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm flex items-center"
                      >
                        <XCircle className="w-4 h-4 mr-1" />
                        Rejeitar
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Low Stock Alert */}
      {lowStockProducts.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <AlertTriangle className="w-5 h-5 text-red-600 mr-2" />
              Produtos com Estoque Baixo
            </h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {lowStockProducts.map((product) => (
                <div
                  key={product.id}
                  className="border border-red-200 rounded-lg p-4 bg-red-50"
                >
                  <h4 className="font-semibold text-gray-900 mb-1">
                    {product.name}
                  </h4>
                  <p className="text-sm text-gray-600 mb-2">
                    R$ {product.price.toFixed(2)}
                  </p>
                  <p className="text-sm font-medium text-red-600">
                    Estoque: {product.stock} unidades
                  </p>
                  {product.stock === 0 && (
                    <span className="inline-block mt-2 bg-red-100 text-red-800 text-xs px-2 py-1 rounded">
                      SEM ESTOQUE
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Recent Orders */}
      <div className="bg-white rounded-xl shadow-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Pedidos Recentes
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Pedido
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cliente
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orders.slice(0, 10).map((order) => (
                <tr key={order.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      #{order.id}
                    </div>
                    <div className="text-sm text-gray-500">
                      {order.items.length} itens
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {order.customer.name}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    R$ {order.totalAmount.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(order.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {order.status === "APROVADO" && (
                      <button
                        onClick={() => handleCompleteOrder(order.id)}
                        className="bg-green-600 hover:bg-green-700 text-white px-2 py-1 rounded text-xs"
                      >
                        Finalizar
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SellerPanel;
