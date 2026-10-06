'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import { IListing } from '@/types';
import Link from 'next/link';
import Image from 'next/image';
import {
  User, Mail, Key, ShieldCheck, Camera, Check, AlertCircle, Clock,
  LayoutDashboard, Plus, LogOut, Sparkles, Save, Eye, Calendar,
  ArrowRight, CheckCircle2, RefreshCw, Lock
} from 'lucide-react';
import { formatDate } from '@/lib/utils';

export default function ProfilePage() {
  const { user, loading, updateUser, logout } = useAuth();
  const router = useRouter();

  // Active Tab
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'stats'>('profile');

  // Profile Form State
  const [name, setName] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileMsg, setProfileMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Security Form State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordMsg, setPasswordMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Stats State
  const [userListings, setUserListings] = useState<IListing[]>([]);
  const [fetchingStats, setFetchingStats] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login?redirect=/profile');
    } else if (user) {
      setName(user.name || '');
      setImageUrl(user.image || '');

      // Fetch user listings for stats summary
      api.listings.getMyListings()
        .then((res) => {
          setUserListings(res.listings || []);
        })
        .catch((err) => {
          console.error('Error fetching listings for profile:', err);
        })
        .finally(() => {
          setFetchingStats(false);
        });
    }
  }, [user, loading, router]);

  // Handle Avatar Image Upload
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setProfileMsg({ type: 'error', text: 'Please select an image file (PNG, JPG, WEBP).' });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setProfileMsg({ type: 'error', text: 'Image size must be less than 5MB.' });
      return;
    }

    setIsUploading(true);
    setProfileMsg(null);

    try {
      const res = await api.upload.single(file);
      if (res.url) {
        setImageUrl(res.url);
        setProfileMsg({ type: 'success', text: 'Image uploaded! Click "Save Changes" to update profile.' });
      }
    } catch (err: any) {
      setProfileMsg({ type: 'error', text: err.message || 'Failed to upload image.' });
    } finally {
      setIsUploading(false);
    }
  };

  // Handle Profile Update
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || name.trim().length < 2) {
      setProfileMsg({ type: 'error', text: 'Name must be at least 2 characters.' });
      return;
    }

    setProfileSaving(true);
    setProfileMsg(null);

    try {
      const res = await api.auth.updateProfile({ name: name.trim(), image: imageUrl });
      updateUser(res.user);
      setProfileMsg({ type: 'success', text: 'Profile updated successfully!' });
    } catch (err: any) {
      setProfileMsg({ type: 'error', text: err.message || 'Failed to update profile.' });
    } finally {
      setProfileSaving(false);
    }
  };

  // Handle Password Change
  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordMsg({ type: 'error', text: 'Please fill in all password fields.' });
      return;
    }

    if (newPassword.length < 6) {
      setPasswordMsg({ type: 'error', text: 'New password must be at least 6 characters.' });
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordMsg({ type: 'error', text: 'New password and confirm password do not match.' });
      return;
    }

    setPasswordSaving(true);
    setPasswordMsg(null);

    try {
      await api.auth.updatePassword({ currentPassword, newPassword });
      setPasswordMsg({ type: 'success', text: 'Password changed successfully!' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setPasswordMsg({ type: 'error', text: err.message || 'Failed to change password.' });
    } finally {
      setPasswordSaving(false);
    }
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
        <div className="flex flex-col items-center gap-3">
          <Clock className="w-10 h-10 text-blue-600 animate-spin" />
          <p className="text-sm font-semibold text-slate-500">Loading Profile...</p>
        </div>
      </div>
    );
  }

  const activeCount = userListings.filter((l) => l.approved && l.status === 'active').length;
  const totalViews = userListings.reduce((sum, l) => sum + (l.views || 0), 0);

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 transition-colors">
      <Navbar />

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-24">
        {/* Banner Card */}
        <div className="relative bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/80 dark:border-slate-700/80 shadow-sm overflow-hidden mb-8">
          {/* Header Banner Background */}
          <div className="h-36 sm:h-48 bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 relative">
            <div className="absolute inset-0 bg-black/10 backdrop-blur-[2px]" />
            <div className="absolute top-4 right-4 flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white/20 text-white backdrop-blur-md border border-white/30">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                {user.role === 'admin' ? 'Administrator' : 'Hair Seller Member'}
              </span>
            </div>
          </div>

          {/* User Header Details */}
          <div className="px-6 pb-6 pt-0 relative flex flex-col sm:flex-row items-center sm:items-end justify-between gap-6 -mt-16 sm:-mt-20">
            <div className="flex flex-col sm:flex-row items-center sm:items-end gap-5 text-center sm:text-left">
              {/* Profile Avatar */}
              <div className="relative group">
                <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl ring-4 ring-white dark:ring-slate-800 bg-gradient-to-br from-blue-600 to-cyan-500 overflow-hidden shadow-xl flex items-center justify-center text-white font-extrabold text-3xl shrink-0">
                  {imageUrl ? (
                    <Image
                      src={imageUrl}
                      alt={user.name}
                      width={128}
                      height={128}
                      className="w-full h-full object-cover"
                      unoptimized
                    />
                  ) : (
                    <span>{user.name?.[0]?.toUpperCase() || 'U'}</span>
                  )}
                </div>

                {/* Upload overlay */}
                <label className="absolute inset-0 rounded-2xl bg-black/40 text-white flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-xs font-bold">
                  <Camera className="w-5 h-5" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={isUploading}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Info */}
              <div className="space-y-1">
                <div className="flex items-center justify-center sm:justify-start gap-2">
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                    {user.name}
                  </h1>
                  {user.role === 'admin' && (
                    <span title="Admin Account"><ShieldCheck className="w-6 h-6 text-emerald-500" /></span>
                  )}
                </div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400 flex items-center justify-center sm:justify-start gap-1.5">
                  <Mail className="w-4 h-4 text-slate-400" />
                  {user.email}
                </p>
                {user.createdAt && (
                  <p className="text-xs text-slate-400 dark:text-slate-500 flex items-center justify-center sm:justify-start gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    Member since {formatDate(user.createdAt)}
                  </p>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Link
                href="/dashboard"
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md transition-all"
              >
                <LayoutDashboard className="w-4 h-4" />
                Dashboard
              </Link>
              {user.role === 'admin' && (
                <Link
                  href="/admin"
                  className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md transition-all"
                >
                  <ShieldCheck className="w-4 h-4" />
                  Admin
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-700 mb-8 overflow-x-auto pb-1">
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex items-center gap-2 px-4 py-2.5 font-bold text-sm rounded-t-xl transition-colors border-b-2 ${
              activeTab === 'profile'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400 bg-white/50 dark:bg-slate-800/50'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <User className="w-4 h-4" />
            Edit Profile
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`flex items-center gap-2 px-4 py-2.5 font-bold text-sm rounded-t-xl transition-colors border-b-2 ${
              activeTab === 'security'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400 bg-white/50 dark:bg-slate-800/50'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Key className="w-4 h-4" />
            Security & Password
          </button>
          <button
            onClick={() => setActiveTab('stats')}
            className={`flex items-center gap-2 px-4 py-2.5 font-bold text-sm rounded-t-xl transition-colors border-b-2 ${
              activeTab === 'stats'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400 bg-white/50 dark:bg-slate-800/50'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Eye className="w-4 h-4" />
            Activity & Summary
          </button>
        </div>

        {/* Tab 1: Edit Profile */}
        {activeTab === 'profile' && (
          <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/80 dark:border-slate-700/80 p-6 sm:p-8 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1 flex items-center gap-2">
              <User className="w-5 h-5 text-blue-600" />
              Personal Information
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
              Update your public display name and profile picture.
            </p>

            {profileMsg && (
              <div
                className={`p-4 rounded-2xl mb-6 text-sm font-medium flex items-center gap-3 ${
                  profileMsg.type === 'success'
                    ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800/50'
                    : 'bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400 border border-red-200/60 dark:border-red-800/50'
                }`}
              >
                {profileMsg.type === 'success' ? (
                  <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-500" />
                ) : (
                  <AlertCircle className="w-5 h-5 shrink-0 text-red-500" />
                )}
                {profileMsg.text}
              </div>
            )}

            <form onSubmit={handleUpdateProfile} className="space-y-6 max-w-xl">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder="Enter your full name"
                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm font-medium transition-all"
                  />
                </div>
              </div>

              {/* Email (Read Only) */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                  Email Address (Cannot be changed)
                </label>
                <div className="relative">
                  <Mail className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="email"
                    value={user.email}
                    disabled
                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800/60 text-slate-500 text-sm font-medium cursor-not-allowed"
                  />
                  <span title="Verified Email" className="absolute right-3.5 top-3.5"><CheckCircle2 className="w-5 h-5 text-emerald-500" /></span>
                </div>
              </div>

              {/* Profile Image URL / Upload */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                  Profile Image URL
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="https://example.com/avatar.jpg"
                    className="flex-1 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm font-medium transition-all"
                  />
                  <label className="px-4 py-3 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors shrink-0">
                    <Camera className="w-4 h-4" />
                    {isUploading ? 'Uploading...' : 'Upload'}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={isUploading}
                      className="hidden"
                    />
                  </label>
                </div>
                <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">
                  Upload an avatar image or paste a direct image URL.
                </p>
              </div>

              {/* Save Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={profileSaving || isUploading}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md shadow-blue-500/10 transition-all text-sm disabled:opacity-50"
                >
                  {profileSaving ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" /> Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" /> Save Changes
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Tab 2: Security */}
        {activeTab === 'security' && (
          <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/80 dark:border-slate-700/80 p-6 sm:p-8 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1 flex items-center gap-2">
              <Lock className="w-5 h-5 text-blue-600" />
              Change Password
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
              Ensure your account is using a strong, unique password.
            </p>

            {passwordMsg && (
              <div
                className={`p-4 rounded-2xl mb-6 text-sm font-medium flex items-center gap-3 ${
                  passwordMsg.type === 'success'
                    ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800/50'
                    : 'bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400 border border-red-200/60 dark:border-red-800/50'
                }`}
              >
                {passwordMsg.type === 'success' ? (
                  <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-500" />
                ) : (
                  <AlertCircle className="w-5 h-5 shrink-0 text-red-500" />
                )}
                {passwordMsg.text}
              </div>
            )}

            <form onSubmit={handleUpdatePassword} className="space-y-6 max-w-xl">
              {/* Current Password */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                  Current Password
                </label>
                <div className="relative">
                  <Key className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                    placeholder="Enter your current password"
                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm font-medium transition-all"
                  />
                </div>
              </div>

              {/* New Password */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                  New Password
                </label>
                <div className="relative">
                  <Key className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    placeholder="At least 6 characters"
                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm font-medium transition-all"
                  />
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                  Confirm New Password
                </label>
                <div className="relative">
                  <Key className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    placeholder="Re-type new password"
                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm font-medium transition-all"
                  />
                </div>
              </div>

              {/* Save Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={passwordSaving}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md shadow-blue-500/10 transition-all text-sm disabled:opacity-50"
                >
                  {passwordSaving ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" /> Updating Password...
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" /> Update Password
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Tab 3: Activity & Stats */}
        {activeTab === 'stats' && (
          <div className="space-y-6">
            {/* Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-700/80 shadow-sm">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Total Hair Listings
                </span>
                <span className="text-3xl font-extrabold text-blue-600">
                  {fetchingStats ? '...' : userListings.length}
                </span>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                  Hair listings you have submitted
                </p>
              </div>

              <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-700/80 shadow-sm">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Active Approved Listings
                </span>
                <span className="text-3xl font-extrabold text-emerald-600">
                  {fetchingStats ? '...' : activeCount}
                </span>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                  Currently live on marketplace
                </p>
              </div>

              <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-700/80 shadow-sm">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Accumulated Buyers Views
                </span>
                <span className="text-3xl font-extrabold text-cyan-500">
                  {fetchingStats ? '...' : totalViews}
                </span>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                  Total views across all listings
                </p>
              </div>
            </div>

            {/* Quick Actions List */}
            <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/80 dark:border-slate-700/80 p-6 shadow-sm">
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4">
                Account Quick Links
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Link
                  href="/listings/create"
                  className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 hover:bg-blue-50 dark:hover:bg-slate-700/60 border border-slate-200/60 dark:border-slate-700/60 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-600/10 text-blue-600 flex items-center justify-center font-bold">
                      <Plus className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 dark:text-slate-200 text-sm">Post Hair Listing</h4>
                      <p className="text-xs text-slate-400">Sell hair with WhatsApp contact</p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
                </Link>

                <Link
                  href="/dashboard"
                  className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 hover:bg-blue-50 dark:hover:bg-slate-700/60 border border-slate-200/60 dark:border-slate-700/60 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-600/10 text-indigo-600 flex items-center justify-center font-bold">
                      <LayoutDashboard className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 dark:text-slate-200 text-sm">Seller Dashboard</h4>
                      <p className="text-xs text-slate-400">Manage status & delete listings</p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
                </Link>

                {user.role === 'admin' && (
                  <Link
                    href="/admin"
                    className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 hover:bg-emerald-50 dark:hover:bg-slate-700/60 border border-slate-200/60 dark:border-slate-700/60 transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-600/10 text-emerald-600 flex items-center justify-center font-bold">
                        <ShieldCheck className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-800 dark:text-slate-200 text-sm">Admin Panel</h4>
                        <p className="text-xs text-slate-400">Moderate listings & manage users</p>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
                  </Link>
                )}

                <button
                  onClick={logout}
                  className="flex items-center justify-between p-4 rounded-2xl bg-red-50/50 dark:bg-red-950/20 hover:bg-red-100 dark:hover:bg-red-900/40 border border-red-200/60 dark:border-red-900/40 transition-all group text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-red-600/10 text-red-600 flex items-center justify-center font-bold">
                      <LogOut className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-red-600 dark:text-red-400 text-sm">Sign Out</h4>
                      <p className="text-xs text-red-400/80">Log out of your account</p>
                    </div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

