export default function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="w-10 h-10 border-3 border-dark-700 border-t-accent rounded-full animate-spin" />
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="flex-shrink-0 w-[150px] sm:w-[170px] md:w-[185px]">
      <div className="aspect-[2/3] bg-dark-800 rounded-lg animate-pulse" />
    </div>
  );
}

export function RowSkeleton({ count = 8 }: { count?: number }) {
  return (
    <section className="mb-8">
      <div className="h-7 w-48 bg-dark-800 rounded animate-pulse mx-4 sm:mx-6 lg:mx-8 mb-3" />
      <div className="flex gap-3 overflow-hidden px-4 sm:px-6 lg:px-8">
        {Array.from({ length: count }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    </section>
  );
}

export function DetailSkeleton() {
  return (
    <div className="pt-16">
      <div className="h-[50vh] bg-dark-800 animate-pulse" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-4">
        <div className="h-10 w-96 bg-dark-800 rounded animate-pulse" />
        <div className="h-4 w-64 bg-dark-800 rounded animate-pulse" />
        <div className="h-20 w-full max-w-2xl bg-dark-800 rounded animate-pulse" />
      </div>
    </div>
  );
}
