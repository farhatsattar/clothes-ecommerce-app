import React from 'react';
import { Order } from '@/types';
import Button from '@/components/ui/Button';

interface OrderHistoryProps {
  orders: Order[];
}

const OrderHistory: React.FC<OrderHistoryProps> = ({ orders }) => {
  if (orders.length === 0) {
    return (
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900">Order History</h3>
          <p className="mt-1 text-sm text-gray-500">Your past orders</p>
        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:p-6 text-center">
          <p className="text-gray-500">No orders found. Place your first order to see it here.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg font-medium leading-6 text-gray-900">Order History</h3>
        <p className="mt-1 text-sm text-gray-500">Your past orders</p>
      </div>
      <div className="border-t border-gray-200">
        <ul className="divide-y divide-gray-200">
          {orders.map((order, index) => (
            <li key={(order as Order & { orderNumber?: string }).orderNumber ?? order.id ?? `order-${index}`} className="px-4 py-6 sm:px-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <p className="text-sm font-medium text-gray-900">
                    Order <span className="font-mono text-gray-500">#{(order as Order & { orderNumber?: string }).orderNumber ?? (order.id ? order.id.substring(0, 8) : 'N/A')}</span>
                  </p>
                  <span className={`ml-4 inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium ${
                    order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                    order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">${(order.totalAmount / 100).toFixed(2)}</p>
                  <p className="text-sm text-gray-500">{order.createdAt.toLocaleDateString()}</p>
                </div>
              </div>

              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-900">Items</h4>
                <ul className="mt-2 space-y-2">
                  {order.items.map((item, idx) => (
                    <li key={idx} className="flex justify-between text-sm text-gray-500">
                      <div>
                        <span className="font-medium text-gray-900">{item.name || 'Item'}</span>
                        {' × '}
                        <span>{item.quantity}</span>
                        <span className="ml-2">Size: {item.selectedSize}, Color: {item.selectedColor}</span>
                      </div>
                      <div className="font-medium text-gray-900">
                        ${(item.priceAtTime / 100).toFixed(2)}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-4 flex justify-end">
                <Button
                  size="sm"
                  variant="outline"
                >
                  View Details
                </Button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default OrderHistory;