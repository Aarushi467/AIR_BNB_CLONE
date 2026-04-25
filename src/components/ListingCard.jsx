export default function ListingCard({ listing, isFav, toggleFav, onClickCard }) {
  return (
    <div
      className="group cursor-pointer flex flex-col gap-3"
      onClick={() => onClickCard(listing)}
    >
      <div className="relative aspect-square overflow-hidden rounded-xl bg-gray-100">
        
        {listing.badge === "Guest favourite" && (
          <div className="absolute top-3 left-3 bg-white/95 px-2 py-1 rounded-full text-sm font-semibold shadow-sm z-10 text-gray-900">
            Guest favourite
          </div>
        )}

        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleFav(listing.id);
          }}
          className="absolute top-3 right-3 z-10 p-1 hover:scale-110 transition-transform"
        >
          <svg
            viewBox="0 0 32 32"
            className={`block h-6 w-6 stroke-white stroke-[2px] ${
              isFav ? "fill-rose-500 stroke-rose-500" : "fill-black/50"
            }`}
          >
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
          <h3 className="font-semibold text-gray-900 truncate pr-4">
            {listing.location}
          </h3>

          <div className="flex items-center gap-1 text-gray-900">
            <svg viewBox="0 0 32 32" className="h-3 w-3 fill-current">
              <path d="M15.094 1.579l-4.124 8.885-9.86 1.27a1 1 0 0 0-.542 1.736l7.293 6.565-1.965 9.852a1 1 0 0 0 1.483 1.061L16 25.951l8.625 4.997a1 1 0 0 0 1.482-1.06l-1.965-9.853 7.293-6.565a1 1 0 0 0-.541-1.735l-9.86-1.271-4.127-8.885a1 1 0 0 0-1.814 0z" />
            </svg>
            <span className="font-light text-sm">{listing.rating}</span>
          </div>
        </div>

        <p className="text-gray-500 text-sm truncate">
          {listing.title}
        </p>

        <p className="text-gray-900 text-sm mt-1">
          <span className="font-semibold">₹{listing.price}</span>{" "}
          <span className="font-light">
            for {listing.nights || 2} nights
          </span>
        </p>
      </div>
    </div>
  );
}