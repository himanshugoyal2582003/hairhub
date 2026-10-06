'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ListingCard from '@/components/listings/ListingCard';
import Skeleton from '@/components/ui/Skeleton';
import { api } from '@/lib/api';
import { IListing, INDIAN_STATES, HAIR_TYPES, HAIR_LENGTH_RANGES } from '@/types';
import { SlidersHorizontal, Search, RotateCcw, AlertCircle } from 'lucide-react';

function SearchAndFilterContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [listings, setListings] = useState<IListing[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);

  // Filter states
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [state, setState] = useState(searchParams.get('state') || '');
  const [city, setCity] = useState(searchParams.get('city') || '');
  const [hairType, setHairType] = useState(searchParams.get('hairType') || '');
  const [virginHair, setVirginHair] = useState(searchParams.get('virginHair') || '');
  const [hairLength, setHairLength] = useState(searchParams.get('hairLength') || 'all');
  const [sortBy, setSortBy] = useState(searchParams.get('sortBy') || 'newest');
  const [page, setPage] = useState(parseInt(searchParams.get('page') || '1'));

  const fetchFilteredListings = async () => {
    setLoading(true);
    try {
      // Calculate length range bounds
      let minLength = '';
      let maxLength = '';
      if (hairLength === 'short') {
        maxLength = '12';
      } else if (hairLength === 'medium') {
        minLength = '12';
        maxLength = '20';
      } else if (hairLength === 'long') {
        minLength = '20';
      }

      const res = await api.listings.list({
        search,
        state,
        city,
        hairType,
        virginHair,
        minLength,
        maxLength,
        sortBy,
        page,
        limit: 12,
      });

      setListings(res.listings || []);
      setTotal(res.total || 0);
      setTotalPages(res.totalPages || 1);
    } catch (err) {
      console.error('Error fetching listings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFilteredListings();
  }, [searchParams, page]);

  const handleApplyFilters = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setPage(1);

    const query: Record<string, string> = {};
    if (search) query.search = search;
    if (state) query.state = state;
    if (city) query.city = city;
    if (hairType) query.hairType = hairType;
    if (virginHair) query.virginHair = virginHair;
    if (hairLength !== 'all') query.hairLength = hairLength;
    if (sortBy !== 'newest') query.sortBy = sortBy;

    const params = new URLSearchParams(query);
    router.push(`/listings?${params.toString()}`);
  };

  const handleResetFilters = () => {
    setSearch('');
    setState('');
    setCity('');
    setHairType('');
    setVirginHair('');
    setHairLength('all');
    setSortBy('newest');
    setPage(1);
    router.push('/listings');
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-24">
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
            Browse Human Hair
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm sm:text-base">
            Find the perfect hair extensions, wigs, or bulk hair from certified sellers across India.
          </p>
        </div>

        {/* Filter Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Sidebar Filter Form */}
          <div className="lg:col-span-1">
            <form onSubmit={handleApplyFilters} className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200/60 dark:border-slate-700/60 shadow-sm space-y-6 sticky top-24">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700/50 pb-4">
                <div className="flex items-center gap-2 font-bold text-slate-800 dark:text-white">
                  <SlidersHorizontal className="w-5 h-5 text-blue-600" />
                  Filters
                </div>
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="text-xs font-semibold text-slate-400 dark:text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-1.5 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Reset
                </button>
              </div>

              {/* Search keyword */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
                  Keyword
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search description..."
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/30 text-sm"
                  />
                  <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                </div>
              </div>

              {/* Indian States */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
                  State
                </label>
                <select
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/30 text-sm text-slate-700 dark:text-slate-200"
                >
                  <option value="">All States</option>
                  {INDIAN_STATES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              {/* City */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
                  City
                </label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g. Mumbai"
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/30 text-sm"
                />
              </div>

              {/* Hair Length */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
                  Hair Length
                </label>
                <div className="space-y-2">
                  {HAIR_LENGTH_RANGES.map((r) => (
                    <label key={r.value} className="flex items-center gap-2.5 text-sm cursor-pointer select-none">
                      <input
                        type="radio"
                        name="hairLength"
                        value={r.value}
                        checked={hairLength === r.value}
                        onChange={() => setHairLength(r.value)}
                        className="w-4 h-4 text-blue-600 border-slate-300 focus:ring-blue-500/30"
                      />
                      <span className="text-slate-600 dark:text-slate-300">{r.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Hair Type */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
                  Hair Type
                </label>
                <select
                  value={hairType}
                  onChange={(e) => setHairType(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-200/70 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/30 text-sm text-slate-700 dark:text-slate-200"
                >
                  <option value="">All Types</option>
                  {HAIR_TYPES.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>

              {/* Virgin Hair */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
                  Hair Processing
                </label>
                <select
                  value={virginHair}
                  onChange={(e) => setVirginHair(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-200/70 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/30 text-sm text-slate-700 dark:text-slate-200"
                >
                  <option value="">Virgin or Processed</option>
                  <option value="yes">Virgin Hair Only</option>
                  <option value="no">Processed Hair Only</option>
                </select>
              </div>

              {/* Submit button */}
              <button
                type="submit"
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold shadow-md shadow-blue-500/10 hover:scale-[1.01] active:scale-[0.99] transition-all"
              >
                Apply Filters
              </button>
            </form>
          </div>

          {/* Right Listings Grid */}
          <div className="lg:col-span-3 space-y-6">
            {/* Sorting Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200/60 dark:border-slate-700/60">
              <div className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                {loading ? 'Searching listings...' : `Showing ${total} active listings`}
              </div>
              <div className="flex items-center gap-2 self-stretch sm:self-auto justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 shrink-0">
                  Sort By
                </span>
                <select
                  value={sortBy}
                  onChange={(e) => {
                    setSortBy(e.target.value);
                    const query = new URLSearchParams(searchParams);
                    query.set('sortBy', e.target.value);
                    router.push(`/listings?${query.toString()}`);
                  }}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm font-semibold outline-none focus:ring-2 focus:ring-blue-500/30 text-slate-700 dark:text-slate-200"
                >
                  <option value="newest">Newest First</option>
                  <option value="views">Most Popular</option>
                  <option value="length-asc">Length: Short to Long</option>
                  <option value="length-desc">Length: Long to Short</option>
                </select>
              </div>
            </div>

            {/* Main Listings */}
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="space-y-4">
                    <Skeleton className="aspect-square w-full rounded-2xl animate-pulse" />
                    <Skeleton className="h-4 w-3/4 animate-pulse" />
                    <Skeleton className="h-4 w-1/2 animate-pulse" />
                  </div>
                ))}
              </div>
            ) : listings.length === 0 ? (
              <div className="flex flex-col items-center justify-center text-center py-20 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/60 dark:border-slate-700/60 shadow-sm px-6">
                <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-900/50 flex items-center justify-center mb-4">
                  <AlertCircle className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
                  No listings found
                </h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm max-w-sm">
                  We couldn&apos;t find any hair listings matching your current filter criteria. Try expanding your filters.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="mt-6 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition-all shadow-md"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {listings.map((listing) => (
                    <ListingCard key={listing._id} listing={listing} />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-1.5 pt-8 border-t border-slate-100 dark:border-slate-800/40">
                    <button
                      disabled={page === 1}
                      onClick={() => setPage(page - 1)}
                      className="px-4 py-2 text-sm font-semibold rounded-xl border border-slate-200 dark:border-slate-700 disabled:opacity-40 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                    >
                      Previous
                    </button>
                    {Array.from({ length: totalPages }).map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setPage(i + 1)}
                        className={`w-10 h-10 rounded-xl text-sm font-bold flex items-center justify-center border transition-all ${
                          page === i + 1
                            ? 'bg-blue-600 border-blue-600 text-white shadow-md'
                            : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:border-blue-500'
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                    <button
                      disabled={page === totalPages}
                      onClick={() => setPage(page + 1)}
                      className="px-4 py-2 text-sm font-semibold rounded-xl border border-slate-200 dark:border-slate-700 disabled:opacity-40 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function BrowseListingsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
        <div className="flex flex-col items-center gap-3">
          <Skeleton className="w-12 h-12 rounded-full animate-spin border-4 border-blue-600 border-t-transparent bg-transparent" />
          <p className="text-sm font-semibold text-slate-500 animate-pulse">Loading Browse Listings...</p>
        </div>
      </div>
    }>
      <SearchAndFilterContent />
    </Suspense>
  );
}
