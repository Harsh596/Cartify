import { Link, useNavigate } from 'react-router-dom';
import useCart from '../hooks/useCart';
import useWishlist from '../hooks/useWishlist';
import { formatPrice } from '../utils/currency';

const ProductCard = ({ product, index = 0 }) => {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const isWishlisted = isInWishlist(product.id);
  const navigate = useNavigate();

  // Dynamic colors for neo-brutalism variations
  const colors = [
    'bg-primary-container',
    'bg-secondary-container',
    'bg-tertiary-container',
    'bg-white'
  ];
  
  const tags = [
    { text: 'SALE', bg: 'bg-error-container', textC: 'text-on-error', rotate: 'rotate-6' },
    { text: 'NEW', bg: 'bg-secondary', textC: 'text-white', rotate: '-rotate-3' },
    { text: 'HOT', bg: 'bg-tertiary-fixed', textC: 'text-on-tertiary-fixed', rotate: 'rotate-12' },
    { text: 'LIMITED', bg: 'bg-primary-fixed', textC: 'text-on-primary-fixed', rotate: 'rotate-2' },
  ];

  const bgColorClass = colors[index % colors.length];
  const tag = tags[index % tags.length];

  return (
    <div className={`card-bounce ${bgColorClass} border-[5px] border-on-background rounded-xl p-6 transition-all duration-150 relative flex flex-col group shadow-[8px_8px_0px_0px_rgba(44,47,48,1)] cursor-pointer`}>
      {/* Decorative Tag */}
      {index % 3 !== 0 && (
        <div className={`absolute top-4 right-4 ${tag.bg} ${tag.textC} border-[3px] border-on-background px-3 py-1 rounded-full font-black text-sm ${tag.rotate} z-10 shadow-[4px_4px_0px_0px_rgba(44,47,48,1)]`}>
          {tag.text}
        </div>
      )}

      {/* Image Container */}
      <div 
        className="bg-white border-[3px] border-on-background rounded-lg mb-6 overflow-hidden aspect-square relative group/img"
        onClick={() => navigate(`/products/${product.id}`)}
      >
        {/* Quick Wishlist Button */}
        <button 
          onClick={(e) => { e.stopPropagation(); toggleWishlist(product); }}
          className={`absolute top-3 left-3 z-20 p-2 rounded-full border-2 border-on-background transition-all shadow-[2px_2px_0px_0px_rgba(44,47,48,1)] active:scale-95 ${isWishlisted ? 'bg-error text-white scale-110' : 'bg-white text-on-background hover:scale-110'}`}
        >
          <span className={`material-symbols-outlined text-[18px] block ${isWishlisted ? 'font-fill' : ''}`}>
            favorite
          </span>
        </button>
        <img 
          src={product.image} 
          alt={product.title} 
          className="w-full h-full object-contain p-4 group-hover:scale-110 transition-transform duration-500 bg-white" 
        />
      </div>

      {/* Product Info */}
      <h3 
        className="text-2xl font-headline font-black uppercase tracking-tighter mb-1 leading-tight text-on-background line-clamp-2"
        onClick={() => navigate(`/products/${product.id}`)}
      >
        {product.title}
      </h3>
      <p className="text-on-background font-bold mb-2 opacity-80 uppercase text-xs tracking-widest line-clamp-1">
        {product.category}
      </p>

      {/* Rating Display */}
      <div className="flex items-center gap-1 mb-6">
          <div className="flex text-on-background">
              {[...Array(5)].map((_, i) => (
                  <span key={i} className={`material-symbols-outlined text-[16px] ${i < Math.floor(product.rating?.rate || 0) ? 'font-fill text-secondary' : 'text-on-background/30'}`}>
                      star
                  </span>
              ))}
          </div>
          <span className="text-[10px] font-black text-on-background bg-secondary-container px-2 py-0.5 rounded border border-on-background shadow-[2px_2px_0px_0px_rgba(44,47,48,1)]">
              {product.rating?.rate || 0} ({product.rating?.count || 0})
          </span>
      </div>

      {/* Action Area */}
      <div className="mt-auto flex justify-between items-center">
        <span className="text-2xl font-black font-headline tracking-tighter text-on-background">
          {formatPrice(product.price)}
        </span>
        <button 
          onClick={(e) => { e.stopPropagation(); addToCart(product); }}
          className="bg-on-background text-white p-3 rounded-full hover:scale-110 active:scale-95 transition-transform flex items-center justify-center border-2 border-transparent hover:border-white shadow-[4px_4px_0px_0px_rgba(44,47,48,0.2)]"
        >
          <span className="material-symbols-outlined text-[20px]" data-icon="add_shopping_cart">add_shopping_cart</span>
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
