'use client';
import { useState, useEffect } from 'react';
import { TrendingUp, MapPin, Clock, DollarSign } from 'lucide-react';

interface TransportRequest {
  id: string;
  pickupLocation: string;
  deliveryLocation: string;
  price?: number;
  estimatedDays?: number;
  status: string;
  createdAt: Date;
}

interface TransportAnalyticsProps {
  requests?: TransportRequest[];
}

export default function TransportAnalytics({ requests = [] }: TransportAnalyticsProps) {
  const [analytics, setAnalytics] = useState({
    totalDistance: 0,
    averagePrice: 0,
    averageDeliveryTime: 0,
    topPickupLocations: [] as { location: string; count: number }[],
    topDeliveryLocations: [] as { location: string; count: number }[]
  });

  useEffect(() => {
    // Calculate analytics from requests
    const totalDistance = requests.reduce((sum, req) => {
      // Placeholder calculation - in real app, calculate actual distance
      return sum + Math.random() * 100;
    }, 0);

    const averagePrice = requests
      .filter(req => req.price)
      .reduce((sum, req) => sum + (req.price || 0), 0) / Math.max(requests.filter(req => req.price).length, 1);

    const averageDeliveryTime = requests
      .filter(req => req.estimatedDays)
      .reduce((sum, req) => sum + (req.estimatedDays || 0), 0) / Math.max(requests.filter(req => req.estimatedDays).length, 1);

    // Count locations
    const pickupCounts: { [key: string]: number } = {};
    const deliveryCounts: { [key: string]: number } = {};

    requests.forEach(req => {
      pickupCounts[req.pickupLocation] = (pickupCounts[req.pickupLocation] || 0) + 1;
      deliveryCounts[req.deliveryLocation] = (deliveryCounts[req.deliveryLocation] || 0) + 1;
    });

    const topPickupLocations = Object.entries(pickupCounts)
      .map(([location, count]) => ({ location, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    const topDeliveryLocations = Object.entries(deliveryCounts)
      .map(([location, count]) => ({ location, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    setAnalytics({
      totalDistance,
      averagePrice,
      averageDeliveryTime,
      topPickupLocations,
      topDeliveryLocations
    });
  }, [requests]);

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <TrendingUp className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Distance</p>
              <p className="text-2xl font-semibold text-gray-900">{analytics.totalDistance.toFixed(0)} km</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <DollarSign className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Average Price</p>
              <p className="text-2xl font-semibold text-gray-900">R{analytics.averagePrice.toFixed(0)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <Clock className="h-8 w-8 text-yellow-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Avg Delivery Time</p>
              <p className="text-2xl font-semibold text-gray-900">{analytics.averageDeliveryTime.toFixed(1)} days</p>
            </div>
          </div>
        </div>
      </div>

      {/* Location Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Top Pickup Locations</h3>
          </div>
          <div className="px-6 py-4">
            <div className="space-y-3">
              {analytics.topPickupLocations.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-900">{item.location}</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">{item.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Top Delivery Locations</h3>
          </div>
          <div className="px-6 py-4">
            <div className="space-y-3">
              {analytics.topDeliveryLocations.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-900">{item.location}</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">{item.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
