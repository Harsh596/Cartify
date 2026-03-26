import ProductCard from './ProductCard';

const ProductGrid = ({ products, loading, error }) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-24 text-on-background font-headline font-black text-2xl uppercase tracking-widest">
        LOADING GEAR...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-24 bg-error-container text-on-error border-[4px] border-on-background rounded-xl">
        <p className="font-headline font-black tracking-widest uppercase mb-4 text-xl">{error}</p>
        <button className="border-[3px] border-on-background bg-white text-on-background px-6 py-2 font-black uppercase tracking-widest hover:bg-secondary-container transition-colors squishy-active rounded-full neo-shadow" onClick={() => window.location.reload()}>RETRY CONNECTION</button>
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center py-24 text-on-background font-headline font-black tracking-widest text-2xl uppercase">
        <span className="material-symbols-outlined text-6xl mb-4 text-secondary">inventory_2</span>
        NO DROPS LOCATED.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
      {products.map((product, index) => (
        <ProductCard key={product.id} product={product} index={index} />
      ))}
    </div>
  );
};

export default ProductGrid;
