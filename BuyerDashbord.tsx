import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Search, ShoppingCart, MapPin, Star, MessageCircle } from 'lucide-react';
import ChatModal from '../components/ChatModal';

export default function BuyerDashboard() {
  const { user, token } = useAuth();
  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [orderQuantity, setOrderQuantity] = useState(1);
  const [chatUser, setChatUser] = useState<{ id: string, name: string } | null>(null);

  useEffect(() => {
    fetchProducts();
    fetchOrders();
  }, []);

  const fetchProducts = async () => {
    const res = await fetch('/api/products');
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

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;
    
    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        productId: selectedProduct.id,
        quantity: orderQuantity,
        totalPrice: orderQuantity * selectedProduct.price
      }),
    });
    
    if (res.ok) {
      setSelectedProduct(null);
      setOrderQuantity(1);
      fetchOrders();
    }
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.farmerLocation.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Global Marketplace</h1>
      </div>

      <div className="mb-8 relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-md"
          placeholder="Search for fruits, locations, or farmers..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Products Grid */}
        <div className="lg:col-span-2">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Available Produce</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {filteredProducts.map(p => (
              <div key={p.id} className="glass-card rounded-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                <img src={p.images[0]} alt={p.name} className="w-full h-48 object-cover" referrerPolicy="no-referrer" />
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-bold text-gray-900">{p.name}</h3>
                    <p className="text-lg font-bold text-green-600">${p.price}/kg</p>
                  </div>
                  <div className="flex items-center text-sm text-gray-500 mb-2">
                    <MapPin className="h-4 w-4 mr-1" />
                    {p.farmerLocation}
                  </div>
                  <div className="flex items-center text-sm text-gray-500 mb-4">
                    <Star className="h-4 w-4 text-yellow-400 mr-1" />
                    {p.quality} • {p.quantity} kg available
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setSelectedProduct(p)}
                      className="flex-1 bg-green-600 text-white py-2 rounded-md font-medium hover:bg-green-700 transition flex justify-center items-center shadow-sm"
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Order
                    </button>
                    <button
                      onClick={() => setChatUser({ id: p.farmerId, name: p.farmerName })}
                      className="flex-1 bg-white/50 text-gray-700 border border-gray-300 py-2 rounded-md font-medium hover:bg-white transition flex justify-center items-center"
                    >
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Chat
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Orders Sidebar */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">My Orders</h2>
          <div className="glass-card rounded-lg overflow-hidden">
            <ul className="divide-y divide-gray-200">
              {orders.length === 0 ? (
                <li className="px-6 py-4 text-gray-500 text-center">No orders placed yet.</li>
              ) : (
                orders.map(o => (
                  <li key={o.id} className="p-4 hover:bg-white/30 transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-md font-bold text-gray-900">{o.productName}</h3>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        o.status === 'Delivered' ? 'bg-green-100 text-green-800' : 
                        o.status === 'Shipped' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {o.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mb-1">From: {o.otherPartyName}</p>
                    <div className="flex justify-between items-center mt-2">
                      <p className="text-sm font-medium text-gray-900">{o.quantity} kg</p>
                      <p className="text-sm font-bold text-green-600">${o.totalPrice}</p>
                    </div>
                    
                    {/* Simple Tracking Display */}
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <p className="text-xs text-gray-500 font-medium mb-1">Tracking History:</p>
                      <ul className="space-y-1">
                        {o.trackingHistory.map((h: any, i: number) => (
                          <li key={i} className="text-xs text-gray-600 flex justify-between">
                            <span>{h.status} - {h.location}</span>
                            <span className="text-gray-400">{new Date(h.timestamp).toLocaleDateString()}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </li>
                ))
              )}
            </ul>
          </div>
        </div>
      </div>

      {/* Order Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h2 className="text-2xl font-bold mb-2">Place Order</h2>
            <p className="text-gray-600 mb-4">Ordering {selectedProduct.name} from {selectedProduct.farmerName}</p>
            
            <form onSubmit={handlePlaceOrder} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Quantity (kg)</label>
                <input 
                  type="number" 
                  min="1" 
                  max={selectedProduct.quantity}
                  required 
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" 
                  value={orderQuantity} 
                  onChange={e => setOrderQuantity(Number(e.target.value))} 
                />
                <p className="text-xs text-gray-500 mt-1">Max available: {selectedProduct.quantity} kg</p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Price per kg:</span>
                  <span className="font-medium">${selectedProduct.price}</span>
                </div>
                <div className="flex justify-between text-lg font-bold border-t border-gray-200 pt-2">
                  <span>Total:</span>
                  <span className="text-green-600">${(orderQuantity * selectedProduct.price).toFixed(2)}</span>
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button type="button" onClick={() => setSelectedProduct(null)} className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">Confirm Order</button>
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
