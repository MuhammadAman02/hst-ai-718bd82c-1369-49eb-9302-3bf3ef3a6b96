import { Link } from 'react-router-dom'
import { Product } from '../types'
import { useCartStore } from '../store/cartStore'
import { useAuthStore } from '../store/authStore'
import toast from 'react-hot-toast'

interface ProductCardProps {
  product: Product
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { addItem } = useCartStore()
  const { isAuthenticated } = useAuthStore()

  const handleQuickAdd = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (!isAuthenticated) {
      toast.error('Please login to add items to cart')
      return
    }

    if (product.sizes.length === 0 || product.colors.length === 0) {
      toast.error('Product options not available')
      return
    }

    await addItem({
      product_id: product.id,
      quantity: 1,
      size: product.sizes[0],
      color: product.colors[0]
    })
  }

  return (
    <Link to={`/products/${product.id}`} className="group block">
      <div className="card hover-lift">
        <div className="aspect-square bg-nike-gray-100 relative overflow-hidden">
          <img
            src={product.main_image || product.images[0]?.image_url || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&h=500&fit=crop'}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {product.is_on_sale && (
            <div className="absolute top-4 left-4 bg-nike-red text-white px-2 py-1 text-xs font-semibold rounded">
              -{product.discount_percentage}%
            </div>
          )}
          <button
            onClick={handleQuickAdd}
            className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 btn-primary text-sm py-2 px-4"
          >
            Quick Add
          </button>
        </div>
        
        <div className="p-4">
          <div className="text-sm text-nike-gray-500 mb-1">{product.category.name}</div>
          <h3 className="font-semibold text-nike-black mb-2 line-clamp-2">{product.name}</h3>
          <div className="text-sm text-nike-gray-600 mb-3">{product.colors.length} Colors</div>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-lg font-semibold text-nike-black">${product.price}</span>
              {product.original_price && (
                <span className="text-sm text-nike-gray-500 line-through">${product.original_price}</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default ProductCard