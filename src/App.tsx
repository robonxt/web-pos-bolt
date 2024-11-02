import React from 'react';
import { LayoutDashboard, Package, BarChart3, Menu, X } from 'lucide-react';
import { OrdersTable } from './components/OrdersTable';
import { ProductsList } from './components/ProductsList';
import { ReportsView } from './components/ReportsView';

function App() {
  const [activeTab, setActiveTab] = React.useState<'orders' | 'products' | 'reports'>('orders');
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

  const getBackgroundColor = () => {
    switch (activeTab) {
      case 'orders': return 'bg-blue-50';
      case 'products': return 'bg-green-50';
      case 'reports': return 'bg-purple-50';
      default: return 'bg-gray-100';
    }
  };

  const handleTabChange = (tab: typeof activeTab) => {
    setActiveTab(tab);
    setIsSidebarOpen(false);
  };

  return (
    <div className="min-h-screen">
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 lg:hidden"
              >
                {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
              <h1 className="text-xl font-bold text-gray-900">POS Dashboard</h1>
            </div>
          </div>
        </div>
      </header>

      <div className={`min-h-[calc(100vh-4rem)] transition-colors duration-200 ${getBackgroundColor()}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-5 lg:gap-6">
            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
              <div
                className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
                onClick={() => setIsSidebarOpen(false)}
              />
            )}

            {/* Sidebar */}
            <div className={`
              fixed inset-y-0 left-0 w-64 bg-white shadow-lg transform transition-transform duration-200 ease-in-out z-50
              lg:relative lg:transform-none lg:w-auto lg:col-span-1 lg:block lg:py-6
              ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}>
              <nav className="space-y-1 p-4 lg:p-0">
                <button
                  onClick={() => handleTabChange('orders')}
                  className={`w-full group flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                    activeTab === 'orders'
                      ? 'bg-blue-100 text-blue-900'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <LayoutDashboard className={`mr-3 h-6 w-6 ${
                    activeTab === 'orders' ? 'text-blue-500' : 'text-gray-400'
                  }`} />
                  Orders
                </button>

                <button
                  onClick={() => handleTabChange('products')}
                  className={`w-full group flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                    activeTab === 'products'
                      ? 'bg-green-100 text-green-900'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Package className={`mr-3 h-6 w-6 ${
                    activeTab === 'products' ? 'text-green-500' : 'text-gray-400'
                  }`} />
                  Products
                </button>

                <button
                  onClick={() => handleTabChange('reports')}
                  className={`w-full group flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                    activeTab === 'reports'
                      ? 'bg-purple-100 text-purple-900'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <BarChart3 className={`mr-3 h-6 w-6 ${
                    activeTab === 'reports' ? 'text-purple-500' : 'text-gray-400'
                  }`} />
                  Reports
                </button>
              </nav>
            </div>

            <main className="lg:col-span-4 py-6">
              {activeTab === 'orders' && <OrdersTable />}
              {activeTab === 'products' && <ProductsList />}
              {activeTab === 'reports' && <ReportsView />}
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;