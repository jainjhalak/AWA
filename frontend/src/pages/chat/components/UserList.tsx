import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import UsersListSkeleton from "@/skeletons/UserListSkeleton";
import { useChatStore } from "@/stores/useChatStore"
import { AvatarFallback } from "@radix-ui/react-avatar";

const UserList = () => {
    const {users, selectedUser, isLoading, setSelectedUser, onlineUsers} = useChatStore();
  return (
    <div className="border-r border-green-700">
        <div className="flex flex-col h-full">
            <ScrollArea className="h-[calc(100vh-200px)]">
                <div className="space-y-2 p-4">
                    {isLoading ? (
                        <UsersListSkeleton />
                    ) : (
                        users.map((user) => (
                            <div onClick={() => setSelectedUser(user)}
                                 key = {user._id}
                                 className={`flex items-center justfiy-center lg:justify-start gap-3 p-3 rounded-lg cursor-pointer transition-colors text-lime-100
                                    ${selectedUser ?.clerkId === user.clerkId ? "bg-lime-950" : "hover:bg-green-900"}`}>
                                        <div className="relative">
                                            <Avatar className="size-8 md:size-12">
                                                <AvatarImage src={user.imageUrl} />
                                                <AvatarFallback>{user.fullName[0]}</AvatarFallback> 
                                            </Avatar>

                                            {/*online indicator*/}
                                            <div className={`absolute bottom-0 right-0 h-3 w-3 rounded-full ring-2 ring-zinc-900 ${onlineUsers.has(user.clerkId) ? "bg-green-500" : "bg-zinc-500"}`} />
                                        </div>

                                        <div className="flex-1 min-w-0 lg:block hidden">
                                            <span className="font-medium truncate">{user.fullName}</span>
                                        </div>
                                    </div>
                        ))
                    ) }
                </div>
            </ScrollArea>
        </div>
    </div>
  )
}

export default UserList
