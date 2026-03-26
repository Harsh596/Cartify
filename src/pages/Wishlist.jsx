import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import useWishlist from '../hooks/useWishlist';
import api from '../services/api';
import ProductCard from '../components/ProductCard';

export default function Wishlist() {
  const { wishlistItems } = useWishlist();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWishlistProducts = async () => {
      setLoading(true);
      try {
        const allProducts = await api.getProducts();
        const wishlisted = allProducts.filter(p => 
          wishlistItems.some(w => w.productId === p.id)
        );
        setProducts(wishlisted);
      } catch (err) {
        console.error("Failed to load wishlist products", err);
      } finally {
        setLoading(false);
      }
    };

    if (wishlistItems.length > 0) {
      fetchWishlistProducts();
    } else {
      setProducts([]);
      setLoading(false);
    }
  }, [wishlistItems]);

  if (loading) {
    return <div className="py-32 text-center text-secondary font-label tracking-widest uppercase">Synchronizing Wishlist...</div>;
  }

  if (products.length === 0) {
    return (
      <div className="w-full min-h-[60vh] flex flex-col justify-center items-center py-24 text-center px-6">
        <h2 className="text-3xl font-black tracking-tighter uppercase mb-4">No Saved Assets</h2>
        <p className="text-secondary font-label tracking-widest text-sm mb-8">YOUR WISHLIST IS CURRENTLY EMPTY.</p>
        <Link to="/products" className="bg-[#1c1b1b] border border-outline-variant/30 text-[#FAFAFA] font-label text-xs tracking-widest uppercase px-8 py-4 hover:border-[#00E5FF] hover:text-[#00E5FF] transition-all">
          EXPLORE ARCHIVE
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full px-6 md:px-12 py-12 max-w-[1600px] mx-auto min-h-screen">
      <div className="mb-16 border-b border-outline-variant/20 pb-8">
        <h2 className="text-[clamp(2.5rem,4vw,3.5rem)] font-black tracking-tighter uppercase mb-2">Saved Operations</h2>
        <p className="text-[#00E5FF] font-label tracking-widest text-sm uppercase">[{products.length}] ASSETS TRACKED</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
        {products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
