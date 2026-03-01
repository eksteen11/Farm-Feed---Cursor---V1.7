'use client';
import { useState, useEffect } from 'react';

interface TransportTrackingProps {
  requestId: string;
  onStatusUpdate?: (status: string) => void;
}

export default function TransportTracking({ requestId, onStatusUpdate }: TransportTrackingProps) {
  const [status, setStatus] = useState('pending');
  const [location, setLocation] = useState('');

  useEffect(() => {
    // Simulate tracking updates
    const interval = setInterval(() => {
      // Placeholder for real tracking logic
      setLocation('In transit...');
    }, 5000);

    return () => clearInterval(interval);
  }, [requestId]);

  return (
    <div className="p-4 border rounded-lg">
      <h3 className="text-lg font-semibold mb-2">Transport Tracking</h3>
      <div className="space-y-2">
        <div>
          <span className="font-medium">Status:</span> {status}
        </div>
        <div>
          <span className="font-medium">Location:</span> {location || 'Unknown'}
        </div>
      </div>
    </div>
  );
}
