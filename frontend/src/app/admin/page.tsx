'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Skeleton from '@/components/ui/Skeleton';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import { IListing, IUser } from '@/types';
import Image from 'next/image';
import {
  ShieldCheck,
  Clock,
  Trash2,
  Users,
  Image as ImageIcon,
  UserX,
  RefreshCw,
  Search,
  ExternalLink,
} from 'lucide-react';
import { formatDate } from '@/lib/utils';

export default function AdminPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<'listings' | 'users'>('listings');
  const [allListings, setAllListings] = useState<IListing[]>([]);
  const [usersList, setUsersList] = useState<IUser[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [fetching, setFetching] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const loadData = async () => {
    setFetching(true);
    try {
      const [allListingsRes, statsRes, usersRes] = await Promise.all([
        api.admin.getListings({ limit: 100 }),
        api.admin.getStats(),
        api.admin.getUsers(),
      ]);

      setAllListings(allListingsRes.listings || []);
      setUsersList(usersRes.users || []);

      const statsData = statsRes.stats || statsRes;
      setStats({
        ...statsData,
        approvedListings: statsData.active ?? statsData.approvedListings ?? 0,
        totalUsers: statsData.totalUsers ?? usersRes.users?.length ?? 0,
      });
    } catch (err) {
      console.error('Error fetching admin data:', err);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/admin/login');
      } else if (user.role !== 'admin') {
        router.push('/dashboard');
      } else {
        loadData();
      }
    }
  }, [user, loading, router]);

  // Handle Delete Listing
  const handleDeleteListing = async (id: string) => {
    if (!confirm('Are you sure you want to permanently delete this listing?')) return;

    setActionLoading(id);
    try {
      await api.admin.moderateListing(id, 'delete');
      setAllListings((prev) => prev.filter((l) => l._id !== id));
    } catch (err) {
      console.error('Error deleting listing:', err);
      alert('Failed to delete listing');
    } finally {
      setActionLoading(null);
    }
  };

  // Handle Removing Individual Uploaded Image from a Listing
  const handleRemoveImage = async (listingId: string, imageUrl: string) => {
    if (!confirm('Are you sure you want to remove this image from the listing?')) return;

    const actionKey = `${listingId}-${imageUrl}`;
    setActionLoading(actionKey);
    try {
      const res = await api.admin.removeListingImage(listingId, imageUrl);
      const updatedListing: IListing = res.listing;
      setAllListings((prev) =>
        prev.map((l) => (l._id === listingId ? updatedListing : l))
      );
    } catch (err) {
      console.error('Error removing image:', err);
      alert('Failed to remove image');
    } finally {
      setActionLoading(null);
    }
  };

  // Handle Deleting Fake/Spam User
  const handleDeleteUser = async (targetUser: IUser) => {
    if (targetUser._id === user?._id) {
      alert('You cannot delete your own admin account!');
      return;
    }

    if (
      !confirm(
        `⚠️ WARNING: Are you sure you want to delete fake user "${targetUser.name}" (${targetUser.email})?\n\nThis will permanently remove their account and all their uploaded listings!`
      )
    ) {
      return;
    }

    setActionLoading(targetUser._id);
    try {
      await api.admin.deleteUser(targetUser._id);
      setUsersList((prev) => prev.filter((u) => u._id !== targetUser._id));
      loadData();
      alert(`User "${targetUser.name}" has been deleted.`);
    } catch (err: any) {
      console.error('Error deleting user:', err);
      alert(err?.message || 'Failed to delete user');
    } finally {
      setActionLoading(null);
    }
  };

  // Handle Changing User Role
  const handleChangeRole = async (targetUser: IUser, newRole: 'user' | 'admin') => {
    setActionLoading(targetUser._id);
    try {
      await api.admin.updateUserRole(targetUser._id, newRole);
      setUsersList((prev) =>
        prev.map((u) => (u._id === targetUser._id ? { ...u, role: newRole } : u))
      );
    } catch (err) {
      console.error('Error changing role:', err);
      alert('Failed to update user role');
    } finally {
      setActionLoading(null);
    }
  };

  if (loading || !user || user.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
        <div className="flex flex-col items-center gap-3">
          <Clock className="w-10 h-10 text-blue-600 animate-spin" />
          <p className="text-sm font-semibold text-slate-500">Checking admin privileges...</p>
        </div>
      </div>
    );
  }

  const filteredUsers = usersList.filter(
    (u) =>
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredListings = allListings.filter(
    (l) =>
      l.sellerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.state.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-900">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-24">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2.5">
              <ShieldCheck className="w-8 h-8 text-emerald-600" />
              Admin Moderation &amp; Security Panel
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">
              Manage listings, purge fake seller accounts, and moderate uploaded images.
            </p>
          </div>
          <button
            onClick={loadData}
            disabled={fetching}
            className="self-start sm:self-auto px-4 py-2 text-xs font-bold rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center gap-2 transition-all shadow-sm"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${fetching ? 'animate-spin' : ''}`} />
            Refresh Data
          </button>
        </div>

        {/* Stats Summary Bar */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          {[
            { label: 'Total Registered Users', value: stats?.totalUsers || usersList.length, color: 'text-slate-900 dark:text-white' },
            { label: 'Active Listings', value: stats?.approvedListings || 0, color: 'text-emerald-600' },
            { label: 'Total Views Across Platform', value: stats?.totalViews || 0, color: 'text-blue-600' },
          ].map((stat, i) => (
            <div
              key={i}
              className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 shadow-sm"
            >
              <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-1">
                {stat.label}
              </span>
              <span className={`text-2xl sm:text-3xl font-extrabold ${stat.color}`}>
                {fetching ? <Skeleton className="h-8 w-16" /> : stat.value}
              </span>
            </div>
          ))}
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-2 mb-6 border-b border-slate-200 dark:border-slate-800 pb-3">
          <button
            onClick={() => setActiveTab('listings')}
            className={`px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all ${
              activeTab === 'listings'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700/60 hover:bg-slate-100 dark:hover:bg-slate-700'
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            Listings &amp; Image Moderation ({allListings.length})
          </button>

          <button
            onClick={() => setActiveTab('users')}
            className={`px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all ${
              activeTab === 'users'
                ? 'bg-red-600 text-white shadow-md shadow-red-500/20'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700/60 hover:bg-slate-100 dark:hover:bg-slate-700'
            }`}
          >
            <Users className="w-4 h-4" />
            Users &amp; Fake Account Purge ({usersList.length})
          </button>
        </div>

        {/* TAB 1: ALL LISTINGS & IMAGE MODERATION */}
        {activeTab === 'listings' && (
          <div className="space-y-6">
            {/* Search Filter */}
            <div className="relative">
              <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search listings by seller, location, description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/60 dark:border-slate-700/60 shadow-sm overflow-hidden divide-y divide-slate-100 dark:divide-slate-700/50">
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
              ) : filteredListings.length === 0 ? (
                <div className="text-center py-16 px-6 text-slate-500 text-sm">
                  No listings found matching your criteria.
                </div>
              ) : (
                filteredListings.map((l) => (
                  <div key={l._id} className="p-6 space-y-4 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                    {/* Header line */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase ${
                          l.status === 'active'
                            ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20'
                            : l.status === 'sold'
                            ? 'bg-slate-500/10 text-slate-500 border border-slate-500/20'
                            : 'bg-amber-500/10 text-amber-600 border border-amber-500/20'
                        }`}>
                          {l.status}
                        </span>
                        <h3 className="font-bold text-slate-900 dark:text-white text-base">
                          {l.hairLength}&quot; {l.hairType} ({l.hairWeight}g)
                        </h3>
                        <a
                          href={`/listings/${l._id}`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 font-semibold"
                        >
                          <ExternalLink className="w-3 h-3" />
                          View
                        </a>
                      </div>

                      <button
                        onClick={() => handleDeleteListing(l._id)}
                        disabled={actionLoading === l._id}
                        className="px-3 py-1.5 text-xs font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg border border-red-200 dark:border-red-900/40 flex items-center gap-1 self-start sm:self-auto disabled:opacity-50"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        {actionLoading === l._id ? 'Deleting...' : 'Delete Listing'}
                      </button>
                    </div>

                    {/* Meta info */}
                    <div className="text-xs text-slate-400 dark:text-slate-500 space-x-3 font-semibold">
                      <span>Seller: <strong className="text-slate-700 dark:text-slate-300">{l.sellerName}</strong> ({l.whatsapp})</span>
                      <span>&bull;</span>
                      <span>Location: {l.city}, {l.state}</span>
                      <span>&bull;</span>
                      <span>Views: {l.views || 0}</span>
                      <span>&bull;</span>
                      <span>Posted: {formatDate(l.createdAt)}</span>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      {l.description}
                    </p>

                    {/* Photo Gallery & Moderation */}
                    <div className="space-y-2 pt-2">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                        Uploaded Photos ({l.imageUrls?.length || 0}) — Hover &amp; Click &quot;Remove Photo&quot; to delete:
                      </span>
                      {l.imageUrls?.length === 0 ? (
                        <p className="text-xs italic text-slate-400">No images attached</p>
                      ) : (
                        <div className="flex flex-wrap gap-3">
                          {l.imageUrls.map((imgUrl, imgIdx) => {
                            const isDeletingThis = actionLoading === `${l._id}-${imgUrl}`;
                            return (
                              <div
                                key={imgIdx}
                                className="group relative w-28 h-28 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-900"
                              >
                                <Image
                                  src={imgUrl}
                                  alt={`Listing photo ${imgIdx + 1}`}
                                  fill
                                  className="object-cover transition-transform group-hover:scale-105"
                                  unoptimized
                                />
                                {/* Overlay remove button */}
                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-2 text-center">
                                  <button
                                    onClick={() => handleRemoveImage(l._id, imgUrl)}
                                    disabled={isDeletingThis}
                                    className="px-2.5 py-1.5 rounded-lg bg-red-600 text-white font-bold text-[10px] flex items-center gap-1 shadow-lg hover:bg-red-700 transition-all disabled:opacity-50"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                    {isDeletingThis ? 'Removing...' : 'Remove Photo'}
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* TAB 2: USERS & FAKE ACCOUNT PURGE */}
        {activeTab === 'users' && (
          <div className="space-y-6">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search registered users by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/60 dark:border-slate-700/60 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700/50 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <UserX className="w-5 h-5 text-red-500" />
                  <h2 className="text-base font-bold text-slate-900 dark:text-white">
                    User Accounts &amp; Anti-Spam Moderation ({usersList.length})
                  </h2>
                </div>
                <span className="text-xs text-slate-400">
                  Deleting a fake user purges all their listings automatically.
                </span>
              </div>

              {fetching ? (
                <div className="p-6 space-y-3">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-12 w-full" />
                  ))}
                </div>
              ) : filteredUsers.length === 0 ? (
                <div className="text-center py-16 px-6 text-slate-500 text-sm">
                  No user accounts found matching query.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-100 dark:border-slate-700">
                      <tr>
                        <th className="px-6 py-3.5">User</th>
                        <th className="px-6 py-3.5">Role</th>
                        <th className="px-6 py-3.5">Joined Date</th>
                        <th className="px-6 py-3.5 text-right">Anti-Spam Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50 font-medium">
                      {filteredUsers.map((u) => {
                        const isSelf = u._id === user._id;
                        return (
                          <tr key={u._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold flex items-center justify-center shrink-0">
                                  {u.name?.charAt(0).toUpperCase() || 'U'}
                                </div>
                                <div>
                                  <span className="font-bold text-slate-900 dark:text-white block">
                                    {u.name} {isSelf && <span className="text-[10px] text-blue-500 font-normal">(You)</span>}
                                  </span>
                                  <span className="text-slate-400 text-[11px]">{u.email}</span>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <select
                                value={u.role}
                                disabled={isSelf || actionLoading === u._id}
                                onChange={(e) => handleChangeRole(u, e.target.value as 'user' | 'admin')}
                                className="px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-semibold focus:outline-none"
                              >
                                <option value="user">user</option>
                                <option value="admin">admin</option>
                              </select>
                            </td>
                            <td className="px-6 py-4 text-slate-400">
                              {formatDate(u.createdAt)}
                            </td>
                            <td className="px-6 py-4 text-right">
                              <button
                                onClick={() => handleDeleteUser(u)}
                                disabled={isSelf || actionLoading === u._id}
                                className="px-3 py-1.5 rounded-xl bg-red-500/10 hover:bg-red-500 text-red-600 hover:text-white border border-red-500/20 font-bold text-xs transition-all disabled:opacity-30 inline-flex items-center gap-1.5"
                              >
                                <UserX className="w-3.5 h-3.5" />
                                Delete Fake User
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
