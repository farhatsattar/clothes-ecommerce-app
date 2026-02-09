import React from 'react';
import { Order } from '@/types';

interface OrderTrackerProps {
  order: Order;
}

const OrderTracker: React.FC<OrderTrackerProps> = ({ order }) => {
  // Define the order status progression
  const statusSteps = [
    { status: 'pending', label: 'Order Placed', icon: '📦' },
    { status: 'processing', label: 'Processing', icon: '🔄' },
    { status: 'shipped', label: 'Shipped', icon: '🚚' },
    { status: 'delivered', label: 'Delivered', icon: '✅' },
    { status: 'cancelled', label: 'Cancelled', icon: '❌' },
  ];

  // Get current step index
  const currentStepIndex = statusSteps.findIndex(step => step.status === order.status);
  const currentStep = statusSteps[currentStepIndex];

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-xl font-semibold mb-4">Order Tracking</h2>

      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-500">Order ID: {order.id}</span>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
            order.status === 'processing' ? 'bg-blue-100 text-blue-800' :
            order.status === 'shipped' ? 'bg-purple-100 text-purple-800' :
            order.status === 'delivered' ? 'bg-green-100 text-green-800' :
            order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
            'bg-gray-100 text-gray-800'
          }`}>
            {currentStep?.label}
          </span>
        </div>
        <p className="text-sm text-gray-600">
          Status: <span className="capitalize">{order.status.replace('_', ' ')}</span>
        </p>
        <p className="text-sm text-gray-600">
          Placed on: {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}
        </p>
      </div>

      {/* Progress bar */}
      <div className="relative pt-4">
        <div className="absolute top-4 left-0 right-0 h-1 bg-gray-200 z-0"></div>
        <div
          className="absolute top-4 left-0 h-1 bg-ibfashionhub-red z-10 transition-all duration-500 ease-in-out"
          style={{ width: `${((currentStepIndex + 1) / statusSteps.length) * 100}%` }}
        ></div>

        <div className="relative z-20 flex justify-between">
          {statusSteps.map((step, index) => {
            const isCompleted = index < currentStepIndex;
            const isCurrent = index === currentStepIndex;

            return (
              <div key={step.status} className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mb-2
                  ${isCompleted ? 'bg-green-500 text-white' :
                    isCurrent ? 'bg-ibfashionhub-red text-white ring-4 ring-ibfashionhub-100' :
                    'bg-gray-200 text-gray-500'}`}
                >
                  {step.icon}
                </div>
                <span className={`text-xs text-center ${
                  isCurrent ? 'font-semibold text-ibfashionhub-red' :
                  isCompleted ? 'text-gray-700' : 'text-gray-400'
                }`}>
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default OrderTracker;