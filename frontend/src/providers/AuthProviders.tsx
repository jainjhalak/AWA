import { axiosInstance } from "@/lib/axios"
import { useAuthStore } from "@/stores/useAuthStore"
import { useChatStore } from "@/stores/useChatStore"
import { useAuth } from "@clerk/clerk-react"
import { useEffect, useState } from "react"

const updateApiToken = (token:string | null) => {
  if(token) {
    axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`
  } else {
    delete axiosInstance.defaults.headers.common['Authorization'];
  }
}

const AuthProviders = ({ children } : {children: React.ReactNode}) => {
    const {getToken, userId} = useAuth();
    const [loading,setLoading] = useState(true);
    const { checkAdminStatus } = useAuthStore();
    const {initSocket, disconnectedSocket} = useChatStore();

    useEffect (() => {
        const initAuth = async () => {
            try {
                const token = await getToken()
                updateApiToken(token);

                if(token) {
                  await checkAdminStatus();

                  // init socket
                  if(userId) initSocket(userId)
                }

            } catch (error) {
                updateApiToken(null);
                console.log("error in auth provider")
            } finally {
                setLoading(false);
            }
        };

        initAuth();

        // cleanup function
        return () => disconnectedSocket();
    }, [getToken, userId, checkAdminStatus, initSocket, disconnectedSocket]);

    if (loading) return (
        <div className="h-screen w-full flex items-center justify-center">
            <img src='\ghibli_4.gif'
               alt="loading"/>

        </div>
    )
  return (
    <div>
      {children}
    </div>
  )
}

export default AuthProviders
