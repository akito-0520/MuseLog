export default function ActressesLoading() {
  return (
    <div className="min-h-screen bg-[#0a1a1a] text-white">
      {/* ヘッダースケルトン */}
      <div className="px-4 pt-12 pb-3">
        <div className="flex items-center justify-between mb-4">
          <div className="h-7 w-36 rounded-lg bg-[#1a2e2e] animate-pulse" />
          <div className="h-8 w-8 rounded-lg bg-[#1a2e2e] animate-pulse" />
        </div>
        <div className="h-10 w-full rounded-xl bg-[#1a2e2e] animate-pulse mb-3" />
        <div className="flex gap-2">
          {[80, 64, 52, 80].map((w, i) => (
            <div
              key={i}
              className="h-8 rounded-full bg-[#1a2e2e] animate-pulse shrink-0"
              style={{ width: w }}
            />
          ))}
        </div>
      </div>

      {/* グリッドスケルトン */}
      <div className="px-4 py-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex flex-col gap-2">
            <div className="w-full aspect-[2/3] rounded-xl bg-[#1a2e2e] animate-pulse" />
            <div className="flex flex-col gap-1.5 px-0.5">
              <div className="h-4 w-3/4 rounded bg-[#1a2e2e] animate-pulse" />
              <div className="h-3 w-1/2 rounded bg-[#1a2e2e] animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
