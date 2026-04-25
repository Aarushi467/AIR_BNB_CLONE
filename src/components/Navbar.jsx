import { useState, useEffect } from 'react';

const categories = [
  { label: 'Beachfront', icon: '🏖️' },
  { label: 'Cabins', icon: '🪵' },
  { label: 'Mountains', icon: '⛰️' },
  { label: 'Pools', icon: '🏊' },
  { label: 'Cities', icon: '🏙️' },
  { label: 'Treehouses', icon: '🌲' },
  { label: 'Tropical', icon: '🌴' },
  { label: 'Countryside', icon: '🚜' },
  { label: 'Castles', icon: '🏰' },
  { label: 'Amazing views', icon: '🌅' },
  { label: 'Farms', icon: '🐄' },
  { label: 'Lakes', icon: '🛶' },
];

const upcomingDates = ["Apr 25–27", "May 2–4", "May 9–11", "May 16–18"];

const Card = ({ listing, isFav, toggleFav, onClickCard }) => {
  return (
    <div className="group cursor-pointer flex flex-col gap-3" onClick={() => onClickCard(listing)}>
      <div className="relative aspect-square overflow-hidden rounded-xl bg-gray-100">
        {listing.badge === 'Guest favourite' && (
          <div className="absolute top-3 left-3 bg-white/95 px-2 py-1 rounded-full text-sm font-semibold shadow-sm z-10 text-gray-900">
            Guest favourite
          </div>
        )}
        <button 
          onClick={(e) => { e.stopPropagation(); toggleFav(listing.id); }}
          className="absolute top-3 right-3 z-10 p-1 hover:scale-110 transition-transform"
        >
          <svg viewBox="0 0 32 32" className={`block h-6 w-6 stroke-white stroke-[2px] ${isFav ? 'fill-rose-500 stroke-rose-500' : 'fill-black/50'}`}>
            <path d="M16 28c7-4.73 14-10 14-17a6.98 6.98 0 0 0-7-7c-1.8 0-3.58.68-4.95 2.05L16 8.1l-2.05-2.05a6.98 6.98 0 0 0-9.9 0A6.98 6.98 0 0 0 2 11c0 7 7 12.27 14 17z" />
          </svg>
        </button>
        <img 
          src={listing.image} 
          alt={listing.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ease-out"
        />
      </div>
      <div>
        <div className="flex justify-between items-start">
          <h3 className="font-semibold text-gray-900 truncate pr-4">{listing.location}</h3>
          <div className="flex items-center gap-1 text-gray-900">
            <svg viewBox="0 0 32 32" className="h-3 w-3 fill-current"><path d="M15.094 1.579l-4.124 8.885-9.86 1.27a1 1 0 0 0-.542 1.736l7.293 6.565-1.965 9.852a1 1 0 0 0 1.483 1.061L16 25.951l8.625 4.997a1 1 0 0 0 1.482-1.06l-1.965-9.853 7.293-6.565a1 1 0 0 0-.541-1.735l-9.86-1.271-4.127-8.885a1 1 0 0 0-1.814 0z" /></svg>
            <span className="font-light text-sm">{listing.rating}</span>
          </div>
        </div>
        <p className="text-gray-500 text-sm truncate">{listing.title}</p>
        <p className="text-gray-900 text-sm mt-1"><span className="font-semibold">₹{listing.price}</span> <span className="font-light">for {listing.nights || 2} nights</span></p>
      </div>
    </div>
  );
};

export default function App() {
  const [allListings, setAllListings] = useState([]);
  const [initialLoading, setInitialLoading] = useState(true);
  
  // Search state
  const [inputValue, setInputValue] = useState('');
  const [appliedSearchTerm, setAppliedSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  
  // Date picker state
  const [selectedDate, setSelectedDate] = useState('');
  const [showDateDropdown, setShowDateDropdown] = useState(false);

  const [guests, setGuests] = useState(0);
  const [activeCategory, setActiveCategory] = useState(null);
  
  const [favorites, setFavorites] = useState([]);
  const [view, setView] = useState('Home'); // 'Home' or 'Wishlist'
  
  // Modal State
  const [selectedListing, setSelectedListing] = useState(null);
  const [isReserved, setIsReserved] = useState(false);

  // Initial Data Load & Wishlist Hydration
  useEffect(() => {
    const savedWishlist = localStorage.getItem('wishlist');
    if (savedWishlist) {
      try {
        setFavorites(JSON.parse(savedWishlist));
      } catch (e) {
        console.error("Failed to parse wishlist");
      }
    }

    fetch('http://localhost:3001/listings')
      .then(res => res.json())
      .then(data => {
        setAllListings(data);
        setInitialLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch initial listings", err);
        setInitialLoading(false);
      });
  }, []);

  const handleLocationChange = (e) => {
    const val = e.target.value;
    setInputValue(val);
    
    if (val.trim() === '') {
      setShowDropdown(false);
      setSuggestions([]);
      setAppliedSearchTerm(''); // auto clear search
    } else {
      const t = val.toLowerCase().trim();
      const matched = allListings.filter(l => 
        l.city?.toLowerCase().includes(t) ||
        l.state?.toLowerCase().includes(t) ||
        l.title?.toLowerCase().includes(t) ||
        l.location?.toLowerCase().includes(t)
      );
      setSuggestions(Array.from(new Set(matched.map(l => l.location))));
      setShowDropdown(true);
    }
  };

  const applySearch = (term) => {
    setAppliedSearchTerm(term);
    setInputValue(term);
    setShowDropdown(false);
    setActiveCategory(null); // Reset category when doing a new search
  };

  const handleSuggestionClick = (loc) => applySearch(loc);

  const handleSearchKeyDown = (e) => {
    if (e.key === 'Enter') applySearch(inputValue);
  };

  const handleSearchButtonClick = () => applySearch(inputValue);

  const clearSearchAndFilters = () => {
    setInputValue('');
    setAppliedSearchTerm('');
    setActiveCategory(null);
    setShowDropdown(false);
  };

  const toggleFav = (id) => {
    setFavorites(prev => {
      const newFavs = prev.includes(id) 
        ? prev.filter(favId => favId !== id) 
        : [...prev, id];
      localStorage.setItem('wishlist', JSON.stringify(newFavs));
      return newFavs;
    });
  };

  const handleCategoryClick = (label) => {
    setActiveCategory(prev => prev === label ? null : label);
  };

  const incrementGuests = () => setGuests(prev => Math.min(prev + 1, 16));
  const decrementGuests = () => setGuests(prev => Math.max(prev - 1, 0));

  // Filtering Logic
  const matchesSearch = (listing) => {
    if (!appliedSearchTerm.trim()) return true;
    const term = appliedSearchTerm.toLowerCase().trim();
    return (
      listing.location?.toLowerCase().includes(term) ||
      listing.title?.toLowerCase().includes(term) ||
      listing.description?.toLowerCase().includes(term) ||
      listing.city?.toLowerCase().includes(term) ||
      listing.state?.toLowerCase().includes(term) ||
      listing.country?.toLowerCase().includes(term)
    );
  };

  const matchesCategory = (listing) => {
    if (!activeCategory) return true;
    return listing.category?.toLowerCase() === activeCategory.toLowerCase();
  };

  let visibleListings = allListings.filter(l => matchesSearch(l) && matchesCategory(l));
  if (view === 'Wishlist') {
    visibleListings = visibleListings.filter(l => favorites.includes(l.id));
  }

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans">
      {/* Sticky Navbar */}
      <header className="sticky top-0 z-40 bg-white border-b border-gray-200">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center text-rose-500 gap-1 cursor-pointer w-1/3" onClick={() => { setView('Home'); clearSearchAndFilters(); }}>
              <svg width="32" height="32" viewBox="0 0 32 32" fill="currentColor">
                <path d="M16 1c2.008 0 3.463.963 4.751 3.269l.533 1.025c1.954 3.83 6.114 12.54 7.1 14.836l.145.353c.667 1.591.91 2.472.96 3.396l.01.415.001.228c0 4.062-2.877 6.478-6.357 6.478-2.224 0-4.556-1.258-6.709-3.386l-.257-.26-.172-.179h-.011l-.176.185c-2.044 2.1-4.268 3.42-6.535 3.615l-.28.019-.206.006C5.377 31 2.5 28.584 2.5 24.522l.005-.469c.026-.928.23-1.768.83-3.244l.216-.524c.966-2.298 5.083-10.87 7.11-14.892l.473-.912C12.443 2.052 13.923 1 16 1zm0 2c-1.396 0-2.378.608-3.35 2.372l-.427.809C10.3 10.026 6.302 18.256 5.377 20.407l-.234.566c-.456 1.155-.58 1.764-.598 2.48l-.004.382c0 2.875 1.957 4.165 4.36 4.165 1.69 0 3.527-.923 5.321-2.612l.423-.414.492-.511L16 23.32l.863 1.042.476.533c1.776 1.848 3.733 2.924 5.568 2.924 2.385 0 4.354-1.282 4.354-4.152l-.004-.326c-.029-.68-.15-1.259-.553-2.348l-.206-.525C25.541 18.22 21.6 10.12 19.646 6.275l-.478-.925C18.226 3.655 17.278 3 16 3zm0 9c2.32 0 4.602 1.487 6.445 4.095 1.765 2.497 2.652 5.025 2.652 7.371 0 1.983-.873 3.534-2.583 3.534-1.238 0-2.827-.852-4.525-2.55l-.488-.507C16.892 23.298 16.48 22 16 22c-.475 0-.895 1.289-1.503 1.93l-.489.52c-1.701 1.714-3.291 2.55-4.524 2.55-1.724 0-2.584-1.564-2.584-3.534 0-2.33 .887-4.85 2.65-7.348C11.395 13.487 13.681 12 16 12zm0 2c-1.636 0-3.324.965-4.75 3.018-1.403 2.016-2.15 4.02-2.15 5.928 0 1.07.391 1.554 1.084 1.554 1.083 0 2.361-1.026 3.57-2.388l.386-.45C14.774 20.89 15.352 19.5 16 19.5c.642 0 1.22 1.378 1.856 2.15l.385.45c1.21 1.365 2.49 2.392 3.573 2.392.69 0 1.082-.482 1.082-1.547 0-1.895-.747-3.886-2.15-5.888C19.324 14.966 17.636 14 16 14z" />
              </svg>
              <span className="hidden lg:block font-bold text-xl tracking-tight">airbnb</span>
            </div>

            {/* Search Bar */}
            <div className="flex-1 flex justify-center w-full max-w-[500px] lg:max-w-none relative">
              <div className="flex items-center shadow-sm hover:shadow-md transition-shadow border border-gray-300 rounded-full py-1.5 px-2 md:py-2 md:px-2 text-sm font-medium whitespace-nowrap bg-white relative z-20">
                
                {/* Location Typeahead */}
                <div className="relative">
                  <input 
                    type="text" 
                    placeholder="Anywhere" 
                    value={inputValue}
                    onChange={handleLocationChange}
                    onKeyDown={handleSearchKeyDown}
                    className="bg-transparent outline-none px-4 w-28 sm:w-36 text-gray-900 placeholder-gray-900 font-semibold truncate"
                  />
                  {showDropdown && suggestions.length > 0 && (
                    <div className="absolute top-full left-0 mt-3 w-64 bg-white rounded-3xl shadow-[0_8px_28px_rgba(0,0,0,0.15)] overflow-hidden py-4 z-50">
                      {suggestions.map((loc, idx) => (
                        <div 
                          key={idx} 
                          onClick={() => handleSuggestionClick(loc)}
                          className="px-6 py-3 hover:bg-gray-100 cursor-pointer flex items-center gap-3 transition"
                        >
                          <div className="bg-gray-200 p-2 rounded-xl text-gray-700">
                            <svg viewBox="0 0 32 32" className="h-4 w-4 fill-current"><path d="M16 0c-6.627 0-12 5.373-12 12 0 7.854 9.176 18.064 10.966 19.988.546.586 1.522.586 2.068 0C18.824 30.064 28 19.854 28 12c0-6.627-5.373-12-12-12zm0 18a6 6 0 1 1 0-12 6 6 0 0 1 0 12z" /></svg>
                          </div>
                          <span className="text-base text-gray-800">{loc}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <span className="w-px h-6 bg-gray-300 mx-1"></span>
                
                {/* Date Picker Dropdown */}
                <div className="relative">
                  <button 
                    onClick={() => setShowDateDropdown(!showDateDropdown)}
                    className="bg-transparent outline-none px-4 w-24 sm:w-28 text-gray-900 font-semibold truncate hover:bg-gray-100 rounded-full py-1 text-left"
                  >
                    {selectedDate || "Any week"}
                  </button>
                  {showDateDropdown && (
                    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-56 bg-white rounded-3xl shadow-[0_8px_28px_rgba(0,0,0,0.15)] overflow-hidden py-4 z-50">
                      <div className="px-6 pb-2 text-xs font-bold text-gray-500 uppercase">Upcoming weekends</div>
                      {upcomingDates.map((date, idx) => (
                        <div 
                          key={idx} 
                          onClick={() => { setSelectedDate(date); setShowDateDropdown(false); }}
                          className={`px-6 py-3 hover:bg-gray-100 cursor-pointer transition ${selectedDate === date ? 'bg-gray-50 font-semibold text-black' : 'text-gray-700'}`}
                        >
                          {date}
                        </div>
                      ))}
                      {selectedDate && (
                        <div className="px-6 py-2 mt-2 border-t border-gray-100">
                          <button onClick={() => { setSelectedDate(''); setShowDateDropdown(false); }} className="text-sm underline text-gray-600 hover:text-black">Clear dates</button>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <span className="w-px h-6 bg-gray-300 mx-1"></span>
                
                {/* Guest Counter Segment */}
                <div className="flex items-center pl-4 pr-1">
                  <div className="hidden md:flex items-center gap-2 mr-2 w-28 justify-between">
                    <button 
                      onClick={decrementGuests}
                      className="w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center hover:border-gray-900 transition text-gray-500 hover:text-gray-900"
                    >
                      -
                    </button>
                    <span className="text-gray-900 font-normal truncate whitespace-nowrap">
                      {guests === 0 ? <span className="text-gray-500">Add guests</span> : <span className="font-semibold">{guests} guest{guests > 1 ? 's' : ''}</span>}
                    </span>
                    <button 
                      onClick={incrementGuests}
                      className="w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center hover:border-gray-900 transition text-gray-500 hover:text-gray-900"
                    >
                      +
                    </button>
                  </div>
                  
                  <button 
                    onClick={handleSearchButtonClick}
                    className="bg-rose-500 p-2.5 rounded-full text-white md:ml-1 hover:bg-rose-600 transition-colors z-10 flex items-center justify-center gap-2"
                  >
                    <svg viewBox="0 0 32 32" className="block h-3.5 w-3.5 fill-current font-bold stroke-current stroke-[1.5]" aria-hidden="true" role="presentation" focusable="false">
                      <path d="M13 0c7.18 0 13 5.82 13 13 0 2.868-.929 5.519-2.502 7.669l7.916 7.917-2.828 2.828-7.917-7.916A12.94 12.94 0 0 1 13 26C5.82 26 0 20.18 0 13S5.82 0 13 0zm0 4a9 9 0 1 0 0 18 9 9 0 0 0 0-18z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Right Nav */}
            <div className="flex items-center justify-end gap-1 w-1/3">
              <button 
                onClick={() => { setView('Wishlist'); setActiveCategory(null); }}
                className={`hidden md:block text-sm font-semibold px-4 py-2.5 rounded-full transition ${view === 'Wishlist' ? 'text-rose-500' : 'text-gray-900 hover:bg-gray-100'}`}
              >
                Wishlists
              </button>
              <a href="#" className="hidden md:block text-sm font-semibold text-gray-900 hover:bg-gray-100 px-4 py-2.5 rounded-full transition">
                Airbnb your home
              </a>
              <button className="flex items-center gap-3 border border-gray-300 rounded-full p-2 pl-3.5 hover:shadow-md transition bg-white ml-1">
                <svg viewBox="0 0 32 32" className="block h-4 w-4 fill-current text-gray-600"><g fill="none" fillRule="nonzero"><path d="m2 16h28"></path><path d="m2 24h28"></path><path d="m2 8h28"></path></g><path d="M4 17h24v-2H4v2zm0-8h24V7H4v2zm0 16h24v-2H4v2z" /></svg>
                <div className="bg-gray-500 text-white rounded-full h-8 w-8 flex items-center justify-center overflow-hidden">
                  <svg viewBox="0 0 32 32" className="block h-8 w-8 fill-current text-white pt-1"><path d="M16 .7C7.56.7.7 7.56.7 16S7.56 31.3 16 31.3 31.3 24.44 31.3 16 24.44.7 16 .7zm0 28c-4.02 0-7.6-1.88-9.93-4.81a12.43 12.43 0 0 1 6.45-4.4A6.5 6.5 0 0 1 9.5 14a6.5 6.5 0 0 1 13 0 6.51 6.51 0 0 1-3.02 5.49 12.42 12.42 0 0 1 6.45 4.4A13.93 13.93 0 0 1 16 28.7z" /></svg>
                </div>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Category Bar */}
      {view === 'Home' && (
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 mt-5">
          <div className="flex items-center gap-8 overflow-x-auto pb-4 scrollbar-hide border-b border-gray-200">
            {categories.map((cat, idx) => (
              <button 
                key={idx}
                onClick={() => handleCategoryClick(cat.label)}
                className={`flex flex-col items-center gap-2.5 min-w-max pb-3 border-b-2 transition-colors ${
                  activeCategory === cat.label 
                    ? 'border-gray-900 text-gray-900' 
                    : 'border-transparent text-gray-500 hover:text-gray-900 hover:border-gray-300'
                }`}
              >
                <span className="text-2xl">{cat.icon}</span>
                <span className="text-sm font-medium">{cat.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 py-6 space-y-12 min-h-[60vh]">
        
        {initialLoading ? (
          <div className="flex flex-col items-center justify-center h-64">
             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-500 mb-4"></div>
             <p className="text-gray-500 font-semibold text-lg">Loading homes...</p>
          </div>
        ) : visibleListings.length === 0 ? (
          <div className="flex flex-col justify-center items-center h-64 animate-in fade-in zoom-in-95">
            <svg viewBox="0 0 32 32" className="h-16 w-16 fill-gray-300 mb-4"><path d="M26 14a12 12 0 1 0-8.6 11.5l6.2 6.2a1 1 0 0 0 1.4-1.4l-6.2-6.2A11.9 11.9 0 0 0 26 14zm-12 10a10 10 0 1 1 10-10 10 10 0 0 1-10 10z"/></svg>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No exact matches</h2>
            <p className="text-gray-500 mb-6">Try changing or removing some of your filters.</p>
            <button 
              onClick={clearSearchAndFilters}
              className="border border-black text-black hover:bg-gray-50 px-6 py-2.5 rounded-lg font-semibold transition"
            >
              Clear search
            </button>
          </div>
        ) : (
          <>
            {view === 'Wishlist' ? (
              <section>
                <h2 className="text-3xl font-bold mb-6 tracking-tight">Your Wishlist</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-6 gap-y-10">
                  {visibleListings.map(listing => (
                    <Card 
                      key={listing.id} 
                      listing={listing} 
                      isFav={favorites.includes(listing.id)} 
                      toggleFav={toggleFav} 
                      onClickCard={(l) => { setSelectedListing(l); setIsReserved(false); }}
                    />
                  ))}
                </div>
              </section>
            ) : (
              <section>
                {appliedSearchTerm || activeCategory ? (
                  <h2 className="text-2xl font-semibold mb-6 tracking-tight">
                    {visibleListings.length} homes {appliedSearchTerm ? `matching "${appliedSearchTerm}"` : ''} {activeCategory ? `• ${activeCategory}` : ''}
                  </h2>
                ) : (
                  <h2 className="text-2xl font-semibold mb-6 tracking-tight">Explore popular stays</h2>
                )}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-6 gap-y-10">
                  {visibleListings.map(listing => (
                    <Card 
                      key={listing.id} 
                      listing={listing} 
                      isFav={favorites.includes(listing.id)} 
                      toggleFav={toggleFav} 
                      onClickCard={(l) => { setSelectedListing(l); setIsReserved(false); }}
                    />
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </main>

      {/* Listing Detail Modal with Backdrop Blur */}
      {selectedListing && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm transition-opacity" 
          onClick={() => setSelectedListing(null)}
        >
          <div 
            className="bg-white rounded-2xl max-w-3xl w-full max-h-[95vh] overflow-y-auto shadow-2xl relative animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={() => setSelectedListing(null)}
              className="absolute top-4 left-4 bg-white/90 hover:bg-white rounded-full p-2 z-10 shadow-sm transition-transform hover:scale-105"
            >
              <svg viewBox="0 0 32 32" className="block h-4 w-4 fill-current"><path d="m20 28-11.29289322-11.2928932c-.39052429-.3905243-.39052429-1.0236893 0-1.4142136l11.29289322-11.2928932" stroke="currentColor" strokeWidth="3" fill="none" /></svg>
            </button>
            
            {/* Modal Image */}
            <div className="w-full h-80 relative">
              <img 
                src={selectedListing.image} 
                alt={selectedListing.title} 
                className="w-full h-full object-cover rounded-t-2xl"
              />
            </div>
            
            <div className="p-8">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-3xl font-bold mb-2 text-gray-900">{selectedListing.title}</h2>
                  <p className="text-lg text-gray-600 font-medium">{selectedListing.location}</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <div className="flex items-center gap-1 font-semibold text-lg bg-gray-100 px-3 py-1.5 rounded-lg">
                    <svg viewBox="0 0 32 32" className="h-4 w-4 fill-current"><path d="M15.094 1.579l-4.124 8.885-9.86 1.27a1 1 0 0 0-.542 1.736l7.293 6.565-1.965 9.852a1 1 0 0 0 1.483 1.061L16 25.951l8.625 4.997a1 1 0 0 0 1.482-1.06l-1.965-9.853 7.293-6.565a1 1 0 0 0-.541-1.735l-9.86-1.271-4.127-8.885a1 1 0 0 0-1.814 0z" /></svg>
                    {selectedListing.rating}
                  </div>
                </div>
              </div>
              
              {/* Host and Category row */}
              <div className="flex items-center gap-4 mb-6 border-b border-gray-200 pb-6">
                <img 
                  src={`https://ui-avatars.com/api/?name=Host&background=random`} 
                  alt="Host" 
                  className="w-14 h-14 rounded-full border border-gray-200 shadow-sm"
                />
                <div>
                  <h3 className="font-semibold text-gray-900 text-lg">Hosted by a Superhost</h3>
                  <p className="text-gray-500">{selectedListing.category} • Superhost</p>
                </div>
              </div>

              <div className="py-2 mb-8">
                <p className="text-gray-700 leading-relaxed text-lg">
                  {selectedListing.description}
                </p>
              </div>

              {/* Price Breakdown and Reservation */}
              <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 flex justify-between items-center shadow-sm">
                <div>
                  <div className="text-2xl font-bold text-gray-900 mb-1">
                    ₹{selectedListing.price} <span className="text-lg font-normal text-gray-500">per night</span>
                  </div>
                  <div className="text-gray-600 font-medium underline">
                    ₹{selectedListing.price} × {selectedListing.nights || 2} nights = ₹{selectedListing.price * (selectedListing.nights || 2)} total
                  </div>
                </div>
                <button 
                  onClick={() => setIsReserved(true)}
                  disabled={isReserved}
                  className={`px-10 py-4 rounded-xl font-bold text-lg transition shadow-md ${
                    isReserved 
                      ? 'bg-green-500 hover:bg-green-600 text-white cursor-default transform-none' 
                      : 'bg-rose-500 hover:bg-rose-600 text-white hover:scale-105 active:scale-95'
                  }`}
                >
                  {isReserved ? 'Reserved! ✓' : 'Reserve'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-[#F7F7F7] mt-12 py-6 text-sm">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex flex-wrap gap-2 text-gray-600">
            <span>© 2026 Airbnb, Inc.</span>
            <span className="hidden sm:inline">·</span>
            <a href="#" className="hover:underline">Privacy</a>
            <span className="hidden sm:inline">·</span>
            <a href="#" className="hover:underline">Terms</a>
            <span className="hidden sm:inline">·</span>
            <a href="#" className="hover:underline">Sitemap</a>
            <span className="hidden sm:inline">·</span>
            <a href="#" className="hover:underline">Company details</a>
          </div>
          <div className="flex gap-4 font-semibold text-gray-900">
            <button className="hover:underline flex items-center gap-2">
              <svg viewBox="0 0 16 16" className="block h-4 w-4 fill-current"><path d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0zm3.33 14.86c-.46-.66-1.1-1.63-1.63-2.86h-3.4c-.53 1.23-1.17 2.2-1.63 2.86A6.56 6.56 0 0 1 1.5 8c0-.62.09-1.22.25-1.8h3.3C5 6.78 5 7.4 5 8s0 1.22.05 1.8h-3.3A6.56 6.56 0 0 1 8 1.5c.78 0 1.52.14 2.22.39-.46.66-1.1 1.63-1.63 2.86H5.19C5.07 5.4 5 6.06 5 6.75h6v1.5H5c0 .69.07 1.35.19 1.99h3.4c.53 1.23 1.17 2.2 1.63 2.86A6.56 6.56 0 0 1 14.5 8c0-.62-.09-1.22-.25-1.8h-3.3c.05.58.05 1.2.05 1.8s0 1.22-.05 1.8h3.3a6.56 6.56 0 0 1-2.92 5.06z" /></svg>
              English (IN)
            </button>
            <button className="hover:underline font-semibold">₹ INR</button>
            <button className="hover:underline font-semibold">Support & resources</button>
          </div>
        </div>
      </footer>
    </div>
  );
}

