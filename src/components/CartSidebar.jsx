import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import useCart from '../hooks/useCart';
import { formatPrice } from '../utils/currency';

export default function CartSidebar({ isOpen, onClose }) {
  const { cartItems, removeFromCart, updateCartQuantity, getCartTotal } = useCart();
  const navigate = useNavigate();

  const handleCheckout = () => {
    onClose();
    navigate('/checkout');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex justify-end font-body">
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-on-background/40 backdrop-blur-sm cursor-pointer"
          />

          {/* Cart Sidebar */}
          <motion.aside 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="relative w-full max-w-md bg-primary-container border-l-[5px] border-on-background h-[100dvh] flex flex-col shadow-[-12px_0px_0px_0px_rgba(44,47,48,0.1)]"
          >
            {/* Header */}
            <div className="p-8 flex justify-between items-center border-b-[5px] border-on-background bg-white">
              <h2 className="font-headline font-black text-3xl uppercase tracking-tighter italic text-on-background">YOUR HAUL</h2>
              <button 
                onClick={onClose}
                className="w-12 h-12 flex items-center justify-center rounded-full border-[4px] border-on-background bg-secondary-container hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-none transition-all neo-shadow active:scale-90"
              >
                <span className="material-symbols-outlined font-black text-on-background">close</span>
              </button>
            </div>

            {/* Items List */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {cartItems.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center opacity-70">
                  <span className="material-symbols-outlined text-6xl mb-4">shopping_cart_checkout</span>
                  <p className="font-headline font-black text-2xl uppercase">HAUL IS EMPTY</p>
                  <p className="font-bold">Drop some gear in here!</p>
                </div>
              ) : (
                cartItems.map(item => (
                  <div key={item.productId} className="bg-white border-[4px] border-on-background rounded-xl p-4 flex gap-4 neo-shadow relative overflow-hidden group">
                    <div className="w-24 h-24 flex-shrink-0 border-[4px] border-on-background rounded-lg bg-surface-container overflow-hidden">
                      <img src={item.image} alt={item.title} className="w-full h-full object-contain p-2 group-hover:scale-110 transition-transform" />
                    </div>

                    <div className="flex flex-col justify-between py-1 flex-1 min-w-0">
                      <div>
                        <h3 className="font-headline font-extrabold text-lg uppercase leading-none mb-1 text-on-background line-clamp-1" title={item.title}>
                          {item.title}
                        </h3>
                        <p className="text-xs font-bold text-on-surface-variant uppercase truncate">{item.category}</p>
                      </div>

                      <div className="flex justify-between items-end">
                        <span className="font-headline font-black text-xl tracking-tight text-on-background">{formatPrice(item.price)}</span>
                        
                        <div className="flex items-center gap-2 bg-surface-container-low border-2 border-on-background rounded-full p-1">
                          <button 
                            onClick={() => updateCartQuantity(item.productId, item.quantity - 1)}
                            className="w-7 h-7 rounded-full border-2 border-on-background bg-white flex items-center justify-center active:scale-90 transition-transform hover:bg-surface-container"
                          >
                            <span className="material-symbols-outlined text-[16px] font-black text-on-background">remove</span>
                          </button>
                          <span className="font-black px-2 text-sm text-on-background">{item.quantity}</span>
                          <button 
                            onClick={() => updateCartQuantity(item.productId, item.quantity + 1)}
                            className="w-7 h-7 rounded-full border-2 border-on-background bg-white flex items-center justify-center active:scale-90 transition-transform hover:bg-surface-container"
                          >
                            <span className="material-symbols-outlined text-[16px] font-black text-on-background">add</span>
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    {/* Delete overlay button on hover */}
                    <button 
                      onClick={() => removeFromCart(item.productId)}
                      className="absolute top-2 right-2 w-8 h-8 bg-error text-white rounded-full border-2 border-on-background flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity active:scale-90"
                    >
                      <span className="material-symbols-outlined text-[16px]">delete</span>
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Footer / Checkout Area */}
            {cartItems.length > 0 && (
              <div className="p-8 bg-white border-t-[5px] border-on-background space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-on-surface-variant font-bold uppercase text-sm">
                    <span>SUBTOTAL</span>
                    <span>{formatPrice(getCartTotal())}</span>
                  </div>
                  <div className="flex justify-between items-center text-on-surface-variant font-bold uppercase text-sm">
                    <span>SHIPPING</span>
                    <span>$0.00</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-headline font-black text-2xl uppercase italic text-on-background">TOTAL</span>
                    <span className="font-headline font-black text-4xl tracking-tighter text-on-background">{formatPrice(getCartTotal())}</span>
                  </div>
                </div>

                <button 
                  onClick={handleCheckout}
                  className="w-full bg-tertiary-fixed border-[4px] border-on-background py-6 rounded-full font-headline font-black text-2xl uppercase tracking-widest text-on-background neo-shadow-lg hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all active:scale-95 group overflow-hidden relative"
                >
                  <span className="relative z-10 flex items-center justify-center gap-3">
                    CHECKOUT
                    <span className="material-symbols-outlined font-black group-hover:translate-x-2 transition-transform">arrow_forward</span>
                  </span>
                  <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover:translate-x-0 transition-transform duration-500 skew-x-12"></div>
                </button>

                <p className="text-center font-bold text-xs text-on-surface-variant uppercase tracking-widest">
                  Free shipping applied to your haul!
                </p>
              </div>
            )}
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}
