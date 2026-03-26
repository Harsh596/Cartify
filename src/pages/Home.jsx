import { useState } from 'react';
import { toast } from 'react-toastify';
import ProductGrid from '../components/ProductGrid';
import useProducts from '../hooks/useProducts';

export default function Home() {
  const [limit, setLimit] = useState(8);
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(() => localStorage.getItem('cartify_subscribed') === 'true');
  const [isPromoUsed, setIsPromoUsed] = useState(() => localStorage.getItem('cartify_promo_used') === 'true');
  const { products, loading, error } = useProducts(null, limit); // Display products based on limit

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setIsSubscribed(true);
      localStorage.setItem('cartify_subscribed', 'true');
      toast.success("WELCOME TO THE CLUB! USE CODE: CARTIFY20 FOR 20% OFF.", {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "dark",
      });
    }
  };

  return (
    <div className="w-full flex flex-col gap-20 py-12">
      
      {/* Hero Section */}
      <section className="relative w-full">
        <div className="bg-gradient-to-r from-primary-dim to-primary-container p-12 rounded-xl border-[5px] border-on-background shadow-[8px_8px_0px_0px_rgba(44,47,48,1)] sticker-rotate-1">
            <h1 className="text-6xl md:text-8xl font-headline font-black uppercase tracking-tighter text-on-background leading-none mb-4">
                NEW ARRIVALS<br/><span className="text-white drop-shadow-[4px_4px_0px_#2c2f30]">VOL. 04</span>
            </h1>
            <p className="text-xl font-bold uppercase tracking-tight text-on-background max-w-xl">
                Saturated styles for a desaturated world. Limited run drops available now.
            </p>
        </div>
        
        {/* Decorative Badge */}
        <div className="absolute -top-6 -right-6 bg-tertiary-fixed p-6 rounded-full border-[3px] border-on-background shadow-[4px_4px_0px_0px_rgba(44,47,48,1)] sticker-rotate-2 hidden lg:flex items-center justify-center">
            <span className="font-headline font-black text-2xl uppercase italic text-on-background">Hot Drop!</span>
        </div>
      </section>

      {/* Product Grid Section */}
      <section className="w-full space-y-12">
        <div className="flex flex-col md:flex-row justify-between items-end gap-6">
            <h2 className="text-4xl md:text-5xl font-black font-headline uppercase tracking-tighter text-on-background">The Collection</h2>
            <div className="flex gap-4 flex-wrap">
                <button className="bg-primary-container text-on-background border-[3px] border-on-background rounded-full px-6 py-2 font-black uppercase shadow-[4px_4px_0px_0px_rgba(44,47,48,1)] hover:translate-y-[-2px] transition-transform">All Gear</button>
                <button className="bg-white text-on-background border-[3px] border-on-background rounded-full px-6 py-2 font-black uppercase hover:bg-secondary-container transition-colors">Apparel</button>
                <button className="bg-white text-on-background border-[3px] border-on-background rounded-full px-6 py-2 font-black uppercase hover:bg-tertiary-container transition-colors">Jewelry</button>
            </div>
        </div>
        
        <ProductGrid products={products} loading={loading} error={error} />
        
        {products && products.length >= limit && (
          <div className="flex justify-center mt-12">
              <button 
                onClick={() => setLimit(l => l + 8)}
                className="px-12 py-6 bg-secondary text-white font-headline font-black uppercase text-2xl rounded-xl border-[5px] border-on-background shadow-[10px_10px_0px_0px_rgba(44,47,48,1)] hover:scale-105 active:scale-95 transition-all">
                  Load More Drops
              </button>
          </div>
        )}
      </section>

      {/* Dynamic Sticker Section */}
      <section className="py-12 bg-white rounded-xl border-[5px] border-on-background relative overflow-hidden shadow-[8px_8px_0px_0px_rgba(44,47,48,1)]">
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-primary-container rounded-full border-[4px] border-on-background rotate-12 flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(44,47,48,1)]">
            <span className="text-on-background font-black text-center text-sm uppercase leading-tight">JOIN THE<br/>CLUB NOW</span>
        </div>
        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-tertiary-container rounded-full border-[4px] border-on-background -rotate-12 flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(44,47,48,1)]">
            <span className="text-on-background font-black text-center text-sm uppercase leading-tight">100%<br/>CARTIFY</span>
        </div>
        <div className="max-w-2xl mx-auto text-center px-6 relative z-10">
            <h2 className="text-4xl md:text-5xl font-black font-headline uppercase mb-6 tracking-tighter text-on-background">Stay in the Loop?</h2>
            {isPromoUsed ? (
              <div className="bg-surface-container border-[4px] border-on-background rounded-2xl p-8 shadow-[8px_8px_0px_0px_rgba(44,47,48,1)]">
                <p className="text-2xl font-black text-on-background uppercase mb-2">OFFER REDEEMED</p>
                <p className="text-lg font-bold text-on-background uppercase tracking-tight">You've already used your one-time discount. Stay tuned for future secret drops!</p>
              </div>
            ) : isSubscribed ? (
              <div className="bg-primary-container border-[4px] border-on-background rounded-2xl p-8 shadow-[8px_8px_0px_0px_rgba(44,47,48,1)] animate-bounce">
                <p className="text-2xl font-black text-on-background uppercase mb-2">YOU'RE IN!</p>
                <p className="text-lg font-bold text-on-background uppercase">USE CODE <span className="bg-white px-3 py-1 rounded-lg border-2 border-on-background">CARTIFY20</span> AT CHECKOUT</p>
              </div>
            ) : (
              <>
                <p className="text-xl font-bold mb-8 text-on-background">Drop your email to get 20% off your first haul and early access to secret drops.</p>
                <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-4">
                    <input 
                      type="email" 
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="YOUR@VIBE.COM" 
                      className="flex-grow bg-white border-[4px] border-on-background rounded-full px-6 py-4 font-black uppercase placeholder:text-on-background/50 focus:scale-[1.02] focus:ring-secondary transition-transform text-on-background" 
                    />
                    <button type="submit" className="bg-secondary text-white border-[4px] border-on-background rounded-full px-10 py-4 font-black uppercase hover:bg-secondary-dim transition-all neo-shadow squishy-active">Unlock Pop</button>
                </form>
              </>
            )}
        </div>
      </section>
      
    </div>
  )
}
