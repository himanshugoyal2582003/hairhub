'use client';

import React, { useEffect, useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ImageGallery from '@/components/ui/ImageGallery';
import Skeleton from '@/components/ui/Skeleton';
import { api } from '@/lib/api';
import { IListing } from '@/types';
import { formatDate, getWhatsAppLink, getHairLengthLabel } from '@/lib/utils';
import { MessageSquare, MapPin, Eye, Calendar, ShieldCheck, Scissors } from 'lucide-react';

interface ListingDetailsPageProps {
  params: Promise<{ id: string }>;
}

export default function ListingDetailsPage({ params }: ListingDetailsPageProps) {
  const resolvedParams = React.use(params);
  const id = resolvedParams.id;

  const [listing, setListing] = useState<IListing | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const data = await api.listings.get(id);
        setListing(data.listing);
      } catch (err: any) {
        console.error('Error fetching listing details:', err);
        setError(err.message || 'Listing not found.');
      } finally {
        setLoading(false);
      }
    };
    fetchListing();
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-24 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Skeleton className="aspect-[4/3] rounded-3xl" />
            <div className="space-y-6">
              <Skeleton className="h-8 w-2/3" />
              <Skeleton className="h-6 w-1/3" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-12 w-1/2" />
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !listing) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1 flex flex-col items-center justify-center py-24 px-4 text-center">
          <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-950/30 flex items-center justify-center mb-4 text-red-600">
            <Calendar className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Listing Not Found</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm max-w-sm mb-6">
            The listing you are trying to view is either unavailable, sold, or has been removed.
          </p>
        </main>
        <Footer />
      </div>
    );
  }

  const whatsappMessage = `Hi ${listing.sellerName}, I saw your human hair listing "${listing.hairLength}\" ${listing.hairType} Hair" on HairHub India and I'm interested. Is it still available?`;
  const whatsappUrl = getWhatsAppLink(listing.whatsapp, whatsappMessage);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-24">
        {/* Breadcrumb / Top Info */}
        <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-6">
          <span>Listings</span>
          <span>&bull;</span>
          <span>{listing.state}</span>
          <span>&bull;</span>
          <span className="text-slate-600 dark:text-slate-300">{listing.city}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column: Image Gallery */}
          <div className="lg:col-span-7">
            <ImageGallery images={listing.imageUrls} alt={`${listing.hairLength}" ${listing.hairType} hair`} />
          </div>

          {/* Right Column: Listing Meta and Seller Contact */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 border border-slate-200/60 dark:border-slate-700/60 shadow-sm space-y-6">
              {/* Product title based on attributes */}
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white leading-tight">
                  {listing.hairLength}&quot; {listing.hairType} Human Hair
                </h1>
                <div className="flex flex-wrap items-center gap-4 mt-3 text-slate-500 dark:text-slate-400 text-sm">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4 text-blue-500" />
                    {listing.city}, {listing.state}
                  </span>
                  <span className="flex items-center gap-1">
                    <Eye className="w-4 h-4 text-cyan-500" />
                    {listing.views} views
                  </span>
                </div>
              </div>

              {/* Attributes Grid */}
              <div className="grid grid-cols-2 gap-4 border-y border-slate-100 dark:border-slate-700/50 py-5">
                <div className="space-y-1">
                  <span className="text-xs text-slate-400 dark:text-slate-500 uppercase tracking-wider font-bold">Length</span>
                  <p className="text-base font-bold text-slate-900 dark:text-white">{listing.hairLength} inches ({getHairLengthLabel(listing.hairLength)})</p>
                </div>
                <div className="space-y-1">
                  <span className="text-xs text-slate-400 dark:text-slate-500 uppercase tracking-wider font-bold">Weight</span>
                  <p className="text-base font-bold text-slate-900 dark:text-white">{listing.hairWeight} grams</p>
                </div>
                <div className="space-y-1">
                  <span className="text-xs text-slate-400 dark:text-slate-500 uppercase tracking-wider font-bold">Hair Type</span>
                  <p className="text-base font-bold text-slate-900 dark:text-white">{listing.hairType}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-xs text-slate-400 dark:text-slate-500 uppercase tracking-wider font-bold">Virgin Status</span>
                  <p className="text-base font-bold text-slate-900 dark:text-white">{listing.virginHair ? 'Virgin (Unprocessed)' : 'Processed'}</p>
                </div>
              </div>

              {/* Seller details */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-400 font-medium">Seller Name</span>
                  <span className="font-bold text-slate-900 dark:text-white">{listing.sellerName}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-400 font-medium">Posted On</span>
                  <span className="font-semibold text-slate-700 dark:text-slate-300">{formatDate(listing.createdAt)}</span>
                </div>
              </div>

              {/* Direct WhatsApp Call to Action */}
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/15 hover:scale-[1.01] active:scale-[0.99] transition-all"
              >
                <MessageSquare className="w-5 h-5" />
                Contact Seller on WhatsApp
              </a>

              {/* Safety tip */}
              <div className="p-4 bg-blue-500/5 border border-blue-500/10 rounded-2xl flex gap-3">
                <ShieldCheck className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  <strong>Safety Tip:</strong> Always verify the hair quality before making payment. Do not share banking OTPs. Handle shipping/pick-up carefully.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Description Section */}
        <div className="mt-12 bg-white dark:bg-slate-800 rounded-3xl p-8 border border-slate-200/60 dark:border-slate-700/60 shadow-sm max-w-3xl">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <Scissors className="w-5 h-5 text-blue-500" />
            Description
          </h2>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line text-sm sm:text-base">
            {listing.description}
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
