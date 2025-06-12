import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { ordersApi } from '../services/api'
import LoadingSpinner from '../components/LoadingSpinner'
import { Order, OrderStatus } from '../types'

const OrdersPage = () => {
  const [currentPage, setCurrentPage] = useState(1)

  const { data: ordersData, isLoading } = useQuery({
    queryKey: ['orders', currentPage],
    queryFn: () => ordersApi.getOrders({ page: currentPage, per_page: 10 })
  })

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'confirmed':
        return 'bg-blue-100 text-blue-800'
      case 'processing':
        return 'bg-purple-100 text-purple-800'
      case 'shipped':
        return 'bg-indigo-100 text-indigo-800'
      case 'delivered':
        return 'bg-green-100 text-green-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      case 'refunded':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-nike-black mb-8">My Orders</h1>

        {!ordersData || ordersData.orders.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-nike-gray-400 mb-4">
              <svg className="w-24 h-24 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 2L3 7v11a2 2 0 002 2h10a2 2 0 002-2V7l-7-5zM8 16a1 1 0 11-2 0 1 1 0 012 0zm6 0a1 1 0 11-2 0 1 1 0 012 0z" clipRule="evenodd" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-nike-black mb-4">No orders yet</h2>
            <p className="text-nike-gray-600 mb-6">You haven't placed any orders yet. Start shopping to see your orders here.</p>
            <Link to="/products" className="btn-primary">
              Start Shopping
            </Link>
          </div>
        ) : (
          <>
            <div className="space-y-6">
              {ordersData.orders.map((order: Order) => (
                <div key={order.id} className="card p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold">Order #{order.order_number}</h3>
                      <p className="text-sm text-nike-gray-600">
                        Placed on {new Date(order.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                      <p className="text-lg font-semibold mt-1">${order.total_amount.toFixed(2)}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Order Items */}
                    <div>
                      <h4 className="font-medium mb-3">Items ({order.items.length})</h4>
                      <div className="space-y-2">
                        {order.items.slice(0, 3).map((item) => (
                          <div key={item.id} className="flex items-center space-x-3">
                            <img
                              src={item.product?.main_image || item.product?.images?.[0]?.image_url || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100&h=100&fit=crop'}
                              alt={item.product?.name || 'Product'}
                              className="w-12 h-12 object-cover rounded-lg bg-nike-gray-100"
                            />
                            <div className="flex-1">
                              <p className="font-medium text-sm">{item.product?.name}</p>
                              <p className="text-xs text-nike-gray-600">
                                {item.color} • Size {item.size} • Qty {item.quantity}
                              </p>
                            </div>
                            <span className="font-semibold text-sm">${item.total_price.toFixed(2)}</span>
                          </div>
                        ))}
                        {order.items.length > 3 && (
                          <p className="text-sm text-nike-gray-600">
                            +{order.items.length - 3} more items
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Shipping Info */}
                    <div>
                      <h4 className="font-medium mb-3">Shipping Address</h4>
                      <div className="text-sm text-nike-gray-700">
                        <p>{order.shipping_first_name} {order.shipping_last_name}</p>
                        <p>{order.shipping_address}</p>
                        <p>{order.shipping_city}, {order.shipping_state} {order.shipping_zip_code}</p>
                        <p>{order.shipping_country}</p>
                        {order.tracking_number && (
                          <p className="mt-2">
                            <span className="font-medium">Tracking:</span> {order.tracking_number}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center mt-6 pt-4 border-t border-nike-gray-200">
                    <div className="text-sm text-nike-gray-600">
                      Payment: {order.payment_status.charAt(0).toUpperCase() + order.payment_status.slice(1)}
                    </div>
                    <Link
                      to={`/orders/${order.id}`}
                      className="btn-secondary text-sm py-2 px-4"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {ordersData && ordersData.pages > 1 && (
              <div className="flex justify-center mt-12">
                <div className="flex space-x-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 border border-nike-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-nike-gray-100"
                  >
                    Previous
                  </button>
                  
                  {Array.from({ length: ordersData.pages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-4 py-2 rounded-lg ${
                        currentPage === page
                          ? 'bg-nike-black text-white'
                          : 'border border-nike-gray-300 hover:bg-nike-gray-100'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                  
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(ordersData.pages, prev + 1))}
                    disabled={currentPage === ordersData.pages}
                    className="px-4 py-2 border border-nike-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-nike-gray-100"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default OrdersPage