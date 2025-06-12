import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { productsApi } from '../services/api'
import ProductCard from '../components/ProductCard'
import LoadingSpinner from '../components/LoadingSpinner'
import { Category } from '../types'

const ProductsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [selectedCategory, setSelectedCategory] = useState<number | undefined>(
    searchParams.get('category_id') ? parseInt(searchParams.get('category_id')!) : undefined
  )
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '')
  const [isFeatured, setIsFeatured] = useState(searchParams.get('is_featured') === 'true')
  const [priceRange, setPriceRange] = useState({ min: '', max: '' })
  const [currentPage, setCurrentPage] = useState(1)

  // Fetch categories
  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: productsApi.getCategories
  })

  // Fetch products
  const { data: productsData, isLoading } = useQuery({
    queryKey: ['products', selectedCategory, searchQuery, isFeatured, priceRange, currentPage],
    queryFn: () => productsApi.getProducts({
      page: currentPage,
      per_page: 20,
      category_id: selectedCategory,
      search: searchQuery || undefined,
      is_featured: isFeatured || undefined,
      min_price: priceRange.min ? parseFloat(priceRange.min) : undefined,
      max_price: priceRange.max ? parseFloat(priceRange.max) : undefined,
    })
  })

  // Update URL params when filters change
  useEffect(() => {
    const params = new URLSearchParams()
    if (selectedCategory) params.set('category_id', selectedCategory.toString())
    if (searchQuery) params.set('search', searchQuery)
    if (isFeatured) params.set('is_featured', 'true')
    if (priceRange.min) params.set('min_price', priceRange.min)
    if (priceRange.max) params.set('max_price', priceRange.max)
    if (currentPage > 1) params.set('page', currentPage.toString())
    
    setSearchParams(params)
  }, [selectedCategory, searchQuery, isFeatured, priceRange, currentPage, setSearchParams])

  const handleCategoryChange = (categoryId: number | undefined) => {
    setSelectedCategory(categoryId)
    setCurrentPage(1)
  }

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    setCurrentPage(1)
  }

  const handlePriceFilter = () => {
    setCurrentPage(1)
  }

  const clearFilters = () => {
    setSelectedCategory(undefined)
    setSearchQuery('')
    setIsFeatured(false)
    setPriceRange({ min: '', max: '' })
    setCurrentPage(1)
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-nike-black mb-4">
            {searchQuery ? `Search Results for "${searchQuery}"` : 'All Products'}
          </h1>
          <p className="text-nike-gray-600">
            {productsData ? `${productsData.total} products found` : 'Loading...'}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <div className="card p-6 sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold">Filters</h3>
                <button
                  onClick={clearFilters}
                  className="text-sm text-nike-red hover:text-nike-orange"
                >
                  Clear All
                </button>
              </div>

              {/* Search */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-nike-gray-700 mb-2">
                  Search
                </label>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  placeholder="Search products..."
                  className="input-field"
                />
              </div>

              {/* Categories */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-nike-gray-700 mb-2">
                  Category
                </label>
                <div className="space-y-2">
                  <button
                    onClick={() => handleCategoryChange(undefined)}
                    className={`block w-full text-left px-3 py-2 rounded-lg text-sm ${
                      !selectedCategory 
                        ? 'bg-nike-black text-white' 
                        : 'text-nike-gray-700 hover:bg-nike-gray-100'
                    }`}
                  >
                    All Categories
                  </button>
                  {categories?.map((category: Category) => (
                    <button
                      key={category.id}
                      onClick={() => handleCategoryChange(category.id)}
                      className={`block w-full text-left px-3 py-2 rounded-lg text-sm ${
                        selectedCategory === category.id 
                          ? 'bg-nike-black text-white' 
                          : 'text-nike-gray-700 hover:bg-nike-gray-100'
                      }`}
                    >
                      {category.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Featured */}
              <div className="mb-6">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={isFeatured}
                    onChange={(e) => setIsFeatured(e.target.checked)}
                    className="mr-2"
                  />
                  <span className="text-sm text-nike-gray-700">Featured Products Only</span>
                </label>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-nike-gray-700 mb-2">
                  Price Range
                </label>
                <div className="flex space-x-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={priceRange.min}
                    onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
                    className="input-field text-sm"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={priceRange.max}
                    onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
                    className="input-field text-sm"
                  />
                </div>
                <button
                  onClick={handlePriceFilter}
                  className="mt-2 w-full btn-primary text-sm py-2"
                >
                  Apply
                </button>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            {isLoading ? (
              <div className="flex justify-center py-12">
                <LoadingSpinner size="lg" />
              </div>
            ) : productsData?.products.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-nike-gray-600 text-lg">No products found matching your criteria.</p>
                <button
                  onClick={clearFilters}
                  className="mt-4 btn-primary"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {productsData?.products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>

                {/* Pagination */}
                {productsData && productsData.pages > 1 && (
                  <div className="flex justify-center mt-12">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                        disabled={currentPage === 1}
                        className="px-4 py-2 border border-nike-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-nike-gray-100"
                      >
                        Previous
                      </button>
                      
                      {Array.from({ length: productsData.pages }, (_, i) => i + 1).map((page) => (
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
                        onClick={() => setCurrentPage(prev => Math.min(productsData.pages, prev + 1))}
                        disabled={currentPage === productsData.pages}
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
      </div>
    </div>
  )
}

export default ProductsPage