import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import useCart from '../hooks/useCart';
import useWishlist from '../hooks/useWishlist';
import logo from '../assets/logof.svg';

function Navbar({ onOpenCart }) {
  const { getCartCount } = useCart();
  const { wishlistItems } = useWishlist();
  const location = useLocation();
  const navigate = useNavigate();
  const [navSearch, setNavSearch] = useState('');

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (navSearch.trim()) {
      navigate(`/products?q=${encodeURIComponent(navSearch.trim())}`);
      setNavSearch('');
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="w-full border-b-[5px] border-on-background sticky top-0 z-40 bg-white shadow-[4px_4px_0px_0px_rgba(44,47,48,1)]">
      <div className="flex justify-between items-center px-6 py-4 w-full mx-auto max-w-[1440px]">
        
        <Link to="/" className="flex items-center gap-3 hover:scale-105 hover:-rotate-1 transition-transform group">
            <img src={logo} alt="" className="h-10 w-auto" />
            <span className="text-3xl font-black italic tracking-tighter text-on-background underline decoration-primary-container decoration-4 font-headline uppercase">
                CARTIFY
            </span>
        </Link>
        
        <nav className="hidden md:flex gap-8 items-center font-headline font-black uppercase tracking-tighter">
          <Link to="/" className={`pb-1 hover:scale-105 hover:-rotate-1 transition-transform cursor-pointer ${isActive('/') ? 'text-on-background border-b-4 border-primary-container' : 'text-on-background opacity-70 hover:opacity-100'}`}>HOME</Link>
          <Link to="/products" className={`pb-1 hover:scale-105 hover:-rotate-1 transition-transform cursor-pointer ${isActive('/products') ? 'text-on-background border-b-4 border-primary-container' : 'text-on-background opacity-70 hover:opacity-100'}`}>SHOP</Link>
          <Link to="/wishlist" className={`pb-1 hover:scale-105 hover:-rotate-1 transition-transform cursor-pointer flex items-center gap-1 ${isActive('/wishlist') ? 'text-on-background border-b-4 border-primary-container' : 'text-on-background opacity-70 hover:opacity-100'}`}>
            VAULT
            {wishlistItems.length > 0 && <span className="ml-1 text-xs text-secondary bg-secondary-container px-2 py-0.5 rounded-full border-2 border-on-background">{wishlistItems.length}</span>}
          </Link>
        </nav>
        
        <div className="flex items-center gap-4">
          <form onSubmit={handleSearchSubmit} className="hidden lg:flex items-center bg-surface-container-low border-[3px] border-on-background rounded-full px-4 py-1 hover:bg-surface-container transition-all duration-300 w-36 focus-within:w-64 focus-within:bg-white group outline-none overflow-hidden cursor-text">
            <span className="material-symbols-outlined text-on-background group-focus-within:text-secondary transition-colors">search</span>
            <input 
              type="text" 
              placeholder="SEARCH..." 
              value={navSearch}
              onChange={(e) => setNavSearch(e.target.value)}
              className="bg-transparent border-none font-bold text-sm text-on-surface-variant group-focus-within:text-on-background ml-2 uppercase w-full outline-none focus:ring-0 placeholder:text-on-surface-variant transition-colors"
            />
          </form>
          
          <button onClick={onOpenCart} className="relative hover:scale-105 hover:-rotate-1 transition-transform cursor-pointer p-2 bg-primary-container border-[3px] border-on-background rounded-full flex items-center justify-center neo-shadow squishy-active">
            <span className="material-symbols-outlined text-on-background" data-icon="shopping_cart">shopping_cart</span>
            {getCartCount() > 0 && (
              <span className="absolute -top-2 -right-2 flex items-center justify-center w-5 h-5 text-[10px] bg-secondary text-white font-black rounded-full border-2 border-on-background animate-pulse">
                {getCartCount()}
              </span>
            )}
          </button>
        </div>
        
      </div>
    </header>
  )
}

export default Navbar;