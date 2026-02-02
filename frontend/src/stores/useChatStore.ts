import { axiosInstance } from "@/lib/axios";
import type { Message, User } from "@/types";
import {create} from "zustand";
import { io } from "socket.io-client";

interface ChatStore {
    //types
    users: any[];
    isLoading: boolean;
    error: string | null;
    socket: any;
    isConnected: boolean;
    onlineUsers: Set<string>; // array, set of strings.
    userActivities: Map<string, string>; // map of string to string, key will be string and value will be string
    message: Message[];
    selectedUser: User | null;

    //functions
    fetchUsers: () => Promise<void>;
    initSocket: (userId: string) => void;
    disconnectedSocket: () => void;
    sendMessage: (receiverId: string, senderId: string, content: string) => void;
    fetchMessages: (userId: string) => Promise<void>;
    setSelectedUser: (user: User | null) => void;
}

// connecting to the socket server that we created 
const baseURL = import.meta.env.MODE === "development" ? "http://localhost:5000/" : "/"

const socket = io(baseURL, {
    autoConnect: false, // only connect if user is authenticated
    withCredentials: true,
})

export const useChatStore = create<ChatStore>( (set, get) => ({
    //states
    users: [],
    isLoading: false,
    error: null,
    socket: socket,
    isConnected: false,
    onlineUsers: new Set(),
    userActivities: new Map(),
    message: [],
    selectedUser: null,
    
    setSelectedUser: (user) => set({ selectedUser: user }),

    initSocket: (userId: string) => {
        if(!get().isConnected) {
            socket.auth = {userId}
            socket.connect();
            socket.emit("user_connected", userId);

            socket.on("users_online", (users: string[]) => {
                set({ onlineUsers: new Set(users) });
            });
                    // event name    data coming from server
            socket.on("activities", (activities: Record<string, string>) => {
                set({userActivities: new Map(Object.entries(activities))});
            });
                     // event name      // data coming from server 
            socket.on("user_connected", (userId: string) => {
                set((state) => ({
                    onlineUsers: new Set([...state.onlineUsers, userId]),
                }));
            });
                      // event name        data coming from server 
            socket.on("user_disconnected", (userId: string) => {
                set((state) => {
                    const newOnlineUsers = new Set(state.onlineUsers);
                    newOnlineUsers.delete(userId);
                    return {onlineUsers: newOnlineUsers};
                });
            });
                     // listen for this event 
            socket.on("receive_message", (message: Message) => {
                set((state) => ({
                    message: [...state.message, message] // update the message array with very last message
                }));
            });

            socket.on("message_sent", (message: Message) => {
                set((state) => ({
                    message: [...state.message, message]
                }));
            });
                  // listen for this event get userId and whatever activity they are doing
            socket.on(("activity_update"), ({userId, activity}) => {
                set((state) => {
                    const newActivities = new Map(state.userActivities);
                    newActivities.set(userId, activity);
                    return { userActivities: newActivities };
                });
            });

            set({ isConnected: true });
        }
    },

    disconnectedSocket: () => {
        if(get().isConnected)
        socket.disconnect();
        set({ isConnected: false});
    },

    sendMessage: (receiverId, senderId, content) => {
        const socket = get().socket;
        if(!socket) return;

        socket.emit("send_message", {receiverId, senderId, content})
    },

    fetchMessages: async (userId: string) => {
        set ({isLoading: true, error: null});
        try {
           const response =  await axiosInstance.get(`/users/messages/${userId}`);
           set ({message: response.data})
        } catch (error: any) {
            set ({error: error.response.data.message})
        } finally {
            set ({isLoading: false})
        }
    },

    fetchUsers: async() => {
        set({ isLoading: true, error: null });
        try {  
            const response = await axiosInstance.get("users");
            set({ users: response.data });
        } catch (error: any) {
            set({ error: error.response.data.message });
        } finally {
            set({ isLoading: false});
        }
    },

    
}))