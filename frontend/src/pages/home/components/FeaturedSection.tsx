import FeaturedGridSkeleton from "@/skeletons/FeaturedGridSkeleton";
import { useMusicStore } from "@/stores/useMusicStore"
import PlayButton from "./PlayButton";

const FeaturedSection = () => {
     
    const { isLoading, featuredSongs } = useMusicStore();

    if (isLoading) return <FeaturedGridSkeleton />

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
      
      {featuredSongs.map((song) => (
        <div key={song._id}
             className="flex items-center bg-lime-950 rounded-md overflow-hidden hover:bg-green-900 transition-colors group cursor-pointer relative">

             <img src={song.imageUrl} alt="song.title" className="w-16 sm:w-20 sm: h-20 object-cover shrink-0" />

             <div className="flex-1 p-4">
                <p className="font-medium truncate text-lime-100">{song.title}</p>
                <p className="text-sm text-lime-300 truncate">{song.artist}</p>
             </div>

             <PlayButton song={song} />
         </div>  
      ))}

    </div>
  )
}

export default FeaturedSection
