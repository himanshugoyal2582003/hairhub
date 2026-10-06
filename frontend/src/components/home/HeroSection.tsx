'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Sparkles, Shield, Users } from 'lucide-react';
import SearchBar from '@/components/ui/SearchBar';

export default function HeroSection() {
  return (
    <section className="relative min-h-[85vh] flex items-center overflow-hidden bg-white dark:bg-slate-900">
      {/* Light subtle glow elements */}
      <div className="absolute top-1/4 -left-24 w-96 h-96 bg-blue-100/60 dark:bg-blue-900/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 -right-24 w-96 h-96 bg-cyan-100/50 dark:bg-cyan-900/20 rounded-full blur-3xl animate-pulse [animation-delay:1.5s]" />
      <div className="absolute top-3/4 left-1/3 w-64 h-64 bg-indigo-100/40 dark:bg-purple-900/10 rounded-full blur-3xl animate-pulse [animation-delay:3s]" />

      {/* Grid pattern */}
      <div className="absolute inset-0 opacity-[0.04] dark:opacity-[0.03]" style={{
        backgroundImage: 'linear-gradient(#0f172a 1px, transparent 1px), linear-gradient(90deg, #0f172a 1px, transparent 1px)',
        backgroundSize: '60px 60px'
      }} />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 text-sm font-medium mb-8 shadow-sm"
        >
          <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          India&apos;s Trusted Human Hair Marketplace
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-slate-900 dark:text-white mb-6 leading-[1.1] tracking-tight"
        >
          Buy & Sell{' '}
          <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 bg-clip-text text-transparent">
            Human Hair
          </span>
          <br />Across India
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed font-normal"
        >
          Connect directly with verified sellers. Browse thousands of listings for 
          natural, virgin, and premium human hair from across every state in India.
        </motion.p>

        {/* Search bar */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="max-w-2xl mx-auto mb-10"
        >
          <SearchBar large />
        </motion.div>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            href="/listings"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-bold text-base bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            Browse Listings
            <ArrowRight className="w-5 h-5" />
          </Link>
          <Link
            href="/listings/create"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-bold text-base bg-slate-100 hover:bg-slate-200 text-slate-900 border border-slate-200/80 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-white dark:border-slate-700 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            Sell Your Hair
          </Link>
        </motion.div>

        {/* Trust badges */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-6 mt-16 pt-10 border-t border-slate-200/80 dark:border-slate-800"
        >
          {[
            { Icon: Users, label: '10,000+ Sellers', desc: 'Verified sellers nationwide' },
            { Icon: Shield, label: 'Safe & Trusted', desc: 'Verified listings only' },
            { Icon: Sparkles, label: 'Free to List', desc: 'No commission charged' },
          ].map(({ Icon, label, desc }) => (
            <div key={label} className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-800 flex items-center justify-center">
                <Icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="text-left">
                <p className="text-sm font-bold text-slate-900 dark:text-white">{label}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{desc}</p>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
