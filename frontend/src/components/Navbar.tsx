import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ShoppingBagIcon, UserIcon, MagnifyingGlassIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import { useAuthStore } from '../store/authStore'
import { useCartStore } from '../store/cartStore'

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const { user, isAuthenticated, logout } = useAuthStore()
  const { getItemCount } = useCartStore()
  const navigate = useNavigate()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`)
      setSearchQuery('')
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const itemCount = getItemCount()

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="text-2xl font-black text-nike-black">
              NIKE
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/products" className="text-nike-gray-700 hover:text-nike-black font-medium transition-colors">
              All Products
            </Link>
            <Link to="/products?category_id=1" className="text-nike-gray-700 hover:text-nike-black font-medium transition-colors">
              Basketball
            </Link>
            <Link to="/products?category_id=2" className="text-nike-gray-700 hover:text-nike-black font-medium transition-colors">
              Running
            </Link>
            <Link to="/products?category_id=3" className="text-nike-gray-700 hover:text-nike-black font-medium transition-colors">
              Lifestyle
            </Link>
            <Link to="/products?is_featured=true" className="text-nike-red hover:text-nike-orange font-medium transition-colors">
              Sale
            </Link>
          </div>

          {/* Search and Actions */}
          <div className="flex items-center space-x-4">
            {/* Search */}
            <form onSubmit={handleSearch} className="hidden sm:flex items-center bg-nike-gray-100 rounded-full px-4 py-2 w-64">
              <MagnifyingGlassIcon className="h-4 w-4 text-nike-gray-500 mr-2" />
              <input
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent border-none focus:outline-none text-sm flex-1"
              />
            </form>

            {/* Cart */}
            <Link to="/cart" className="relative p-2 text-nike-gray-700 hover:text-nike-black">
              <ShoppingBagIcon className="h-6 w-6" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-nike-red text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Link>

            {/* User Menu */}
            {isAuthenticated ? (
              <div className="relative group">
                <button className="flex items-center space-x-2 p-2 text-nike-gray-700 hover:text-nike-black">
                  <UserIcon className="h-6 w-6" />
                  <span className="hidden md:block text-sm font-medium">{user?.first_name}</span>
                </button>
                
                {/* Dropdown */}
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-nike-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <div className="py-2">
                    <Link to="/profile" className="block px-4 py-2 text-sm text-nike-gray-700 hover:bg-nike-gray-100">
                      Profile
                    </Link>
                    <Link to="/orders" className="block px-4 py-2 text-sm text-nike-gray-700 hover:bg-nike-gray-100">
                      Orders
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-nike-gray-700 hover:bg-nike-gray-100"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link to="/login" className="text-nike-gray-700 hover:text-nike-black font-medium">
                  Login
                </Link>
                <Link to="/register" className="btn-primary text-sm">
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-nike-gray-700 hover:text-nike-black"
            >
              {isMenuOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-nike-gray-200 py-4">
            <div className="flex flex-col space-y-4">
              {/* Mobile Search */}
              <form onSubmit={handleSearch} className="flex items-center bg-nike-gray-100 rounded-full px-4 py-2">
                <MagnifyingGlassIcon className="h-4 w-4 text-nike-gray-500 mr-2" />
                <input
                  type="text"
                  placeholder="Search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent border-none focus:outline-none text-sm flex-1"
                />
              </form>
              
              {/* Mobile Nav Links */}
              <div className="flex flex-col space-y-2">
                <Link to="/products" className="text-nike-gray-700 hover:text-nike-black font-medium py-2">
                  All Products
                </Link>
                <Link to="/products?category_id=1" className="text-nike-gray-700 hover:text-nike-black font-medium py-2">
                  Basketball
                </Link>
                <Link to="/products?category_id=2" className="text-nike-gray-700 hover:text-nike-black font-medium py-2">
                  Running
                </Link>
                <Link to="/products?category_id=3" className="text-nike-gray-700 hover:text-nike-black font-medium py-2">
                  Lifestyle
                </Link>
                <Link to="/products?is_featured=true" className="text-nike-red hover:text-nike-orange font-medium py-2">
                  Sale
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar