export default function CheckoutSkeleton() {
  return (
    <div className="grid gap-8 lg:grid-cols-5 animate-pulse" aria-busy="true" aria-label="Loading checkout">
      <div className="space-y-6 lg:col-span-3">
        <div className="h-8 w-48 rounded-lg bg-black/5" />
        <div className="rounded-2xl border border-white/60 bg-white/40 p-6 shadow-sm">
          <div className="h-6 w-32 rounded bg-black/5" />
          <div className="mt-4 space-y-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-4 w-full rounded bg-black/5" />
            ))}
          </div>
        </div>
        <div className="rounded-2xl border border-white/60 bg-white/40 p-6 shadow-sm">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="h-32 rounded-xl bg-black/5" />
            <div className="h-32 rounded-xl bg-black/5" />
          </div>
        </div>
      </div>
      <div className="lg:col-span-2">
        <div className="rounded-2xl border border-white/60 bg-white/40 p-6 shadow-sm">
          <div className="h-6 w-36 rounded bg-black/5" />
          <div className="mt-6 space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex justify-between">
                <div className="h-4 w-24 rounded bg-black/5" />
                <div className="h-4 w-16 rounded bg-black/5" />
              </div>
            ))}
          </div>
          <div className="mt-8 h-12 w-full rounded-full bg-black/5" />
        </div>
      </div>
    </div>
  );
}
