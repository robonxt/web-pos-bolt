import React from 'react';
import { Order } from '../types/pos';
import { db } from '../lib/db';
import { Clock, CheckCircle2, XCircle, Plus, RefreshCw } from 'lucide-react';

export const OrdersTable = () => {
  const [orders, setOrders] = React.useState<Order[]>([]);

  React.useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    const data = await db.getOrders();
    setOrders(data || []);
  };

  const updateOrderStatus = async (order: Order, status: Order['status']) => {
    const updatedOrder = { ...order, status, updatedAt: new Date() };
    await db.updateOrder(updatedOrder);
    loadOrders();
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'ORDERED': return 'bg-yellow-100 text-yellow-800';
      case 'PREPARING': return 'bg-blue-100 text-blue-800';
      case 'READY': return 'bg-green-100 text-green-800';
      case 'COMPLETED': return 'bg-gray-100 text-gray-800';
      case 'CANCELLED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold">Active Orders</h2>
        <div className="flex gap-2 w-full sm:w-auto">
          <button
            onClick={loadOrders}
            className="flex-1 sm:flex-initial px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
          <button
            onClick={() => {/* TODO: Implement new order functionality */}}
            className="flex-1 sm:flex-initial px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            New Order
          </button>
        </div>
      </div>

      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
        {orders.map((order) => (
          <div
            key={order.id}
            className="bg-white p-6 rounded-lg shadow-md space-y-4"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold">Order #{order.orderNumber}</h3>
                <p className="text-gray-600">{order.customerName}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                {order.status}
              </span>
            </div>

            <div className="space-y-2">
              {order.products.map((product, idx) => (
                <div key={idx} className="flex justify-between text-sm">
                  <span>{product.quantity}x {product.name}</span>
                  <span>${(product.subtotal).toFixed(2)}</span>
                </div>
              ))}
              <div className="pt-2 border-t border-gray-200">
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span>${order.total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              {order.status === 'ORDERED' && (
                <button
                  onClick={() => updateOrderStatus(order, 'PREPARING')}
                  className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
                >
                  <Clock className="w-4 h-4" />
                  Start Preparing
                </button>
              )}
              {order.status === 'PREPARING' && (
                <button
                  onClick={() => updateOrderStatus(order, 'READY')}
                  className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Mark Ready
                </button>
              )}
              {(order.status === 'ORDERED' || order.status === 'PREPARING') && (
                <button
                  onClick={() => updateOrderStatus(order, 'CANCELLED')}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center justify-center gap-2"
                >
                  <XCircle className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};