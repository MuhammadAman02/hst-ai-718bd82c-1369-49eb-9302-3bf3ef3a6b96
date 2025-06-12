import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { StarIcon, HeartIcon, ShareIcon } from '@heroicons/react/24/outline'
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid'
import { productsApi } from '../services/api'
import { useCartStore } from '../store/cartStore'
import { useAuthStore } from '../store/authStore'
import LoadingSpinner from '../components/LoadingSpinner'
import toast from 'react-hot-toast'

const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { addItem } = useCartStore()
  const { isAuthenticated } = useAuthStore()
  
  const [selectedSize, setSelectedSize] = useState('')
  const [selectedColor, setSelectedColor] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)

  const { data: product, isLoading, error } = useQuery({
    queryKey: ['product', id],
    queryFn: () => productsApi.getProduct(parseInt(id!)),
    enabled: !!id
  })

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-nike-black mb-4">Product Not Found</h1>
          <button onClick={() => navigate('/products')} className="btn-primary">
            Back to Products
          </button>
        </div>
      </div>
    )
  }

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to add items to cart')
      navigate('/login')
      return
    }

    if (!selectedSize) {
      toast.error('Please select a size')
      return
    }

    if (!selectedColor) {
      toast.error('Please select a color')
      return
    }

    await addItem({
      product_id: product.id,
      quantity,
      size: selectedSize,
      color: selectedColor
    })
  }

  const images = product.images.length > 0 ? product.images : [
    { id: 1, image_url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=600&fit=crop', alt_text: product.name }
  ]

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <ol className="flex items-center space-x-2 text-sm">
            <li><button onClick={() => navigate('/')} className="text-nike-gray-500 hover:text-nike-black">Home</button></li>
            <li><span className="text-nike-gray-400">/</span></li>
            <li><button onClick={() => navigate('/products')} className="text-nike-gray-500 hover:text-nike-black">Products</button></li>
            <li><span className="text-nike-gray-400">/</span></li>
            <li><span className="text-nike-black">{product.name}</span></li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div>
            <div className="aspect-square bg-nike-gray-100 rounded-lg overflow-hidden mb-4">
              <img
                src={images[selectedImageIndex]?.image_url}
                alt={images[selectedImageIndex]?.alt_text || product.name}
                className="w-full h-full object-cover"
              />
            </div>
            
            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {images.map((image, index) => (
                  <button
                    key={image.id}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`aspect-square bg-nike-gray-100 rounded-lg overflow-hidden border-2 ${
                      selectedImageIndex === index ? 'border-nike-black' : 'border-transparent'
                    }`}
                  >
                    <img
                      src={image.image_url}
                      alt={image.alt_text || product.name}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div>
            <div className="mb-4">
              <span className="text-sm text-nike-gray-500">{product.category.name}</span>
              <h1 className="text-3xl font-bold text-nike-black mt-1">{product.name}</h1>
            </div>

            {/* Rating */}
            <div className="flex items-center mb-4">
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <StarIconSolid key={star} className="h-5 w-5 text-yellow-400" />
                ))}
              </div>
              <span className="ml-2 text-sm text-nike-gray-600">(4.8) 124 reviews</span>
            </div>

            {/* Price */}
            <div className="flex items-center space-x-3 mb-6">
              <span className="text-3xl font-bold text-nike-black">${product.price}</span>
              {product.original_price && (
                <span className="text-xl text-nike-gray-500 line-through">${product.original_price}</span>
              )}
              {product.is_on_sale && (
                <span className="bg-nike-red text-white px-2 py-1 text-sm font-semibold rounded">
                  -{product.discount_percentage}% OFF
                </span>
              )}
            </div>

            {/* Description */}
            <div className="mb-6">
              <p className="text-nike-gray-700">{product.description}</p>
            </div>

            {/* Color Selection */}
            {product.colors.length > 0 && (
              <div className="mb-6">
                <h3 className="font-semibold mb-3">Color: {selectedColor || 'Select a color'}</h3>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`px-4 py-2 border rounded-lg text-sm font-medium transition-colors ${
                        selectedColor === color
                          ? 'border-nike-black bg-nike-black text-white'
                          : 'border-nike-gray-300 hover:border-nike-gray-400'
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Size Selection */}
            {product.sizes.length > 0 && (
              <div className="mb-6">
                <h3 className="font-semibold mb-3">Size: {selectedSize || 'Select a size'}</h3>
                <div className="grid grid-cols-4 gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`py-3 border rounded-lg text-sm font-medium transition-colors ${
                        selectedSize === size
                          ? 'border-nike-black bg-nike-black text-white'
                          : 'border-nike-gray-300 hover:border-nike-gray-400'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="mb-8">
              <h3 className="font-semibold mb-3">Quantity</h3>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 border border-nike-gray-300 rounded-lg flex items-center justify-center hover:border-nike-gray-400"
                >
                  -
                </button>
                <span className="text-lg font-semibold w-8 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 border border-nike-gray-300 rounded-lg flex items-center justify-center hover:border-nike-gray-400"
                >
                  +
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-4">
              <button
                onClick={handleAddToCart}
                className="w-full btn-primary py-4 text-lg font-semibold"
              >
                Add to Cart - ${(product.price * quantity).toFixed(2)}
              </button>
              
              <div className="flex space-x-4">
                <button className="flex-1 btn-secondary py-3 flex items-center justify-center space-x-2">
                  <HeartIcon className="h-5 w-5" />
                  <span>Add to Wishlist</span>
                </button>
                <button className="flex-1 btn-secondary py-3 flex items-center justify-center space-x-2">
                  <ShareIcon className="h-5 w-5" />
                  <span>Share</span>
                </button>
              </div>
            </div>

            {/* Product Info */}
            <div className="mt-8 pt-8 border-t border-nike-gray-200">
              <div className="space-y-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-nike-gray-600">SKU:</span>
                  <span className="font-medium">{product.sku}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-nike-gray-600">Brand:</span>
                  <span className="font-medium">{product.brand}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-nike-gray-600">Stock:</span>
                  <span className="font-medium text-green-600">{product.stock_quantity} available</span>
                </div>
                {product.weight && (
                  <div className="flex justify-between">
                    <span className="text-nike-gray-600">Weight:</span>
                    <span className="font-medium">{product.weight} kg</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetailPage