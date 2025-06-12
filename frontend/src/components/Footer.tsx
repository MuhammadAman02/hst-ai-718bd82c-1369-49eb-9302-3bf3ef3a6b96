import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <footer className="bg-nike-black text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-2xl font-black mb-4">NIKE</h3>
            <p className="text-nike-gray-300">
              Just Do It. Find your perfect pair of Nike shoes and unleash your potential.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Products</h4>
            <ul className="space-y-2 text-nike-gray-300">
              <li><Link to="/products?category_id=1" className="hover:text-white">Basketball</Link></li>
              <li><Link to="/products?category_id=2" className="hover:text-white">Running</Link></li>
              <li><Link to="/products?category_id=3" className="hover:text-white">Lifestyle</Link></li>
              <li><Link to="/products?is_featured=true" className="hover:text-white">Sale</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-nike-gray-300">
              <li><a href="#" className="hover:text-white">Size Guide</a></li>
              <li><a href="#" className="hover:text-white">Returns</a></li>
              <li><a href="#" className="hover:text-white">Shipping</a></li>
              <li><a href="#" className="hover:text-white">Contact</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-nike-gray-300">
              <li><a href="#" className="hover:text-white">About Nike</a></li>
              <li><a href="#" className="hover:text-white">News</a></li>
              <li><a href="#" className="hover:text-white">Careers</a></li>
              <li><a href="#" className="hover:text-white">Investors</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-nike-gray-800 mt-12 pt-8 text-center text-nike-gray-400">
          <p>&copy; 2024 Nike, Inc. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer