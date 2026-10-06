'use client';

import { motion } from 'framer-motion';
import CountUp from 'react-countup';
import { useInView } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import { Users, ListChecks, MapPin, Eye } from 'lucide-react';
import { api } from '@/lib/api';

export default function StatsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [statsData, setStatsData] = useState({
    activeListings: 0,
    activeSellers: 0,
    statesCount: 0,
    totalViews: 0,
  });

  useEffect(() => {
    api.listings
      .getPublicStats()
      .then((data) => {
        if (data) {
          setStatsData({
            activeListings: data.activeListings || 0,
            activeSellers: data.activeSellers || 0,
            statesCount: data.statesCount || 0,
            totalViews: data.totalViews || 0,
          });
        }
      })
      .catch((err) => {
        console.error('Failed to load stats:', err);
      });
  }, []);

  const statsList = [
    { Icon: ListChecks, label: 'Active Listings', value: statsData.activeListings, suffix: '' },
    { Icon: Users, label: 'Verified Sellers', value: statsData.activeSellers, suffix: '' },
    { Icon: MapPin, label: 'Indian States Covered', value: statsData.statesCount, suffix: '' },
    { Icon: Eye, label: 'Total Views', value: statsData.totalViews, suffix: '' },
  ];

  return (
    <section ref={ref} className="py-16 bg-slate-50 dark:bg-slate-900/60 border-y border-slate-200/80 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
          {statsList.map(({ Icon, label, value, suffix }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="flex flex-col items-center gap-3 p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60 shadow-sm"
            >
              <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                <Icon className="w-6 h-6" />
              </div>
              <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
                {isInView ? (
                  <CountUp end={value} duration={2} separator="," />
                ) : (
                  '0'
                )}
                {suffix}
              </div>
              <p className="text-xs sm:text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

