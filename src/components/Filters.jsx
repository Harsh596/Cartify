export default function Filters({ priceRange, setPriceRange, sortBy, setSortBy }) {
  return (
    <div className="flex flex-wrap gap-6 justify-center mb-12">
      <div className="flex items-center gap-3">
        <label htmlFor="priceFilter" className="font-headline font-black tracking-tighter text-on-background text-lg uppercase">Price:</label>
        <select 
          id="priceFilter"
          value={priceRange} 
          onChange={(e) => setPriceRange(e.target.value)}
          className="bg-white border-[3px] border-on-background text-on-background font-headline font-black text-sm tracking-widest px-6 py-3 uppercase outline-none focus:border-secondary focus:ring-0 transition-colors cursor-pointer rounded-xl neo-shadow squishy-active"
        >
          <option value="all">ALL PRICES</option>
          <option value="0-100">₹0 - ₹9,000</option>
          <option value="100-500">₹9,000 - ₹45,000</option>
          <option value="500-1000">₹45,000 - ₹90,000</option>
          <option value="1000+">₹90,000+</option>
        </select>
      </div>

      <div className="flex items-center gap-3">
        <label htmlFor="sortFilter" className="font-headline font-black tracking-tighter text-on-background text-lg uppercase">Sort By:</label>
        <select 
          id="sortFilter"
          value={sortBy} 
          onChange={(e) => setSortBy(e.target.value)}
          className="bg-white border-[3px] border-on-background text-on-background font-headline font-black text-sm tracking-widest px-6 py-3 uppercase outline-none focus:border-secondary focus:ring-0 transition-colors cursor-pointer rounded-xl neo-shadow squishy-active"
        >
          <option value="default">HOTTEST GEAR</option>
          <option value="price-asc">PRICE: LOW TO HIGH</option>
          <option value="price-desc">PRICE: HIGH TO LOW</option>
          <option value="rating">TOP RATED</option>
          <option value="newest">LATEST DROPS</option>
        </select>
      </div>
    </div>
  );
}
