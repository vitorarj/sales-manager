import React, { useState, useEffect } from "react";
import {
  ShoppingCart,
  Package,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  RefreshCw,
  Star,
  Heart,
} from "lucide-react";
import {
  orderAPI,
  productAPI,
  type Order,
  type Product,
  type LoginResponse,
} from "../services/api";

interface ClientPanelProps {
  user: LoginResponse;
}

const ClientPanel: React.FC<ClientPanelProps> = ({ user }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("catalog");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [allOrders, productsData] = await Promise.all([
        orderAPI.getAll(),
        productAPI.getInStock(),
      ]);

      // Filter orders for current user
      const userOrders = allOrders.filter(
        (order) => order.customer.id === user.userId
      );
      setOrders(userOrders);
      setProducts(productsData);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
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

  const getStatusMessage = (status: string) => {
    const messages = {
      PENDENTE: "Aguardando aprovação do vendedor",
      APROVADO: "Pedido aprovado! Preparando para envio",
      FINALIZADO: "Pedido finalizado com sucesso",
      REJEITADO: "Pedido rejeitado pelo vendedor",
      CANCELADO: "Pedido cancelado",
    };
    return messages[status as keyof typeof messages] || "";
  };

  const pendingOrders = orders.filter((o) => o.status === "PENDENTE");
  const completedOrders = orders.filter((o) => o.status === "FINALIZADO");
  const totalSpent = completedOrders.reduce(
    (sum, order) => sum + order.totalAmount,
    0
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Bem-vindo, {user.name.split(" ")[0]}!
          </h1>
          <p className="text-gray-600 mt-1">
            Explore nossos produtos e acompanhe seus pedidos
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

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Meus Pedidos</p>
              <p className="text-2xl font-bold text-blue-600 mt-1">
                {orders.length}
              </p>
            </div>
            <ShoppingCart className="w-8 h-8 text-blue-600" />
          </div>
          <p className="text-sm text-gray-500 mt-2">
            {pendingOrders.length} pendente(s)
          </p>
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
          <p className="text-sm text-gray-500 mt-2">Compras realizadas</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Gasto</p>
              <p className="text-2xl font-bold text-emerald-600 mt-1">
                R$ {totalSpent.toFixed(2)}
              </p>
            </div>
            <Star className="w-8 h-8 text-emerald-600" />
          </div>
          <p className="text-sm text-gray-500 mt-2">Em compras realizadas</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab("catalog")}
            className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center ${
              activeTab === "catalog"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            <Package className="w-4 h-4 mr-2" />
            Catálogo de Produtos
          </button>
          <button
            onClick={() => setActiveTab("orders")}
            className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center ${
              activeTab === "orders"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            Meus Pedidos
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {activeTab === "catalog" && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-gray-900">
                Produtos Disponíveis
              </h3>
              <p className="text-gray-600">
                {products.length} produtos em estoque
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                >
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Package className="w-6 h-6 text-blue-600" />
                      </div>
                      <Heart className="w-5 h-5 text-gray-400 hover:text-red-500 cursor-pointer" />
                    </div>

                    <h4 className="text-lg font-semibold text-gray-900 mb-2">
                      {product.name}
                    </h4>
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                      {product.description}
                    </p>

                    <div className="flex items-center justify-between mb-4">
                      <span className="text-2xl font-bold text-blue-600">
                        R$ {product.price.toFixed(2)}
                      </span>
                      <span className="text-sm text-gray-500">
                        {product.stock} em estoque
                      </span>
                    </div>

                    <button
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center"
                      disabled={product.stock === 0}
                    >
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      {product.stock === 0 ? "Sem Estoque" : "Comprar"}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {products.length === 0 && (
              <div className="text-center py-12">
                <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">
                  Nenhum produto disponível no momento
                </p>
              </div>
            )}
          </div>
        )}

        {activeTab === "orders" && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-gray-900">
                Meus Pedidos
              </h3>
              {pendingOrders.length > 0 && (
                <span className="bg-yellow-100 text-yellow-800 text-sm font-medium px-3 py-1 rounded-full">
                  {pendingOrders.length} aguardando aprovação
                </span>
              )}
            </div>

            {orders.length === 0 ? (
              <div className="text-center py-12">
                <ShoppingCart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 text-lg mb-2">
                  Você ainda não fez nenhum pedido
                </p>
                <p className="text-gray-400">
                  Explore nosso catálogo e faça sua primeira compra!
                </p>
                <button
                  onClick={() => setActiveTab("catalog")}
                  className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
                >
                  Ver Catálogo
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div
                    key={order.id}
                    className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <h4 className="text-lg font-semibold text-gray-900 mr-4">
                          Pedido #{order.id}
                        </h4>
                        {getStatusBadge(order.status)}
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-gray-900">
                          R$ {order.totalAmount.toFixed(2)}
                        </p>
                        <p className="text-sm text-gray-500">
                          {new Date(order.createdAt).toLocaleDateString(
                            "pt-BR"
                          )}
                        </p>
                      </div>
                    </div>

                    <p className="text-sm text-gray-600 mb-4">
                      {getStatusMessage(order.status)}
                    </p>

                    <div className="border-t border-gray-200 pt-4">
                      <p className="text-sm font-medium text-gray-900 mb-2">
                        Itens do Pedido ({order.items.length}):
                      </p>
                      <div className="space-y-2">
                        {order.items.map((item, index) => (
                          <div
                            key={index}
                            className="flex justify-between items-center text-sm"
                          >
                            <span className="text-gray-600">
                              {item.product.name} x {item.quantity}
                            </span>
                            <span className="font-medium">
                              R$ {item.subtotal.toFixed(2)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {order.notes && (
                      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-600">
                          <strong>Observações:</strong> {order.notes}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientPanel;
