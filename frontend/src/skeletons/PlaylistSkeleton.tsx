const PlaylistSkeleton = () => {
    return Array.from ({length: 5}).map((_, i) => (
        <div key={i} className="p-2 rounded-md flex items-center gap-3">
            <div className="w-12 h-12 bg-zinc-800 rounded-md shrink-0 animate-pulse" />
            <div className="flex-1 min-w-0 md-block hidden space-y-2">
                <div className="h-4 bg-zinc-800 rounded animate-pulse w-3/4" />
                <div className="h-3 bg-zinc-800 rounded animate-pulse w-1/2" />
            </div>
        </div>
    ))
  return (
    <div>
      
    </div>
  );
}

export default PlaylistSkeleton
