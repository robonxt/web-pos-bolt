import React from 'react';
import { MenuItem } from '../types/pos';
import { db } from '../lib/db';
import { Plus, Edit, ToggleLeft, ToggleRight } from 'lucide-react';

export const ProductsList = () => {
  const [items, setItems] = React.useState<MenuItem[]>([]);
  const [editingItem, setEditingItem] = React.useState<MenuItem | null>(null);

  React.useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    const data = await db.getMenuItems();
    setItems(data);
  };

  const toggleAvailability = async (item: MenuItem) => {
    const updatedItem = { ...item, available: !item.available };
    const updatedItems = items.map(i => i.id === item.id ? updatedItem : i);
    await db.setMenuItems(updatedItems);
    setItems(updatedItems);
  };

  const saveItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    const updatedItems = editingItem.id
      ? items.map(i => i.id === editingItem.id ? editingItem : i)
      : [...items, { ...editingItem, id: Date.now() }];

    await db.setMenuItems(updatedItems);
    setItems(updatedItems);
    setEditingItem(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Menu Items</h2>
        <button
          onClick={() => setEditingItem({ id: 0, name: '', price: 0, category: '', available: true })}
          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Item
        </button>
      </div>

      {editingItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <form onSubmit={saveItem} className="bg-white rounded-lg p-6 max-w-md w-full space-y-4">
            <h3 className="text-xl font-semibold">
              {editingItem.id ? 'Edit Item' : 'New Item'}
            </h3>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium">Name</label>
              <input
                type="text"
                value={editingItem.name}
                onChange={e => setEditingItem({ ...editingItem, name: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium">Price</label>
              <input
                type="number"
                step="0.01"
                value={editingItem.price}
                onChange={e => setEditingItem({ ...editingItem, price: parseFloat(e.target.value) })}
                className="w-full px-3 py-2 border rounded-lg"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium">Category</label>
              <input
                type="text"
                value={editingItem.category}
                onChange={e => setEditingItem({ ...editingItem, category: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium">Image URL</label>
              <input
                type="url"
                value={editingItem.imageUrl || ''}
                onChange={e => setEditingItem({ ...editingItem, imageUrl: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>

            <div className="flex gap-2 pt-4">
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => setEditingItem(null)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
        {items.map((item) => (
          <div
            key={item.id}
            className="bg-white p-6 rounded-lg shadow-md space-y-4"
          >
            {item.imageUrl && (
              <img
                src={item.imageUrl}
                alt={item.name}
                className="w-full h-48 object-cover rounded-lg"
              />
            )}
            
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold">{item.name}</h3>
                <p className="text-gray-600">{item.category}</p>
                <p className="text-lg font-bold mt-2">$s{item.price.toFixed(2)}</p>
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={() => setEditingItem(item)}
                  className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <Edit className="w-5 h-5" />
                </button>
                <button
                  onClick={() => toggleAvailability(item)}
                  className={`p-2 ${item.available ? 'text-green-500 hover:bg-green-50' : 'text-red-500 hover:bg-red-50'} rounded-lg transition-colors`}
                >
                  {item.available ? <ToggleRight className="w-5 h-5" /> : <ToggleLeft className="w-5 h-5" />}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};