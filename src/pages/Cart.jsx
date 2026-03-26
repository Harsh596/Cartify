import { Link } from 'react-router-dom';
import useCart from '../hooks/useCart';
import { formatPrice } from '../utils/currency';

export default function Cart() {
  // We only need the Context! No API calls needed.
  const { cartItems, updateCartQuantity, removeFromCart, getCartTotal, clearCart } = useCart();

  if (cartItems.length === 0) {
    return (
      <div className="w-full min-h-[60vh] flex flex-col justify-center items-center py-24 text-center px-6">
        <h2 className="text-3xl font-black tracking-tighter uppercase mb-4 text-[#FAFAFA]">Cart Logic Empty</h2>
        <p className="text-secondary font-label tracking-widest text-sm mb-8">NO ASSETS DETECTED IN CURRENT TRANSACTION CYCLE.</p>
        <Link to="/products" className="bg-[#1c1b1b] border border-outline-variant/30 text-[#FAFAFA] font-label text-xs tracking-widest uppercase px-8 py-4 hover:border-[#00E5FF] hover:text-[#00E5FF] transition-all">
          RESUME OPERATION
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full px-6 md:px-12 py-12 max-w-[1400px] mx-auto min-h-screen">
      <div className="flex flex-col md:flex-row justify-between md:items-end border-b border-outline-variant/20 pb-8 mb-12 gap-6">
        <div>
          <h2 className="text-[clamp(2.5rem,4vw,3.5rem)] font-black tracking-tighter uppercase mb-2 text-[#FAFAFA]">Transaction Ledger</h2>
          <p className="text-[#00E5FF] font-label tracking-widest text-sm uppercase">[{cartItems.length}] ASSETS PENDING</p>
        </div>
        <button onClick={clearCart} className="text-error hover:text-white transition-colors font-label tracking-widest text-xs uppercase mb-2 text-left md:text-right border-b border-transparent hover:border-white w-fit">
          CLEAR LEDGER
        </button>
      </div>

      <div className="flex flex-col gap-6">
        {cartItems.map(item => {
          // We just grab the name and image directly from the item now! W architecture.
          const productName = item.name || `Asset Classification: ${item.productId}`;
          const productImage = item.image || null;

          return (
            <div key={item.productId} className="flex flex-col md:flex-row items-start md:items-center justify-between p-6 md:p-8 bg-[#1c1b1b] border border-outline-variant/20 hover:border-[#00E5FF]/40 transition-colors">
              
              <div className="flex items-center gap-6 flex-1 w-full md:w-auto mb-8 md:mb-0">
                {productImage && (
                  <div className="w-20 h-20 bg-white p-2 shrink-0">
                    <img src={productImage} alt={productName} className="w-full h-full object-contain mix-blend-multiply" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  {/* line-clamp prevents massive titles from breaking the layout */}
                  <h3 className="text-lg font-bold tracking-tight uppercase text-[#FAFAFA] line-clamp-2">
                    {productName}
                  </h3>
                  <div className="text-[#00E5FF] font-label text-xs tracking-widest uppercase mt-2">{formatPrice(item.price)} / UNIT</div>
                </div>
              </div>
              
              <div className="flex items-center gap-6 md:gap-12 w-full md:w-auto justify-between md:justify-end shrink-0">
                <div className="flex items-center border border-outline-variant/30">
                  <button onClick={() => updateCartQuantity(item.productId, item.quantity - 1)} className="px-4 py-2 text-secondary hover:text-white hover:bg-white/5 transition-colors">-</button>
                  <span className="px-4 font-label text-[#FAFAFA]">{item.quantity}</span>
                  <button onClick={() => updateCartQuantity(item.productId, item.quantity + 1)} className="px-4 py-2 text-secondary hover:text-white hover:bg-white/5 transition-colors">+</button>
                </div>
                
                <div className="font-bold text-xl text-[#FAFAFA] w-32 text-right">
                  {formatPrice(item.price * item.quantity)}
                </div>
                
                <button onClick={() => removeFromCart(item.productId)} className="text-secondary hover:text-error transition-colors p-2 flex items-center justify-center" aria-label="Remove item">
                  <span className="material-symbols-outlined">delete</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-12 p-8 md:p-12 border border-outline-variant/30 flex flex-col items-end bg-[#1a1a1a]">
        <div className="font-label tracking-widest text-secondary text-xs uppercase mb-2">Calculated Logistics Totals</div>
        <div className="text-5xl md:text-6xl font-black text-[#FAFAFA] mb-10">
          {formatPrice(getCartTotal())}
        </div>
        <div className="flex gap-4 w-full sm:w-auto flex-col sm:flex-row">
          <Link to="/products" className="px-8 py-4 border border-outline-variant/30 text-secondary hover:text-white hover:border-white transition-colors font-label tracking-widest text-xs uppercase text-center flex items-center justify-center gap-2">
            <span className="material-symbols-outlined text-[16px]">arrow_back</span> CONTINUE SEARCH
          </Link>
          <Link to="/checkout" className="px-10 py-4 bg-[#00E5FF] text-[#001f24] hover:bg-white transition-colors font-black tracking-widest text-[13px] uppercase text-center">
            INITIATE CHECKOUT
          </Link>
        </div>
      </div>
    </div>
  );
}