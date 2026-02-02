import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useChatStore } from "@/stores/useChatStore"
import { useUser } from "@clerk/clerk-react";
import { Headphones, Music, User } from "lucide-react";
import { useEffect } from "react";

const FriendActivity = () => {

  const { users, fetchUsers, onlineUsers } = useChatStore();
  const  userActivities  = useChatStore(state => state.userActivities)
  const { user } = useUser();
  
  useEffect(() => {
    if (user) fetchUsers();
  }, [fetchUsers, user]);



  return (
    <div className="h-full bg-lime-950 rounded-md flex flex-col ml-2">
        <div className="p-4 flex justify-between items-center border-b border-lime-700">
            <div className="flex items-center gap-2">
                <User className="size-5 shrink-0" />
                <h2 className="font-semibold text-lime-100">What they're listening to</h2>
            </div>
        </div>
        
        {!user && <LoginPrompt />}

        <ScrollArea className="flex-1">
            <div className="p-4 space-y-4">
                {users.map((user) => {

                    const activity = userActivities.get(user.clerkId);
                    const isPlaying = activity && activity !== "Idle";

                    return(
                   <div key={user._id} 
                        className="cursor-pointer hover:bg-green-900 p-3 rounded-md transition-colors group">
                            <div className="flex items-start gap-3">
                                <div className="relative">
                                    <Avatar className="size-10 border border-lime-800">
                                        <AvatarImage
                                           src={user.imageUrl}
                                           alt={user.fullName}
                                        />

                                        <AvatarFallback>{user.fullName[0]}</AvatarFallback>
                                    </Avatar>

                                    <div className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-zinc-800 ${onlineUsers.has(user.clerkId) ? "bg-green-500" : "bg-zinc-500"}`} 
                                         aria-hidden='true' />
                                </div>
                                
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <span className="font-medium text-sm text-lime-100">{user.fullName}</span>
                                           {isPlaying && <Music className="size-3.5 text-lime-600 shrink-0" />}
                                    </div>

                                    {isPlaying ? (
                                        <div className="mt-1">
                                            <div className="mt-1 text-sm text-lime-600 font-medium truncate">
                                                {activity.replace("Playing ", "").split ("by") [0]}
                                            </div>

                                            <div className="text-xs text-lime-600 truncate">
                                                {activity.split(" by ") [1]}
                                            </div>

                                        </div>
                                    ) : ( 
                                        <div className="mt-1 text-xs text-lime-300">Idle</div>
                                    )}
                                    
                                </div>
                            </div>
                        </div>

                )}
            )}
            </div>
        </ScrollArea>
    </div>
  )
}

export default FriendActivity

const LoginPrompt = () => (
    <div className="h-full flex flex-col items-center justify-center p-6 text-center space-y-4">
        <div className="relative">
            <div className="absolute -inset-1 bg-linear-to-r from-emerald-500 to-sky-500 rounded-full blur-lg opacity-75 animate-pulse"
                 aria-hidden="true" />

            <div className="relative bg-zinc-900 rounded-full p-4">
                <Headphones className=" size-8 text-emerald-500" />
            </div>
        </div>

        <div className="space-y-2 max-w-[250px">
            <h3 className="text-lg font-semibold text-white">See what your friends are playing</h3>
            <p className="text-sm text-zinc-400">Login to discover what music your friends are enjoying right now</p>
        </div>
    </div>
);
