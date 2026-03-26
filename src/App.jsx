import { lazy, Suspense, useState, useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { motion, AnimatePresence } from 'framer-motion'

import Navbar from './components/Navbar'
import Footer from './components/Footer'
import CartSidebar from './components/CartSidebar'

const Home = lazy(() => import('./pages/Home'))
const Products = lazy(() => import('./pages/Products'))
const ProductDetails = lazy(() => import('./pages/ProductDetails'))
const Cart = lazy(() => import('./pages/Cart'))
const Wishlist = lazy(() => import('./pages/Wishlist'))
const Checkout = lazy(() => import('./pages/Checkout'))
const OrderConfirmed = lazy(() => import('./pages/OrderConfirmed'))

function App() {
  const location = useLocation();
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Prevent scroll when cart is open
  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    }
  }, [isCartOpen]);

  return (
    <div className="flex flex-col min-h-screen">
      <ToastContainer 
        position="bottom-right" 
        autoClose={3000} 
        theme="colored"
        toastStyle={{ 
          background: '#fdd400', 
          color: '#2c2f30', 
          border: '4px solid #2c2f30', 
          borderRadius: '1rem',
          boxShadow: '4px 4px 0px 0px rgba(44,47,48,1)',
          fontFamily: 'Spline Sans',
          fontWeight: 800,
          textTransform: 'uppercase'
        }}
        progressStyle={{ background: '#b60055' }}
      />
      
      <Navbar onOpenCart={() => setIsCartOpen(true)} /> 

      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

      <main className="flex-1 w-full mx-auto max-w-[1440px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            style={{ width: '100%' }}
          >
            <Suspense fallback={<div className="text-center p-12 text-primary font-headline font-black uppercase text-2xl tracking-widest">LOADING...</div>}>
              <Routes location={location} key={location.pathname}>
                <Route path="/" element={<Home />} />
                <Route path="/products" element={<Products />} />
                <Route path="/products/:id" element={<ProductDetails />} />
                <Route path="/wishlist" element={<Wishlist />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/order-confirmed" element={<OrderConfirmed />} />
              </Routes>
            </Suspense>
          </motion.div>
        </AnimatePresence>
      </main>

      <Footer />
    </div>
  )
}

export default App