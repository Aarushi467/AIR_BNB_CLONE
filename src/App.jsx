import { useState, useEffect } from 'react';
import Navbar from "./components/Navbar";

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
    setShowDateDropdown(false); // Close date dropdown if open
    setActiveCategory(null); // Reset category when doing a new search
    setView('Home'); // Ensure we switch back to the main listings view
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
      <Navbar
        inputValue={inputValue}
        setInputValue={setInputValue}
        handleLocationChange={handleLocationChange}
        handleSearchKeyDown={handleSearchKeyDown}
        handleSuggestionClick={handleSuggestionClick}
        suggestions={suggestions}
        showDropdown={showDropdown}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        showDateDropdown={showDateDropdown}
        setShowDateDropdown={setShowDateDropdown}
        upcomingDates={upcomingDates}
        guests={guests}
        incrementGuests={incrementGuests}
        decrementGuests={decrementGuests}
        handleSearchButtonClick={handleSearchButtonClick}
        view={view}
        setView={setView}
        clearSearchAndFilters={clearSearchAndFilters}
        setActiveCategory={setActiveCategory}
      />

      {/* Category Bar */}
      {view === 'Home' && (
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 mt-5">
          <div className="flex items-center gap-8 overflow-x-auto pb-4 scrollbar-hide border-b border-gray-200">
            {categories.map((cat, idx) => (
              <button
                key={idx}
                onClick={() => handleCategoryClick(cat.label)}
                className={`flex flex-col items-center gap-2.5 min-w-max pb-3 border-b-2 transition-colors ${activeCategory === cat.label
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
            <svg viewBox="0 0 32 32" className="h-16 w-16 fill-gray-300 mb-4"><path d="M26 14a12 12 0 1 0-8.6 11.5l6.2 6.2a1 1 0 0 0 1.4-1.4l-6.2-6.2A11.9 11.9 0 0 0 26 14zm-12 10a10 10 0 1 1 10-10 10 10 0 0 1-10 10z" /></svg>
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
                  className={`px-10 py-4 rounded-xl font-bold text-lg transition shadow-md ${isReserved
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



