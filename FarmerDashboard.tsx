import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { PlusCircle, Package, Truck, DollarSign, MessageCircle } from 'lucide-react';
import ChatModal from '../components/ChatModal';

export default function FarmerDashboard() {
  const { user, token } = useAuth();
  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newProduct, setNewProduct] = useState({ name: '', quantity: '', quality: '', price: '', image: '' });
  const [chatUser, setChatUser] = useState<{ id: string, name: string } | null>(null);

  useEffect(() => {
    fetchProducts();
    fetchOrders();
  }, []);

  const fetchProducts = async () => {
    const res = await fetch(`/api/products?farmerId=${user?.id}`);
    const data = await res.json();
    setProducts(data);
  };

  const fetchOrders = async () => {
    const res = await fetch('/api/orders', {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    setOrders(data);
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/products', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        name: newProduct.name,
        quantity: Number(newProduct.quantity),
        quality: newProduct.quality,
        price: Number(newProduct.price),
        images: [newProduct.image || 'https://picsum.photos/seed/fruit/400/300'],
        status: 'available'
      }),
    });
    if (res.ok) {
      setShowAddModal(false);
      setNewProduct({ name: '', quantity: '', quality: '', price: '', image: '' });
      fetchProducts();
    }
  };

  const updateOrderStatus = async (orderId: string, status: string) => {
    const res = await fetch(`/api/orders/${orderId}/status`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ status, location: user?.location }),
    });
    if (res.ok) {
      fetchOrders();
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Farmer Dashboard</h1>
        <button 
          onClick={() => setShowAddModal(true)}
          className="bg-green-600 text-white px-4 py-2 rounded-md flex items-center space-x-2 hover:bg-green-700"
        >
          <PlusCircle className="h-5 w-5" />
          <span>Add Product</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="glass-card p-6 rounded-lg flex items-center space-x-4">
          <div className="bg-green-100 p-3 rounded-full"><Package className="h-6 w-6 text-green-600" /></div>
          <div>
            <p className="text-sm text-gray-500 font-medium">My Products</p>
            <p className="text-2xl font-bold text-gray-900">{products.length}</p>
          </div>
        </div>
        <div className="glass-card p-6 rounded-lg flex items-center space-x-4">
          <div className="bg-blue-100 p-3 rounded-full"><Truck className="h-6 w-6 text-blue-600" /></div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Active Orders</p>
            <p className="text-2xl font-bold text-gray-900">{orders.filter(o => o.status !== 'Delivered').length}</p>
          </div>
        </div>
        <div className="glass-card p-6 rounded-lg flex items-center space-x-4">
          <div className="bg-yellow-100 p-3 rounded-full"><DollarSign className="h-6 w-6 text-yellow-600" /></div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Total Revenue</p>
            <p className="text-2xl font-bold text-gray-900">
              ${orders.filter(o => o.status === 'Delivered').reduce((acc, o) => acc + o.totalPrice, 0).toFixed(2)}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Products List */}
        <div className="glass-card rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50/50">
            <h2 className="text-lg font-bold text-gray-900">My Listed Products</h2>
          </div>
          <ul className="divide-y divide-gray-200">
            {products.length === 0 ? (
              <li className="px-6 py-4 text-gray-500 text-center">No products listed yet.</li>
            ) : (
              products.map(p => (
                <li key={p.id} className="px-6 py-4 flex items-center space-x-4">
                  <img src={p.images[0]} alt={p.name} className="h-16 w-16 object-cover rounded-md" referrerPolicy="no-referrer" />
                  <div className="flex-1">
                    <h3 className="text-md font-bold text-gray-900">{p.name}</h3>
                    <p className="text-sm text-gray-500">{p.quantity} kg • {p.quality}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-md font-bold text-green-600">${p.price}/kg</p>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {p.status}
                    </span>
                  </div>
                </li>
              ))
            )}
          </ul>
        </div>

        {/* Orders List */}
        <div className="glass-card rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50/50">
            <h2 className="text-lg font-bold text-gray-900">Recent Orders</h2>
          </div>
          <ul className="divide-y divide-gray-200">
            {orders.length === 0 ? (
              <li className="px-6 py-4 text-gray-500 text-center">No orders yet.</li>
            ) : (
              orders.map(o => (
                <li key={o.id} className="px-6 py-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-md font-bold text-gray-900">{o.productName}</h3>
                      <p className="text-sm text-gray-500">Buyer: {o.otherPartyName} ({o.otherPartyLocation})</p>
                      <p className="text-sm text-gray-500">Qty: {o.quantity} kg • Total: ${o.totalPrice}</p>
                    </div>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      o.status === 'Delivered' ? 'bg-green-100 text-green-800' : 
                      o.status === 'Shipped' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {o.status}
                    </span>
                  </div>
                  <div className="mt-3 flex space-x-2 items-center">
                    {o.status !== 'Delivered' && (
                      <>
                        {o.status === 'Pending' && (
                          <button 
                            onClick={() => updateOrderStatus(o.id, 'Shipped')}
                            className="text-xs bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                          >
                            Mark as Shipped
                          </button>
                        )}
                        {o.status === 'Shipped' && (
                          <button 
                            onClick={() => updateOrderStatus(o.id, 'Delivered')}
                            className="text-xs bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                          >
                            Mark as Delivered
                          </button>
                        )}
                      </>
                    )}
                    <button 
                      onClick={() => setChatUser({ id: o.buyerId, name: o.otherPartyName })}
                      className="text-xs flex items-center space-x-1 text-gray-600 border border-gray-300 px-3 py-1 rounded hover:bg-gray-50"
                    >
                      <MessageCircle className="h-4 w-4" />
                      <span>Chat</span>
                    </button>
                  </div>
                </li>
              ))
            )}
          </ul>
        </div>
      </div>

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h2 className="text-2xl font-bold mb-4">Add New Product</h2>
            <form onSubmit={handleAddProduct} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Fruit Name</label>
                <input type="text" required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Quantity (kg)</label>
                  <input type="number" required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" value={newProduct.quantity} onChange={e => setNewProduct({...newProduct, quantity: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Price per kg ($)</label>
                  <input type="number" step="0.01" required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: e.target.value})} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Quality / Grade</label>
                <input type="text" required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" value={newProduct.quality} onChange={e => setNewProduct({...newProduct, quality: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Image URL (Optional)</label>
                <input type="url" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" value={newProduct.image} onChange={e => setNewProduct({...newProduct, image: e.target.value})} />
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button type="button" onClick={() => setShowAddModal(false)} className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">Save Product</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Chat Modal */}
      {chatUser && (
        <ChatModal 
          otherUserId={chatUser.id} 
          otherUserName={chatUser.name} 
          onClose={() => setChatUser(null)} 
        />
      )}
    </div>
  );
}
