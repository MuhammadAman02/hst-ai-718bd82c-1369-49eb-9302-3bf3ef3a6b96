import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { productsApi } from '../services/api'
import ProductCard from '../components/ProductCard'
import LoadingSpinner from '../components/LoadingSpinner'
import { useCartStore } from '../store/cartStore'
import { useAuthStore } from '../store/authStore'

const HomePage = () => {
  const { fetchCart } = useCartStore()
  const { isAuthenticated } = useAuthStore()

  // Fetch cart on page load if authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchCart()
    }
  }, [isAuthenticated, fetchCart])

  const { data: featuredProducts, isLoading } = useQuery({
    queryKey: ['featured-products'],
    queryFn: () => productsApi.getFeaturedProducts(8)
  })

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="hero-bg text-white py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in">
              <h1 className="text-5xl lg:text-7xl font-black mb-6 leading-tight">
                JUST DO
                <span className="nike-text-gradient block">IT</span>
              </h1>
              <p className="text-xl lg:text-2xl mb-8 text-nike-gray-200 max-w-lg">
                Discover the latest Nike shoes collection. From basketball to running, 
                find your perfect pair and unleash your potential.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/products" className="bg-white text-nike-black hover:bg-nike-gray-100 font-semibold px-8 py-4 text-lg rounded-lg transition-colors text-center">
                  Shop Now
                </Link>
                <Link to="/products?is_featured=true" className="border-2 border-white text-white hover:bg-white hover:text-nike-black font-semibold px-8 py-4 text-lg rounded-lg transition-colors text-center">
                  Explore Collection
                </Link>
              </div>
            </div>
            
            <div className="relative animate-fade-in">
              <div className="relative z-10">
                <img
                  src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=600&fit=crop"
                  alt="Nike Shoe"
                  className="w-full max-w-lg mx-auto transform rotate-12 hover:rotate-6 transition-transform duration-500"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-nike-red to-nike-orange opacity-20 blur-3xl transform scale-110"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-nike-black mb-4">
              Featured Products
            </h2>
            <p className="text-lg text-nike-gray-600 max-w-2xl mx-auto">
              Discover our most popular and trending Nike shoes, carefully selected for performance and style.
            </p>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner size="lg" />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts?.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link to="/products" className="btn-primary text-lg px-8 py-4">
              View All Products
            </Link>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-nike-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl lg:text-4xl font-bold text-nike-black text-center mb-12">
            Shop by Category
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Link to="/products?category_id=1" className="group">
              <div className="card hover-lift">
                <div className="aspect-video bg-gradient-to-br from-nike-red to-nike-orange relative overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1584735175315-9d5df23860e6?w=600&h=400&fit=crop"
                    alt="Basketball"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-20"></div>
                  <div className="absolute bottom-6 left-6">
                    <h3 className="text-2xl font-bold text-white mb-2">Basketball</h3>
                    <p className="text-white opacity-90">Dominate the court</p>
                  </div>
                </div>
              </div>
            </Link>

            <Link to="/products?category_id=2" className="group">
              <div className="card hover-lift">
                <div className="aspect-video bg-gradient-to-br from-nike-black to-nike-gray-800 relative overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600&h=400&fit=crop"
                    alt="Running"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-20"></div>
                  <div className="absolute bottom-6 left-6">
                    <h3 className="text-2xl font-bold text-white mb-2">Running</h3>
                    <p className="text-white opacity-90">Run your world</p>
                  </div>
                </div>
              </div>
            </Link>

            <Link to="/products?category_id=3" className="group">
              <div className="card hover-lift">
                <div className="aspect-video bg-gradient-to-br from-nike-orange to-nike-red relative overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600&h=400&fit=crop"
                    alt="Lifestyle"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-20"></div>
                  <div className="absolute bottom-6 left-6">
                    <h3 className="text-2xl font-bold text-white mb-2">Lifestyle</h3>
                    <p className="text-white opacity-90">Everyday comfort</p>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-nike-black text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            Stay in the Loop
          </h2>
          <p className="text-xl text-nike-gray-300 mb-8">
            Get the latest updates on new releases, exclusive offers, and Nike news.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg text-nike-black focus:outline-none focus:ring-2 focus:ring-nike-red"
            />
            <button className="bg-nike-red hover:bg-nike-orange px-6 py-3 rounded-lg font-semibold transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}

export default HomePage