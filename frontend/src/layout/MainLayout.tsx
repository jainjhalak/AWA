import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { Outlet } from "react-router-dom";
import LeftSidebar from "./components/LeftSidebar";
import FriendActivity from "./components/FriendActivity";
import { ScrollArea } from "@/components/ui/scroll-area";
import AudioPlayer from "./components/AudioPlayer";
import { PlaybackControl } from "./components/PlaybackControl";
import { useEffect, useState } from "react";


const MainLayout = () => {
  const [isMobile, setIsMobile] = useState (false);

  useEffect (() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, [isMobile, setIsMobile]);

  return (
    <div className="h-screen bg-black text-white flex flex-col">
      <ResizablePanelGroup direction="horizontal" className="flex-1 flex h-full overflow-hidden p-2">

        <AudioPlayer />

        {/* left sidebar */}
        <ResizablePanel defaultSize={20} minSize={isMobile ? 0:10} maxSize={30}>
          <LeftSidebar />
        </ResizablePanel>

        <ResizableHandle className="w-2 bg-black rounded-lg transition-colors"/>

        {/* Main content */}
        <ResizablePanel defaultSize={isMobile ? 80:60}>
          <ScrollArea className='h-[calc(100vh-100px)]'>
            <Outlet />
          </ScrollArea>
        </ResizablePanel>

        {!isMobile && (
          <>
          <ResizableHandle />

            <ResizablePanel defaultSize={20} minSize={0} maxSize={25} collapsedSize={0}>
              <FriendActivity />
            </ResizablePanel>
          </>
        )}
      </ResizablePanelGroup>

      <PlaybackControl />

    </div>
  )
}

export default MainLayout
