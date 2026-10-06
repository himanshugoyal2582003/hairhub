import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Ruler, Leaf, Eye, Clock } from 'lucide-react';
import { IListing } from '@/types';
import { formatTimeAgo, cn } from '@/lib/utils';

interface ListingCardProps {
  listing: IListing;
  className?: string;
}

export default function ListingCard({ listing, className }: ListingCardProps) {
  const primaryImage = listing.imageUrls?.[0] ?? 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=600&auto=format&fit=crop';

  return (
    <Link
      href={`/listings/${listing._id}`}
      className={cn(
        'group block bg-white dark:bg-slate-800 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300',
        className
      )}
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-slate-100 dark:bg-slate-700">
        <Image
          src={primaryImage}
          alt={`${listing.hairType} hair by ${listing.sellerName}`}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          loading="lazy"
          unoptimized={primaryImage.startsWith('https://images.unsplash')}
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-1.5">
          {listing.virginHair && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-500 text-white shadow">
              <Leaf className="w-3 h-3" /> Virgin
            </span>
          )}
          {listing.status === 'sold' && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-red-500 text-white shadow">
              Sold
            </span>
          )}
        </div>

        {/* Views */}
        <div className="absolute top-3 right-3 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-black/50 text-white backdrop-blur-sm">
          <Eye className="w-3 h-3" /> {listing.views}
        </div>

        {/* Image count */}
        {listing.imageUrls?.length > 1 && (
          <div className="absolute bottom-3 right-3 px-2 py-0.5 rounded-full text-xs font-medium bg-black/50 text-white backdrop-blur-sm">
            1/{listing.imageUrls.length}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Location */}
        <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400 text-xs mb-2">
          <MapPin className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate">{listing.city}, {listing.state}</span>
        </div>

        {/* Title row */}
        <h3 className="font-semibold text-slate-900 dark:text-white text-base leading-snug mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          {listing.hairType} Hair &bull; {listing.hairLength}&quot;
        </h3>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
            <Ruler className="w-3 h-3" /> {listing.hairLength}″
          </span>
          <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
            {listing.hairWeight}g
          </span>
          <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-cyan-50 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-300">
            {listing.hairType}
          </span>
        </div>

        {/* Seller & Date */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-700">
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300 truncate">
            {listing.sellerName}
          </span>
          <span className="flex items-center gap-1 text-xs text-slate-400 dark:text-slate-500 shrink-0 ml-2">
            <Clock className="w-3 h-3" />
            {formatTimeAgo(listing.createdAt)}
          </span>
        </div>
      </div>
    </Link>
  );
}
