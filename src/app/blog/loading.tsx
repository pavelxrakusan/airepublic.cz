export default function BlogLoading() {
  return (
    <div className="mx-auto max-w-5xl px-6 pt-24 pb-16">
      <div className="mb-12">
        <div className="mb-4 h-10 w-32 animate-pulse rounded-lg bg-border" />
        <div className="h-6 w-64 animate-pulse rounded-lg bg-border" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {Array.from({ length: 4 }, (_, i) => (
          <div key={i} className="rounded-lg border border-border bg-card p-6">
            <div className="mb-3 flex gap-3">
              <div className="h-4 w-24 animate-pulse rounded bg-border" />
              <div className="h-4 w-16 animate-pulse rounded bg-border" />
            </div>
            <div className="mb-2 h-6 w-3/4 animate-pulse rounded bg-border" />
            <div className="h-4 w-full animate-pulse rounded bg-border" />
            <div className="mt-1 h-4 w-2/3 animate-pulse rounded bg-border" />
          </div>
        ))}
      </div>
    </div>
  )
}
