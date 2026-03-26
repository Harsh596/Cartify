import { useMemo, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import ProductGrid from '../components/ProductGrid';
import SearchBar from '../components/SearchBar';
import Filters from '../components/Filters';
import useProducts from '../hooks/useProducts';
import useDebounce from '../hooks/useDebounce';
import api from '../services/api';

export default function Products() {
  const location = useLocation();
  const [activeCategory, setActiveCategory] = useState(null);
  const [categories, setCategories] = useState([]);
  
  const { products, loading, error } = useProducts(activeCategory); 

  const [visibleCount, setVisibleCount] = useState(12);

  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearchQuery = useDebounce(searchQuery, 400); 
  
  const [priceRange, setPriceRange] = useState('all');
  const [sortBy, setSortBy] = useState('default');

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const q = params.get('q');
    if (q !== null) {
      setSearchQuery(q);
      setActiveCategory(null);
    }
  }, [location.search]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const cats = await api.getCategories();
        setCategories(cats);
      } catch (err) {
        console.error("Failed to fetch categories", err);
      }
    };
    fetchCategories();
  }, []);

  const displayProducts = useMemo(() => {
    if (!products) return [];
    
    let result = [...products];

    if (debouncedSearchQuery.trim() !== '') {
      const lowerQuery = debouncedSearchQuery.toLowerCase();
      result = result.filter(p => 
        p.title.toLowerCase().includes(lowerQuery) || 
        p.category.toLowerCase().includes(lowerQuery)
      );
    }

    if (priceRange !== 'all') {
      if (priceRange === '0-100') result = result.filter(p => p.price >= 0 && p.price <= 100);
      else if (priceRange === '100-500') result = result.filter(p => p.price > 100 && p.price <= 500);
      else if (priceRange === '500-1000') result = result.filter(p => p.price > 500 && p.price <= 1000);
      else if (priceRange === '1000+') result = result.filter(p => p.price > 1000);
    }

    if (sortBy === 'price-asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      result.sort((a, b) => (b.rating?.rate || 0) - (a.rating?.rate || 0));
    } else if (sortBy === 'newest') {
      result.sort((a, b) => b.id - a.id);
    }

    return result;
  }, [products, debouncedSearchQuery, priceRange, sortBy]);

  return (
    <div className="w-full px-6 py-12">
      <div className="mb-16 relative w-full text-center md:text-left flex flex-col items-center md:items-start">
        <div className="absolute -top-6 md:-left-6 bg-tertiary-fixed text-on-tertiary-fixed font-black px-6 py-2 border-[4px] border-on-background rounded-full rotate-[-4deg] shadow-[4px_4px_0px_0px_rgba(44,47,48,1)] z-10 text-xl font-headline">
            THE ARCHIVE
        </div>
        <h1 className="text-6xl md:text-8xl font-headline font-black tracking-tighter text-on-background uppercase leading-[0.9] mb-4 mt-8 md:mt-0">
            CARTIFY <br/><span className="text-primary underline decoration-primary-container decoration-[12px]">COLLECTION</span>
        </h1>
        <p className="text-xl md:text-2xl font-bold text-on-surface-variant max-w-2xl leading-tight">
            CRUSHING THE NORM WITH SATURATED STYLE. COLLECTIBLE GEAR FOR THE EXPERTLY INCLINED.
        </p>
      </div>

      <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      
      <Filters 
        priceRange={priceRange} setPriceRange={setPriceRange} 
        sortBy={sortBy} setSortBy={setSortBy} 
      />

      <div className="flex flex-wrap gap-4 justify-center mb-16">
        <button 
          onClick={() => setActiveCategory(null)}
          className={`px-8 py-3 font-headline font-black text-md uppercase transition-all duration-300 border-[3px] border-on-background rounded-full hover:-translate-y-1 shadow-[4px_4px_0px_0px_rgba(44,47,48,1)] ${activeCategory === null ? 'bg-primary-container text-on-background' : 'bg-white text-on-background hover:bg-secondary-container'}`}
        >
          All Drops
        </button>

        {categories.map(cat => (
          <button 
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-8 py-3 font-headline font-black text-md uppercase transition-all duration-300 border-[3px] border-on-background rounded-full hover:-translate-y-1 shadow-[4px_4px_0px_0px_rgba(44,47,48,1)] ${activeCategory === cat ? 'bg-primary-container text-on-background' : 'bg-white text-on-background hover:bg-tertiary-container'}`}
          >
            {cat}
          </button>
        ))}
      </div>
      
      {!loading && displayProducts.length === 0 ? (
        <div className="text-center py-24 text-on-background font-headline font-black tracking-widest text-2xl uppercase">
          NO GEAR MATCHED YOUR FILTERS.
        </div>
      ) : (
        <ProductGrid products={displayProducts.slice(0, visibleCount)} loading={loading} error={error} />
      )}
      
      {/* Pagination Load More simulation */}
      {!loading && displayProducts.length > visibleCount && (
        <div className="mt-20 flex justify-center">
          <button 
            onClick={() => setVisibleCount(v => v + 8)}
            className="px-12 py-6 bg-secondary text-white font-headline font-black uppercase text-2xl rounded-xl border-[5px] border-on-background shadow-[10px_10px_0px_0px_rgba(44,47,48,1)] hover:scale-105 active:scale-95 transition-all">
              Load More Drops
          </button>
        </div>
      )}
    </div>
  )
}
