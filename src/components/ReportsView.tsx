import React from 'react';
import { Order } from '../types/pos';
import { db } from '../lib/db';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { DollarSign, ShoppingBag, TrendingUp } from 'lucide-react';

export const ReportsView = () => {
  const [orders, setOrders] = React.useState<Order[]>([]);
  const [timeframe, setTimeframe] = React.useState<'today' | 'week' | 'month'>('today');

  React.useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    const data = await db.getOrders();
    setOrders(data || []);
  };

  const getFilteredOrders = () => {
    const now = new Date();
    const startDate = new Date();

    switch (timeframe) {
      case 'today':
        startDate.setHours(0, 0, 0, 0);
        break;
      case 'week':
        startDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(now.getMonth() - 1);
        break;
    }

    return orders.filter(order => new Date(order.createdAt) >= startDate);
  };

  const filteredOrders = getFilteredOrders();
  const totalRevenue = filteredOrders.reduce((sum, order) => sum + order.total, 0);
  const totalOrders = filteredOrders.length;
  const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  const getChartData = () => {
    const data: { name: string; revenue: number }[] = [];
    const groupedOrders = new Map<string, number>();

    filteredOrders.forEach(order => {
      const date = new Date(order.createdAt);
      const key = timeframe === 'today' 
        ? `${date.getHours()}:00`
        : timeframe === 'week'
        ? date.toLocaleDateString('en-US', { weekday: 'short' })
        : date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

      groupedOrders.set(key, (groupedOrders.get(key) || 0) + order.total);
    });

    groupedOrders.forEach((revenue, name) => {
      data.push({ name, revenue });
    });

    return data;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Sales Reports</h2>
        <div className="flex gap-2">
          {(['today', 'week', 'month'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTimeframe(t)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                timeframe === t
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-100 text-green-600 rounded-full">
              <DollarSign className="w-6 h-6" />
            </div>
            <div>
              <p className="text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold">${totalRevenue.toFixed(2)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 text-blue-600 rounded-full">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <div>
              <p className="text-gray-600">Total Orders</p>
              <p className="text-2xl font-bold">{totalOrders}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-100 text-purple-600 rounded-full">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <p className="text-gray-600">Average Order Value</p>
              <p className="text-2xl font-bold">${averageOrderValue.toFixed(2)}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">Revenue Over Time</h3>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={getChartData()}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="revenue" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};