import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useQuery, useMutation } from '@tanstack/react-query'
import { cartApi, ordersApi } from '../services/api'
import { CreateOrderData } from '../types'
import LoadingSpinner from '../components/LoadingSpinner'
import toast from 'react-hot-toast'

const CheckoutPage = () => {
  const navigate = useNavigate()
  const [paymentMethod, setPaymentMethod] = useState('card')

  const { data: cart, isLoading: cartLoading } = useQuery({
    queryKey: ['cart'],
    queryFn: cartApi.getCart
  })

  const createOrderMutation = useMutation({
    mutationFn: ordersApi.createOrder,
    onSuccess: (order) => {
      toast.success('Order placed successfully!')
      navigate(`/orders/${order.id}`)
    },
    onError: (error: any) => {
      const message = error.response?.data?.detail || 'Failed to place order'
      toast.error(message)
    }
  })

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<CreateOrderData>()

  if (cartLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-nike-black mb-4">Your cart is empty</h1>
          <button onClick={() => navigate('/products')} className="btn-primary">
            Continue Shopping
          </button>
        </div>
      </div>
    )
  }

  const subtotal = cart.total_amount
  const shipping = subtotal >= 100 ? 0 : 10
  const tax = subtotal * 0.08
  const total = subtotal + shipping + tax

  const onSubmit = async (data: CreateOrderData) => {
    const orderData = {
      ...data,
      payment_method: paymentMethod
    }
    createOrderMutation.mutate(orderData)
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-nike-black mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Checkout Form */}
          <div>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              {/* Shipping Information */}
              <div className="card p-6">
                <h2 className="text-xl font-semibold mb-4">Shipping Information</h2>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-nike-gray-700 mb-1">
                      First Name
                    </label>
                    <input
                      {...register('shipping_first_name', { required: 'First name is required' })}
                      className="input-field"
                      placeholder="First name"
                    />
                    {errors.shipping_first_name && (
                      <p className="mt-1 text-sm text-red-600">{errors.shipping_first_name.message}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-nike-gray-700 mb-1">
                      Last Name
                    </label>
                    <input
                      {...register('shipping_last_name', { required: 'Last name is required' })}
                      className="input-field"
                      placeholder="Last name"
                    />
                    {errors.shipping_last_name && (
                      <p className="mt-1 text-sm text-red-600">{errors.shipping_last_name.message}</p>
                    )}
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-nike-gray-700 mb-1">
                    Address
                  </label>
                  <input
                    {...register('shipping_address', { required: 'Address is required' })}
                    className="input-field"
                    placeholder="Street address"
                  />
                  {errors.shipping_address && (
                    <p className="mt-1 text-sm text-red-600">{errors.shipping_address.message}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-nike-gray-700 mb-1">
                      City
                    </label>
                    <input
                      {...register('shipping_city', { required: 'City is required' })}
                      className="input-field"
                      placeholder="City"
                    />
                    {errors.shipping_city && (
                      <p className="mt-1 text-sm text-red-600">{errors.shipping_city.message}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-nike-gray-700 mb-1">
                      State
                    </label>
                    <input
                      {...register('shipping_state', { required: 'State is required' })}
                      className="input-field"
                      placeholder="State"
                    />
                    {errors.shipping_state && (
                      <p className="mt-1 text-sm text-red-600">{errors.shipping_state.message}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-nike-gray-700 mb-1">
                      ZIP Code
                    </label>
                    <input
                      {...register('shipping_zip_code', { required: 'ZIP code is required' })}
                      className="input-field"
                      placeholder="ZIP code"
                    />
                    {errors.shipping_zip_code && (
                      <p className="mt-1 text-sm text-red-600">{errors.shipping_zip_code.message}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-nike-gray-700 mb-1">
                      Country
                    </label>
                    <input
                      {...register('shipping_country', { required: 'Country is required' })}
                      className="input-field"
                      placeholder="Country"
                      defaultValue="United States"
                    />
                    {errors.shipping_country && (
                      <p className="mt-1 text-sm text-red-600">{errors.shipping_country.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-nike-gray-700 mb-1">
                    Phone Number (Optional)
                  </label>
                  <input
                    {...register('shipping_phone')}
                    className="input-field"
                    placeholder="Phone number"
                  />
                </div>
              </div>

              {/* Payment Method */}
              <div className="card p-6">
                <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
                
                <div className="space-y-3">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="card"
                      checked={paymentMethod === 'card'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="mr-3"
                    />
                    <span>Credit/Debit Card</span>
                  </label>
                  
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="paypal"
                      checked={paymentMethod === 'paypal'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="mr-3"
                    />
                    <span>PayPal</span>
                  </label>
                  
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="apple_pay"
                      checked={paymentMethod === 'apple_pay'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="mr-3"
                    />
                    <span>Apple Pay</span>
                  </label>
                </div>

                {paymentMethod === 'card' && (
                  <div className="mt-4 space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-nike-gray-700 mb-1">
                        Card Number
                      </label>
                      <input
                        type="text"
                        className="input-field"
                        placeholder="1234 5678 9012 3456"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-nike-gray-700 mb-1">
                          Expiry Date
                        </label>
                        <input
                          type="text"
                          className="input-field"
                          placeholder="MM/YY"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-nike-gray-700 mb-1">
                          CVV
                        </label>
                        <input
                          type="text"
                          className="input-field"
                          placeholder="123"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Order Notes */}
              <div className="card p-6">
                <h2 className="text-xl font-semibold mb-4">Order Notes (Optional)</h2>
                <textarea
                  {...register('notes')}
                  className="input-field"
                  rows={3}
                  placeholder="Any special instructions for your order..."
                />
              </div>

              <button
                type="submit"
                disabled={createOrderMutation.isPending}
                className="w-full btn-primary py-4 text-lg font-semibold flex items-center justify-center"
              >
                {createOrderMutation.isPending ? (
                  <>
                    <LoadingSpinner size="sm" className="mr-2" />
                    Placing Order...
                  </>
                ) : (
                  `Place Order - $${total.toFixed(2)}`
                )}
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div>
            <div className="card p-6 sticky top-24">
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
              
              {/* Cart Items */}
              <div className="space-y-3 mb-6">
                {cart.items.map((item) => (
                  <div key={item.id} className="flex items-center space-x-3">
                    <img
                      src={item.product?.main_image || item.product?.images[0]?.image_url || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100&h=100&fit=crop'}
                      alt={item.product?.name || 'Product'}
                      className="w-12 h-12 object-cover rounded-lg bg-nike-gray-100"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{item.product?.name}</h4>
                      <p className="text-xs text-nike-gray-600">
                        {item.color} • Size {item.size} • Qty {item.quantity}
                      </p>
                    </div>
                    <span className="font-semibold text-sm">${item.total_price.toFixed(2)}</span>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="border-t border-nike-gray-200 pt-3">
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {shipping > 0 && (
                <div className="bg-nike-gray-100 p-3 rounded-lg text-sm">
                  <p className="text-nike-gray-700">
                    You're ${(100 - subtotal).toFixed(2)} away from free shipping!
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CheckoutPage