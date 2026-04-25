import { useState } from 'react';

export default function Navbar({
  inputValue,
  setInputValue,
  handleLocationChange,
  handleSearchKeyDown,
  handleSuggestionClick,
  suggestions,
  showDropdown,
  selectedDate,
  setSelectedDate,
  showDateDropdown,
  setShowDateDropdown,
  upcomingDates,
  guests,
  incrementGuests,
  decrementGuests,
  handleSearchButtonClick,
  view,
  setView,
  clearSearchAndFilters,
  setActiveCategory,
}) {
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  return (
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
                  className="bg-transparent outline-none px-4 w-28 sm:w-36 text-gray-900 placeholder-gray-900 font-semibold truncate text-center"
                />
              </div>

              <span className="w-px h-6 bg-gray-300 mx-1"></span>
              
              {/* Date Picker Dropdown */}
              <div className="relative">
                <button 
                  onClick={() => setShowDateDropdown(!showDateDropdown)}
                  className="bg-transparent outline-none px-4 w-24 sm:w-28 text-gray-900 font-semibold truncate hover:bg-gray-100 rounded-full py-1 text-center"
                >
                  {selectedDate || "Any week"}
                </button>
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

              {/* Centralized Dropdowns */}
              {showDropdown && suggestions.length > 0 && (
                <div className="absolute top-[calc(100%+12px)] left-1/2 -translate-x-1/2 w-[400px] bg-white rounded-3xl shadow-[0_8px_28px_rgba(0,0,0,0.15)] overflow-hidden py-4 z-50">
                  <div className="px-6 pb-2 text-xs font-bold text-gray-500 uppercase">Suggested locations</div>
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

              {showDateDropdown && (
                <div className="absolute top-[calc(100%+12px)] left-1/2 -translate-x-1/2 w-[400px] bg-white rounded-3xl shadow-[0_8px_28px_rgba(0,0,0,0.15)] overflow-hidden py-4 z-50">
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
            
            <div className="relative">
              <button 
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-3 border border-gray-300 rounded-full p-2 pl-3.5 hover:shadow-md transition bg-white ml-1"
              >
                <svg viewBox="0 0 32 32" className="block h-4 w-4 fill-current text-gray-600"><g fill="none" fillRule="nonzero"><path d="m2 16h28"></path><path d="m2 24h28"></path><path d="m2 8h28"></path></g><path d="M4 17h24v-2H4v2zm0-8h24V7H4v2zm0 16h24v-2H4v2z" /></svg>
                <div className="bg-gray-500 text-white rounded-full h-8 w-8 flex items-center justify-center overflow-hidden">
                  <svg viewBox="0 0 32 32" className="block h-8 w-8 fill-current text-white pt-1"><path d="M16 .7C7.56.7.7 7.56.7 16S7.56 31.3 16 31.3 31.3 24.44 31.3 16 24.44.7 16 .7zm0 28c-4.02 0-7.6-1.88-9.93-4.81a12.43 12.43 0 0 1 6.45-4.4A6.5 6.5 0 0 1 9.5 14a6.5 6.5 0 0 1 13 0 6.51 6.51 0 0 1-3.02 5.49 12.42 12.42 0 0 1 6.45 4.4A13.93 13.93 0 0 1 16 28.7z" /></svg>
                </div>
              </button>

              {showProfileMenu && (
                <div className="absolute top-[calc(100%+12px)] right-0 w-64 bg-white rounded-xl shadow-[0_8px_28px_rgba(0,0,0,0.15)] overflow-hidden py-2 z-50 text-sm font-medium">
                  <div className="flex flex-col">
                    <button className="text-left px-4 py-3 hover:bg-gray-100 transition flex items-center gap-3 text-gray-800">
                      <span className="text-lg">👤</span> My Profile
                    </button>
                    <button className="text-left px-4 py-3 hover:bg-gray-100 transition flex items-center gap-3 text-gray-800">
                      <span className="text-lg">🧳</span> My Trips
                    </button>
                    <button 
                      onClick={() => { setView('Wishlist'); setActiveCategory(null); setShowProfileMenu(false); }}
                      className="text-left px-4 py-3 hover:bg-gray-100 transition flex items-center gap-3 text-gray-800"
                    >
                      <span className="text-lg">❤️</span> Wishlist
                    </button>
                    <button className="text-left px-4 py-3 hover:bg-gray-100 transition flex items-center gap-3 text-gray-800">
                      <span className="text-lg">💬</span> Messages
                    </button>
                    <button className="text-left px-4 py-3 hover:bg-gray-100 transition flex items-center gap-3 text-gray-800">
                      <span className="text-lg">🔔</span> Notifications
                    </button>
                  </div>
                  
                  <div className="h-px bg-gray-200 my-1"></div>
                  
                  <div className="flex flex-col">
                    <button className="text-left px-4 py-3 hover:bg-gray-100 transition flex items-center gap-3 text-gray-800">
                      <span className="text-lg">🏠</span> Become a Host
                    </button>
                    <button className="text-left px-4 py-3 hover:bg-gray-100 transition flex items-center gap-3 text-gray-800">
                      <span className="text-lg">💼</span> My Listings
                    </button>
                    <button className="text-left px-4 py-3 hover:bg-gray-100 transition flex items-center gap-3 text-gray-800">
                      <span className="text-lg">💳</span> Payments
                    </button>
                  </div>

                  <div className="h-px bg-gray-200 my-1"></div>
                  
                  <div className="flex flex-col">
                    <button className="text-left px-4 py-3 hover:bg-gray-100 transition flex items-center gap-3 text-gray-800">
                      <span className="text-lg">⚙️</span> Settings
                    </button>
                    <button className="text-left px-4 py-3 hover:bg-gray-100 transition flex items-center gap-3 text-gray-800">
                      <span className="text-lg">🌐</span> Language & Currency
                    </button>
                    <button className="text-left px-4 py-3 hover:bg-gray-100 transition flex items-center gap-3 text-gray-800">
                      <span className="text-lg">❓</span> Help Center
                    </button>
                  </div>

                  <div className="h-px bg-gray-200 my-1"></div>

                  <div className="flex flex-col">
                    <button className="text-left px-4 py-3 hover:bg-gray-100 transition flex items-center gap-3 text-gray-800">
                      <span className="text-lg">🚪</span> Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
