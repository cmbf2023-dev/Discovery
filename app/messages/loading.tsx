export default function MessagesLoading() {
  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header Skeleton */}
      <header className="bg-white border-b px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gray-200 rounded animate-pulse"></div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-gray-200 rounded animate-pulse"></div>
            <div className="w-20 h-6 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>
      </header>

      {/* Search Skeleton */}
      <div className="bg-white border-b px-4 py-3">
        <div className="w-full h-10 bg-gray-200 rounded animate-pulse"></div>
      </div>

      {/* Tabs Skeleton */}
      <div className="bg-white border-b">
        <div className="grid grid-cols-3 gap-4 p-4">
          <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </div>

      {/* Messages Skeleton */}
      <main className="flex-1 overflow-y-auto p-4 space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg p-4 shadow">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 bg-gray-200 rounded-full animate-pulse"></div>
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-24 h-4 bg-gray-200 rounded animate-pulse"></div>
                  <div className="w-12 h-4 bg-gray-200 rounded animate-pulse"></div>
                </div>
                <div className="w-full h-4 bg-gray-200 rounded animate-pulse"></div>
                <div className="w-3/4 h-4 bg-gray-200 rounded animate-pulse"></div>
                <div className="w-32 h-3 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>
          </div>
        ))}
      </main>
    </div>
  )
}
