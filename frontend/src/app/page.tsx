'use client';

import React, { useEffect, useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import HeroSection from '@/components/home/HeroSection';
import StatsSection from '@/components/home/StatsSection';
import HowItWorks from '@/components/home/HowItWorks';
import ListingCard from '@/components/listings/ListingCard';
import Skeleton from '@/components/ui/Skeleton';
import { api } from '@/lib/api';
import { IListing } from '@/types';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Sparkles, HelpCircle, ArrowRight } from 'lucide-react';

export default function Home() {
  const [featured, setFeatured] = useState<IListing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const data = await api.listings.list({ limit: 4 });
        setFeatured(data.listings || []);
      } catch (err) {
        console.error('Error fetching featured listings:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  const testimonials = [
    {
      quote: "I sold my virgin hair within 3 days of listing. The buyer connected via WhatsApp, and the process was super smooth!",
      author: "Priya Sharma",
      role: "Verified Seller",
      city: "Mumbai, Maharashtra",
      avatar: "P"
    },
    {
      quote: "As a wig maker, finding genuine virgin hair in India was hard. HairHub lets me find premium local hair directly from sources.",
      author: "Rajesh Kumar",
      role: "Professional Buyer",
      city: "Delhi, NCR",
      avatar: "R"
    },
    {
      quote: "Extremely simple platform. Set up my listing, got two WhatsApp inquiries the next day, and finalized a great deal.",
      author: "Deepika Patel",
      role: "Verified Seller",
      city: "Ahmedabad, Gujarat",
      avatar: "D"
    }
  ];

  const faqs = [
    {
      question: "Is listing hair on HairHub India free?",
      answer: "Yes, it is completely free to create an account and list your human hair for sale. We do not charge listing fees or commissions."
    },
    {
      question: "How do buyers contact me?",
      answer: "Buyers can click the 'Contact Seller' button on your listing, which opens a direct WhatsApp chat with you containing the listing details."
    },
    {
      question: "Who handles payment and shipping?",
      answer: "HairHub India is a directory. You negotiate payment methods (like UPI or cash) and shipping directly with the buyer."
    },
    {
      question: "What type of hair can I sell?",
      answer: "You can list clean human hair of various lengths (usually 8+ inches is preferred), hair types (straight, wavy, curly), and virgin hair."
    }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <HeroSection />

        {/* Stats Section */}
        <StatsSection />

        {/* Featured Listings Section */}
        <section className="py-24 bg-white dark:bg-slate-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
              <div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 mb-3">
                  <Sparkles className="w-3.5 h-3.5" /> Recent Listings
                </span>
                <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
                  Featured Human Hair
                </h2>
                <p className="text-slate-500 dark:text-slate-400 mt-2">
                  Browse the latest verified premium hair listings from sellers near you.
                </p>
              </div>
              <Link
                href="/listings"
                className="mt-4 md:mt-0 inline-flex items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 group"
              >
                View all listings
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="space-y-4">
                    <Skeleton className="aspect-square w-full rounded-2xl" />
                    <Skeleton className="h-4 w-2/3" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                ))}
              </div>
            ) : featured.length === 0 ? (
              <div className="text-center py-12 bg-slate-50 dark:bg-slate-800/30 rounded-2xl border border-slate-100 dark:border-slate-800">
                <p className="text-slate-500 dark:text-slate-400">No active listings found. Be the first to post!</p>
                <Link href="/listings/create" className="mt-4 inline-block px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium text-sm">
                  Create Listing
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {featured.map((listing) => (
                  <ListingCard key={listing._id} listing={listing} />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* How It Works Section */}
        <HowItWorks />

        {/* Testimonials Section */}
        <section className="py-24 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800/40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <span className="inline-block px-4 py-1.5 rounded-full text-sm font-medium bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 mb-4">
                User Reviews
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">
                What Our Users Say
              </h2>
              <p className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto text-lg">
                Read real stories from genuine sellers and buyers on our directory.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((t, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className="p-8 rounded-3xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 flex flex-col justify-between"
                >
                  <p className="text-slate-600 dark:text-slate-300 italic mb-6 leading-relaxed">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold text-sm">
                      {t.avatar}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">{t.author}</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{t.role} &bull; {t.city}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-24 bg-slate-50 dark:bg-slate-900/30 border-t border-slate-100 dark:border-slate-800/40">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 mb-3">
                <HelpCircle className="w-3.5 h-3.5" /> F.A.Q
              </span>
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
                Frequently Asked Questions
              </h2>
            </div>

            <div className="space-y-6">
              {faqs.map((faq, idx) => (
                <div key={idx} className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60 shadow-sm">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">{faq.question}</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-blue-50 via-indigo-50 to-slate-50 dark:from-slate-900 dark:via-blue-950 dark:to-slate-900 text-center relative overflow-hidden border-t border-b border-slate-200/80 dark:border-slate-800">
          <div className="absolute inset-0 opacity-[0.04]" style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, #0f172a 1px, transparent 0)',
            backgroundSize: '24px 24px'
          }} />
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mb-4">Ready to Sell or Buy Human Hair?</h2>
            <p className="text-slate-600 dark:text-slate-300 max-w-xl mx-auto mb-8 text-base sm:text-lg">
              Create your account in seconds, browse listings, or post your first listing for free today!
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/auth/register" className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold bg-blue-600 hover:bg-blue-700 text-white transition-all shadow-lg shadow-blue-600/20 hover:scale-[1.01] active:scale-[0.99]">
                Get Started Now
              </Link>
              <Link href="/listings" className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all">
                Browse Hair
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
