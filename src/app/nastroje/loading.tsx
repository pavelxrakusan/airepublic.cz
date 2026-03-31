export default function NastrojeLoading() {
  return (
    <div className="mx-auto max-w-5xl px-6 pt-24 pb-16">
      <div className="mb-12">
        <div className="mb-4 h-10 w-40 animate-pulse rounded-lg bg-border" />
        <div className="h-6 w-72 animate-pulse rounded-lg bg-border" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {Array.from({ length: 6 }, (_, i) => (
          <div key={i} className="rounded-lg border border-border bg-card p-6">
            <div className="mb-3 flex justify-between">
              <div className="h-5 w-20 animate-pulse rounded-full bg-border" />
              <div className="flex gap-1">
                {Array.from({ length: 5 }, (__, j) => (
                  <div key={j} className="h-4 w-4 animate-pulse rounded bg-border" />
                ))}
              </div>
            </div>
            <div className="mb-2 h-6 w-2/3 animate-pulse rounded bg-border" />
            <div className="mb-4 h-4 w-full animate-pulse rounded bg-border" />
            <div className="h-3 w-24 animate-pulse rounded bg-border" />
          </div>
        ))}
      </div>
    </div>
  )
}
