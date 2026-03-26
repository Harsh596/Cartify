import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import useCart from '../hooks/useCart';
import useWishlist from '../hooks/useWishlist';
import { formatPrice } from '../utils/currency';

export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const data = await api.getProductById(id);
        setProduct(data);
        setError(null);
      } catch (err) {
        setError(err.message || 'Failed to fetch product details.');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) return <div className="py-32 text-center text-on-background font-headline font-black tracking-widest uppercase text-3xl">PULLING FILE...</div>;
  if (error) return <div className="py-32 text-center text-error font-headline font-black tracking-widest uppercase text-3xl">{error}</div>;
  if (!product) return <div className="py-32 text-center text-on-background font-headline font-black tracking-widest uppercase text-3xl">DROP NOT FOUND.</div>;

  const inWishlist = isInWishlist(product.id);

  return (
    <div className="w-full px-6 py-12 max-w-[1440px] mx-auto min-h-screen">
      <Link to="/products" className="inline-flex items-center gap-2 mb-12 text-on-background hover:text-secondary font-headline font-black tracking-widest text-sm uppercase transition-colors bg-white border-[3px] border-on-background px-6 py-2 rounded-full shadow-[4px_4px_0px_0px_rgba(44,47,48,1)] hover:translate-y-[-2px]">
        <span className="material-symbols-outlined text-[18px]">arrow_back</span> BACK TO VAULT
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
        {/* Product Image Side */}
        <div className="relative group mx-auto w-full max-w-xl">
          <div className="absolute -inset-4 bg-tertiary-fixed rounded-xl border-[4px] border-on-background -rotate-2 z-0"></div>
          <div className="relative bg-white border-[4px] border-on-background rounded-xl p-8 shadow-[12px_12px_0px_0px_rgba(44,47,48,1)] overflow-hidden">
            <img 
              src={product.image} 
              alt={product.title} 
              className="w-full h-[400px] md:h-[500px] object-contain p-4 transform group-hover:scale-105 transition-transform duration-500" 
            />
            <div className="absolute top-6 left-6 bg-primary-container text-on-background border-[3px] border-on-background px-4 py-1 rounded-full font-black text-sm uppercase -rotate-12 shadow-[4px_4px_0px_0px_rgba(44,47,48,1)]">
              Verified
            </div>
            {product.rating?.rate > 4 && (
              <div className="absolute bottom-6 right-6 bg-error-container text-on-error border-[3px] border-on-background px-4 py-1 rounded-full font-black text-sm uppercase rotate-6 shadow-[4px_4px_0px_0px_rgba(44,47,48,1)]">
                Hot Pick
              </div>
            )}
          </div>
        </div>

        {/* Product Details Side */}
        <div className="flex flex-col gap-6">
          <div>
            <span className="bg-secondary text-white px-4 py-2 rounded-md border-[3px] border-on-background font-black text-xs uppercase tracking-widest mb-4 inline-block shadow-[4px_4px_0px_0px_rgba(44,47,48,1)] -rotate-1">
              {product.category}
            </span>
            <h1 className="text-5xl md:text-7xl font-black text-on-background font-headline leading-none uppercase tracking-tighter">
              {product.title}
            </h1>
          </div>
          
          <div className="flex items-center gap-6 mt-2">
            <span className="text-5xl font-black text-secondary font-headline tracking-tighter">{formatPrice(product.price)}</span>
            <div className="flex flex-col">
              
              {/* --- FIX APPLIED HERE: Shadow isolated to the star, items-center added --- */}
              <div className="flex items-center gap-1 text-primary-container">
                <span className="material-symbols-outlined drop-shadow-[2px_2px_0px_#2c2f30]" style={{fontVariationSettings: "'FILL' 1"}}>star</span>
                <span className="font-black text-xl text-on-background">{product.rating?.rate}</span>
              </div>
              {/* --------------------------------------------------------------------- */}
              
              <span className="font-bold text-on-surface-variant text-sm uppercase tracking-widest">
                ({product.rating?.count} Reviews)
              </span>
            </div>
          </div>

          <p className="text-lg font-medium leading-relaxed max-w-xl text-on-background border-l-[4px] border-primary-container pl-6 py-2 my-2 bg-white/50 rounded-r-xl">
            {product.description}
          </p>

          <div className="grid grid-cols-2 gap-4 my-2">
            <div className="bg-white border-[3px] border-on-background p-4 rounded-xl flex flex-col items-center justify-center text-center shadow-[4px_4px_0px_0px_rgba(44,47,48,1)]">
              <span className="material-symbols-outlined mb-2 text-3xl text-secondary">verified</span>
              <span className="text-xs font-black uppercase mb-1">Authenticity</span>
              <span className="font-bold">Guaranteed</span>
            </div>
            <div className="bg-white border-[3px] border-on-background p-4 rounded-xl flex flex-col items-center justify-center text-center shadow-[4px_4px_0px_0px_rgba(44,47,48,1)]">
              <span className="material-symbols-outlined mb-2 text-3xl text-tertiary">local_shipping</span>
              <span className="text-xs font-black uppercase mb-1">Shipping</span>
              <span className="font-bold">Next Day Pop</span>
            </div>
          </div>

          <div className="flex flex-col gap-4 mt-6">
            <button 
              onClick={() => addToCart(product)}
              className="group relative w-full h-20 bg-primary-container border-[4px] border-on-background rounded-full shadow-[8px_8px_0px_0px_rgba(44,47,48,1)] hover:shadow-[4px_4px_0px_0px_rgba(44,47,48,1)] hover:translate-x-1 hover:translate-y-1 transition-all active:scale-95 overflow-hidden"
            >
              <div className="relative z-10 flex items-center justify-center gap-4 h-full">
                <span className="text-2xl font-black font-headline uppercase tracking-widest text-on-background">ADD TO CART</span>
                <span className="material-symbols-outlined text-[28px] text-on-background group-hover:rotate-12 transition-transform">add_shopping_cart</span>
              </div>
              <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover:translate-x-0 transition-transform duration-500 skew-x-12"></div>
            </button>
            <button 
              onClick={() => toggleWishlist(product)}
              className={`w-full py-5 border-[4px] border-on-background rounded-full font-black font-headline text-xl uppercase tracking-widest transition-all squishy-active shadow-[4px_4px_0px_0px_rgba(44,47,48,1)] flex items-center justify-center gap-3 ${inWishlist ? 'bg-secondary text-white border-on-background' : 'bg-white text-on-background hover:bg-secondary-container'}`}
            >
              <span className="material-symbols-outlined" style={{fontVariationSettings: inWishlist ? "'FILL' 1" : "'FILL' 0"}}>{inWishlist ? 'favorite' : 'favorite_border'}</span>
              {inWishlist ? 'SAVED TO VAULT' : 'SAVE TO VAULT'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}