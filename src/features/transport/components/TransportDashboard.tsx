'use client';
import { useState, useEffect } from 'react';
import { Truck, MapPin, Clock, DollarSign, Package } from 'lucide-react';

interface TransportRequest {
  id: string;
  requesterId: string;
  transporterId?: string;
  pickupLocation: string;
  deliveryLocation: string;
  quantity: number;
  unit: string;
  productType: string;
  status: 'pending' | 'accepted' | 'in_transit' | 'delivered' | 'cancelled';
  createdAt: Date;
  budget?: number;
  urgent: boolean;
}

interface TransportQuote {
  id: string;
  transportRequestId: string;
  transporterId: string;
  price: number;
  estimatedDays: number;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: Date;
}

interface TransportDashboardProps {
  requests?: TransportRequest[];
  quotes?: TransportQuote[];
}

export default function TransportDashboard({ requests = [], quotes = [] }: TransportDashboardProps) {
  const [stats, setStats] = useState({
    totalRequests: 0,
    activeRequests: 0,
    completedRequests: 0,
    pendingQuotes: 0,
    totalEarnings: 0,
    averageDeliveryTime: 0
  });

  useEffect(() => {
    // Calculate stats from requests and quotes
    const totalRequests = requests.length;
    const activeRequests = requests.filter(r => ['pending', 'accepted', 'in_transit'].includes(r.status)).length;
    const completedRequests = requests.filter(r => r.status === 'delivered').length;
    const pendingQuotes = quotes.filter(q => q.status === 'pending').length;
    const totalEarnings = quotes
      .filter(q => q.status === 'accepted')
      .reduce((sum, q) => sum + q.price, 0);
    const averageDeliveryTime = quotes
      .filter(q => q.status === 'accepted')
      .reduce((sum, q) => sum + q.estimatedDays, 0) / Math.max(quotes.filter(q => q.status === 'accepted').length, 1);

    setStats({
      totalRequests,
      activeRequests,
      completedRequests,
      pendingQuotes,
      totalEarnings,
      averageDeliveryTime
    });
  }, [requests, quotes]);

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <Truck className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Requests</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.totalRequests}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <Clock className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Requests</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.activeRequests}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <DollarSign className="h-8 w-8 text-yellow-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Earnings</p>
              <p className="text-2xl font-semibold text-gray-900">R{stats.totalEarnings.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Requests */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Recent Transport Requests</h3>
        </div>
        <div className="divide-y divide-gray-200">
          {requests.slice(0, 5).map((request) => (
            <div key={request.id} className="px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Package className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {request.quantity} {request.unit} of {request.productType}
                    </p>
                    <p className="text-sm text-gray-500">
                      {request.pickupLocation} → {request.deliveryLocation}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    request.status === 'accepted' ? 'bg-green-100 text-green-800' :
                    request.status === 'in_transit' ? 'bg-blue-100 text-blue-800' :
                    request.status === 'delivered' ? 'bg-gray-100 text-gray-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {request.status.replace('_', ' ')}
                  </span>
                  {request.urgent && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      Urgent
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
