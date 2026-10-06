'use client';

import { motion } from 'framer-motion';
import { UserPlus, Camera, MessageCircle, CheckCircle } from 'lucide-react';

const steps = [
  {
    Icon: UserPlus,
    step: '01',
    title: 'Create Free Account',
    desc: 'Sign up in seconds with email or Google. No credit card needed.',
    color: 'from-blue-500 to-blue-600',
    bg: 'bg-blue-50 dark:bg-blue-900/20',
  },
  {
    Icon: Camera,
    step: '02',
    title: 'List Your Hair',
    desc: 'Upload photos, add details like length, type, and location. Free to list.',
    color: 'from-cyan-500 to-cyan-600',
    bg: 'bg-cyan-50 dark:bg-cyan-900/20',
  },
  {
    Icon: MessageCircle,
    step: '03',
    title: 'Buyers Contact You',
    desc: 'Interested buyers reach out directly via WhatsApp. No middleman.',
    color: 'from-emerald-500 to-emerald-600',
    bg: 'bg-emerald-50 dark:bg-emerald-900/20',
  },
  {
    Icon: CheckCircle,
    step: '04',
    title: 'Complete the Deal',
    desc: 'Negotiate directly. Handle payment and delivery on your own terms.',
    color: 'from-purple-500 to-purple-600',
    bg: 'bg-purple-50 dark:bg-purple-900/20',
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 bg-slate-50 dark:bg-slate-900/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full text-sm font-medium bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 mb-4">
            Simple Process
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            How HairHub India Works
          </h2>
          <p className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto text-lg">
            List your hair in minutes and connect with thousands of buyers across India.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map(({ Icon, step, title, desc, color, bg }, i) => (
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className={`relative p-6 rounded-2xl ${bg} border border-white dark:border-slate-700/50 group`}
            >
              {/* Connector line */}
              {i < steps.length - 1 && (
                <div className="hidden lg:block absolute top-10 left-full w-8 h-0.5 bg-slate-200 dark:bg-slate-700 z-0" />
              )}

              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center shadow-md mb-4 group-hover:scale-110 transition-transform duration-300`}>
                <Icon className="w-6 h-6 text-white" />
              </div>

              <span className="text-xs font-bold text-slate-400 dark:text-slate-500 tracking-widest mb-2 block">
                STEP {step}
              </span>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">{title}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
