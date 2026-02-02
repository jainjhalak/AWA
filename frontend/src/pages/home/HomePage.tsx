import TopBar from "@/components/TopBar";
import { useMusicStore } from "@/stores/useMusicStore";
import { useEffect } from "react";
import FeaturedSection from "./components/FeaturedSection";
import { ScrollArea } from "@/components/ui/scroll-area";
import SectionGrid from "./components/SectionGrid";
import { usePlayerStore } from "@/stores/usePlayerStore";

const HomePage = () => {

   const { fetchFeaturedSongs, fetchMadeForYouSongs, fetchTrendingSongs,
     isLoading, madeForYouSongs, featuredSongs, trendingSongs } = useMusicStore();

     const {initializeQueue} = usePlayerStore();

     useEffect(() => {
      fetchFeaturedSongs();
      fetchMadeForYouSongs();
      fetchTrendingSongs();
     }, [fetchFeaturedSongs, fetchMadeForYouSongs, fetchMadeForYouSongs]);
     // [] holds dependency array

     useEffect (() => {
      if(madeForYouSongs.length > 0, trendingSongs.length > 0, featuredSongs.length > 0) {
        const allSongs = [...madeForYouSongs, ...featuredSongs, ...trendingSongs];
        initializeQueue(allSongs)
      }
     }, [initializeQueue, madeForYouSongs, featuredSongs, trendingSongs]);
     
  return (
    
    <main className="rounded-md overflow-hidden">
      <TopBar />
      <ScrollArea className="h-[calc(90vh-0px)]">
        <div className="p-4 sm:p-6">
          <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-lime-100">Good Afternoon</h1>
          <FeaturedSection />
        

        <div className="space-y-8 text-lime-100">
          <SectionGrid title="Curated for You" songs={madeForYouSongs} isLoading={isLoading} />
          <SectionGrid title="Trending" songs={trendingSongs} isLoading={isLoading}/>
        </div>
        </div>

      </ScrollArea>
    </main>
  )
  
}

export default HomePage
