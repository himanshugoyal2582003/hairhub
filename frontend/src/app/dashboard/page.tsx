'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Skeleton from '@/components/ui/Skeleton';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import { IListing } from '@/types';
import Image from 'next/image';
import Link from 'next/link';
import { Eye, Calendar, Plus, Trash2, CheckCircle, Clock, Check, PlusCircle, LayoutDashboard, ExternalLink } from 'lucide-react';
import { formatDate } from '@/lib/utils';

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const [listings, setListings] = useState<IListing[]>([]);
  const [fetching, setFetching] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchUserListings = async () => {
    try {
      const data = await api.listings.getMyListings();
      setListings(data.listings || []);
    } catch (err) {
      console.error('Error fetching user listings:', err);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login?redirect=/dashboard');
    } else if (user) {
      fetchUserListings();
    }
  }, [user, loading, router]);

  const handleMarkAsSold = async (id: string) => {
    setActionLoading(id);
    try {
      await api.listings.updateStatus(id, 'sold');
      setListings((prev) =>
        prev.map((l) => (l._id === id ? { ...l, status: 'sold' } : l))
      );
    } catch (err) {
      console.error('Error marking listing as sold:', err);
      alert('Failed to update listing status');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteListing = async (id: string) => {
    if (!confirm('Are you sure you want to permanently delete this listing? This action cannot be undone.')) {
      return;
    }
    setActionLoading(id);
    try {
      await api.listings.delete(id);
      setListings((prev) => prev.filter((l) => l._id !== id));
    } catch (err) {
      console.error('Error deleting listing:', err);
      alert('Failed to delete listing');
    } finally {
      setActionLoading(null);
    }
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
        <div className="flex flex-col items-center gap-3">
          <Clock className="w-10 h-10 text-blue-600 animate-spin" />
          <p className="text-sm font-semibold text-slate-500">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  // Calculate metrics
  const totalListings = listings.length;
  const approvedListings = listings.filter((l) => l.approved && l.status === 'active').length;
  const totalViews = listings.reduce((sum, l) => sum + (l.views || 0), 0);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-24">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2.5">
              <LayoutDashboard className="w-8 h-8 text-blue-600" />
              Seller Dashboard
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">
              Welcome back, <span className="font-bold text-slate-800 dark:text-slate-200">{user.name}</span>. Manage your listings here.
            </p>
          </div>
          <Link
            href="/listings/create"
            className="inline-flex items-center gap-2 px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-md shadow-blue-500/10 hover:scale-[1.01] active:scale-[0.99] transition-all text-sm self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            Create New Listing
          </Link>
        </div>

        {/* Analytics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[
            { label: 'Total Listings', value: totalListings, color: 'text-blue-600' },
            { label: 'Approved Listings', value: approvedListings, color: 'text-emerald-600' },
            { label: 'Accumulated Views', value: totalViews, color: 'text-cyan-500' },
          ].map((stat, i) => (
            <div key={i} className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 shadow-sm">
              <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-1">
                {stat.label}
              </span>
              <span className={`text-2xl sm:text-3xl font-extrabold ${stat.color}`}>
                {fetching ? <Skeleton className="h-8 w-12" /> : stat.value}
              </span>
            </div>
          ))}
        </div>

        {/* Listings Section */}
        <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/60 dark:border-slate-700/60 shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-700/50 flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Your Hair Listings</h2>
          </div>

          {fetching ? (
            <div className="p-6 space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex gap-4 items-center">
                  <Skeleton className="w-16 h-16 rounded-xl" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-1/3" />
                    <Skeleton className="h-4 w-1/4" />
                  </div>
                </div>
              ))}
            </div>
          ) : listings.length === 0 ? (
            <div className="text-center py-20 px-6">
              <PlusCircle className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
              <h3 className="text-base font-bold text-slate-800 dark:text-white">No listings yet</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm max-w-sm mx-auto mt-1">
                You haven&apos;t created any hair listings. Post one today and start getting buyers on WhatsApp.
              </p>
              <Link
                href="/listings/create"
                className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-white rounded-xl text-sm font-semibold transition-all"
              >
                Create Listing
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-700/50">
              {listings.map((l) => (
                <div key={l._id} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 group hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                  <div className="flex items-start gap-4">
                    {/* Thumbnail */}
                    <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-700 shrink-0 border border-slate-200/40">
                      <Image
                        src={l.imageUrls[0]}
                        alt={l.description}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>

                    {/* Meta */}
                    <div className="space-y-1">
                      <h3 className="font-bold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">
                        {l.hairLength}&quot; {l.hairType} Hair
                      </h3>
                      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 dark:text-slate-500 font-semibold">
                        <span className="flex items-center gap-1">
                          <Eye className="w-3.5 h-3.5" />
                          {l.views || 0} views
                        </span>
                        <span>&bull;</span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          {formatDate(l.createdAt)}
                        </span>
                        <span>&bull;</span>
                        <span>{l.city}, {l.state}</span>
                      </div>

                      {/* Status pill */}
                      <div className="pt-1.5">
                        {(l.approved || l.status === 'active') && l.status !== 'sold' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                            <CheckCircle className="w-3 h-3" />
                            Live on Marketplace
                          </span>
                        )}
                        {l.status === 'sold' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-500/15 text-slate-500 dark:text-slate-400 border border-slate-500/20">
                            Sold
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap items-center gap-2">
                    {l.approved && l.status === 'active' && (
                      <button
                        onClick={() => handleMarkAsSold(l._id)}
                        disabled={actionLoading === l._id}
                        className="px-4 py-2 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-700 hover:border-emerald-600 hover:text-emerald-600 dark:hover:border-emerald-500 dark:hover:text-emerald-400 flex items-center gap-1.5 transition-all bg-white dark:bg-slate-800 disabled:opacity-50"
                      >
                        <Check className="w-3.5 h-3.5" />
                        Mark as Sold
                      </button>
                    )}

                    <Link
                      href={`/listings/${l._id}`}
                      className="px-4 py-2 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-700 hover:border-blue-600 hover:text-blue-600 dark:hover:border-blue-500 dark:hover:text-blue-400 flex items-center gap-1.5 transition-all bg-white dark:bg-slate-800"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      View Listing
                    </Link>

                    <button
                      onClick={() => handleDeleteListing(l._id)}
                      disabled={actionLoading === l._id}
                      className="p-2.5 rounded-xl border border-red-200/50 hover:bg-red-500 dark:border-red-900/30 dark:hover:bg-red-950/20 text-red-500 hover:text-white transition-all disabled:opacity-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

