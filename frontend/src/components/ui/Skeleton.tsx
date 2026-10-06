export function ListingCardSkeleton() {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 animate-pulse">
      <div className="aspect-[4/3] bg-slate-200 dark:bg-slate-700" />
      <div className="p-4 space-y-3">
        <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded-full w-2/3" />
        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded-full w-3/4" />
        <div className="flex gap-2">
          <div className="h-6 w-14 bg-slate-200 dark:bg-slate-700 rounded-lg" />
          <div className="h-6 w-12 bg-slate-200 dark:bg-slate-700 rounded-lg" />
          <div className="h-6 w-16 bg-slate-200 dark:bg-slate-700 rounded-lg" />
        </div>
        <div className="flex justify-between pt-3 border-t border-slate-100 dark:border-slate-700">
          <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded-full w-24" />
          <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded-full w-16" />
        </div>
      </div>
    </div>
  );
}

export function ListingsGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
      {Array.from({ length: count }).map((_, i) => (
        <ListingCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function TextSkeleton({ className }: { className?: string }) {
  return <div className={`animate-pulse bg-slate-200 dark:bg-slate-700 rounded-full ${className}`} />;
}

export default function Skeleton({ className }: { className?: string }) {
  return <div className={`animate-pulse bg-slate-200 dark:bg-slate-700 rounded-full ${className}`} />;
}

