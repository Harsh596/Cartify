export default function SearchBar({ searchQuery, setSearchQuery }) {
  return (
    <div className="flex items-center bg-white border-[4px] border-on-background rounded-full px-6 py-4 w-full max-w-2xl mx-auto mb-10 group focus-within:scale-[1.02] transition-transform shadow-[8px_8px_0px_0px_rgba(44,47,48,1)] relative z-10 hover:shadow-[12px_12px_0px_0px_rgba(44,47,48,1)]">
      <span className="material-symbols-outlined text-on-surface-variant group-focus-within:text-secondary transition-colors text-3xl">search</span>
      <input 
        type="text" 
        placeholder="SEARCH THE GEAR..." 
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full bg-transparent border-none outline-none font-headline font-black text-xl tracking-tighter text-on-background placeholder:text-on-background/40 ml-4 uppercase focus:ring-0"
      />
    </div>
  );
}
