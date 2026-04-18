import React from 'react';
import { Link } from 'react-router-dom';
import { Globe, TrendingUp, ShieldCheck, Truck } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-green-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">
            Connect Directly with Global Markets
          </h1>
          <p className="text-xl md:text-2xl mb-10 max-w-3xl mx-auto text-green-100">
            AgroConnect Global empowers farmers to sell their produce directly to international buyers, ensuring fair prices, transparency, and seamless logistics.
          </p>
          <div className="flex justify-center space-x-4">
            <Link
              to="/register"
              className="bg-white text-green-600 px-8 py-3 rounded-full font-bold text-lg hover:bg-gray-100 transition shadow-lg"
            >
              Get Started
            </Link>
            <Link
              to="/login"
              className="bg-green-700 text-white px-8 py-3 rounded-full font-bold text-lg hover:bg-green-800 transition shadow-lg border border-green-500"
            >
              Login
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">Why Choose AgroConnect?</h2>
            <p className="mt-4 text-lg text-gray-600">Eliminating middlemen to maximize profits and ensure quality.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center">
              <div className="bg-green-100 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4">
                <TrendingUp className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Better Profits</h3>
              <p className="text-gray-600">Farmers get the price they deserve by selling directly to buyers.</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center">
              <div className="bg-blue-100 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4">
                <Globe className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Global Reach</h3>
              <p className="text-gray-600">Access international markets and buyers from around the world.</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center">
              <div className="bg-yellow-100 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4">
                <ShieldCheck className="h-8 w-8 text-yellow-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Secure Payments</h3>
              <p className="text-gray-600">Guaranteed and transparent payment processing for every order.</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center">
              <div className="bg-purple-100 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4">
                <Truck className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Logistics Tracking</h3>
              <p className="text-gray-600">Real-time tracking of shipments from farm to destination.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
