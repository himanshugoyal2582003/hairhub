'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ImageUploader from '@/components/ui/ImageUploader';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import { INDIAN_STATES, HAIR_TYPES, CloudinaryUploadResult } from '@/types';
import { Scissors, Loader2, AlertCircle, Sparkles } from 'lucide-react';

export default function CreateListingPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  // Form states
  const [sellerName, setSellerName] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [state, setState] = useState('');
  const [city, setCity] = useState('');
  const [hairLength, setHairLength] = useState('');
  const [hairWeight, setHairWeight] = useState('');
  const [hairType, setHairType] = useState('Straight');
  const [virginHair, setVirginHair] = useState(false);
  const [description, setDescription] = useState('');
  const [uploadedImages, setUploadedImages] = useState<CloudinaryUploadResult[]>([]);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login?redirect=/listings/create');
    } else if (user) {
      setSellerName(user.name || '');
    }
  }, [user, loading, router]);

  const handleUploadComplete = (results: CloudinaryUploadResult[]) => {
    setUploadedImages(results);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!state) {
      setError('Please select an Indian state');
      return;
    }

    if (uploadedImages.length === 0) {
      setError('Please upload at least one image of the hair');
      return;
    }

    setSubmitting(true);

    try {
      await api.listings.create({
        sellerName,
        whatsapp,
        state,
        city,
        hairLength: parseFloat(hairLength),
        hairWeight: parseFloat(hairWeight),
        hairType,
        virginHair,
        description,
        imageUrls: uploadedImages.map((img) => img.url),
        cloudinaryPublicIds: uploadedImages.map((img) => img.publicId),
      });

      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Failed to create listing. Please try again.');
      setSubmitting(false);
    }
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
          <p className="text-sm font-semibold text-slate-500">Checking authentication...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-24">
        <div className="mb-8">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 mb-3">
            <Sparkles className="w-3.5 h-3.5" /> Start Selling
          </span>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
            List Your Human Hair
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm sm:text-base">
            Fill in the details below to list your hair. Your listing will go live immediately on the marketplace.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/15 border border-red-500/30 text-red-200 text-sm flex items-start gap-2.5">
            <AlertCircle className="w-5 h-5 shrink-0 text-red-400" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8 bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-3xl border border-slate-200/60 dark:border-slate-700/60 shadow-sm">
          {/* Photos */}
          <div className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Scissors className="w-5 h-5 text-blue-500" /> Hair Photos
            </h2>
            <p className="text-xs text-slate-400 dark:text-slate-500">
              Upload clear, well-lit photos. Main image is used in browse search results. Max 5 images.
            </p>
            <ImageUploader onUploadComplete={handleUploadComplete} maxFiles={5} />
          </div>

          <hr className="border-slate-100 dark:border-slate-700/50" />

          {/* Seller / Contact Info */}
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Seller Information</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 dark:text-slate-500 mb-1.5">
                  Seller Display Name
                </label>
                <input
                  type="text"
                  required
                  value={sellerName}
                  onChange={(e) => setSellerName(e.target.value)}
                  placeholder="e.g. Priya S."
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/30 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 dark:text-slate-500 mb-1.5">
                  WhatsApp Contact Number
                </label>
                <input
                  type="tel"
                  required
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  placeholder="e.g. +91 9876543210"
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/30 text-sm"
                />
              </div>
            </div>
          </div>

          <hr className="border-slate-100 dark:border-slate-700/50" />

          {/* Location details */}
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Location Details</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 dark:text-slate-500 mb-1.5">
                  State
                </label>
                <select
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  required
                  className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/30 text-sm text-slate-700 dark:text-slate-200"
                >
                  <option value="">Select State</option>
                  {INDIAN_STATES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 dark:text-slate-500 mb-1.5">
                  City / Town
                </label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g. Mumbai"
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/30 text-sm"
                />
              </div>
            </div>
          </div>

          <hr className="border-slate-100 dark:border-slate-700/50" />

          {/* Product description & attributes */}
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Hair Specifications</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 dark:text-slate-500 mb-1.5">
                  Hair Length (inches)
                </label>
                <input
                  type="number"
                  required
                  min="4"
                  max="60"
                  value={hairLength}
                  onChange={(e) => setHairLength(e.target.value)}
                  placeholder="e.g. 18"
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/30 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 dark:text-slate-500 mb-1.5">
                  Hair Weight (grams)
                </label>
                <input
                  type="number"
                  required
                  min="50"
                  max="1000"
                  value={hairWeight}
                  onChange={(e) => setHairWeight(e.target.value)}
                  placeholder="e.g. 120"
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/30 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 dark:text-slate-500 mb-1.5">
                  Hair Type
                </label>
                <select
                  value={hairType}
                  onChange={(e) => setHairType(e.target.value)}
                  required
                  className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/30 text-sm text-slate-700 dark:text-slate-200"
                >
                  {HAIR_TYPES.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="pt-2">
              <label className="flex items-center gap-2.5 text-sm font-semibold text-slate-700 dark:text-slate-300 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={virginHair}
                  onChange={(e) => setVirginHair(e.target.checked)}
                  className="w-4.5 h-4.5 text-blue-600 rounded focus:ring-blue-500/30 border-slate-300"
                />
                Virgin Hair (Natural, raw, never color-treated or permed)
              </label>
            </div>

            <div className="pt-2">
              <label className="block text-xs font-semibold text-slate-400 dark:text-slate-500 mb-1.5">
                Description
              </label>
              <textarea
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your hair condition, color, donor detail, if it's bundled, washed, etc."
                rows={5}
                maxLength={1000}
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/30 text-sm placeholder:text-slate-400"
              />
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 text-white rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-blue-500/10 transition-all hover:scale-[1.01] active:scale-[0.99]"
          >
            {submitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Publishing...
              </>
            ) : (
              'Publish Listing'
            )}
          </button>
        </form>
      </main>

      <Footer />
    </div>
  );
}
