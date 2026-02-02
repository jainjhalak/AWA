import { SignedOut, UserButton } from "@clerk/clerk-react";
import { LayoutDashboardIcon } from "lucide-react";
import { Link } from "react-router-dom";
import SignInOAuthButtons from "./SignInOAuthButtons";
import { useAuthStore } from "@/stores/useAuthStore";
import { buttonVariants } from "./ui/button";
import { cn } from "@/lib/utils";

const TopBar = () => {
    const { isAdmin } = useAuthStore()
    console.log({ isAdmin });

  return (
    <div className="flex items-center justify-between p-2 sticky top-0 bg-lime-950 backdrop-blur-md z-10">
      <div className="flex items-center text-lime-100">
        <img src="/AWA.png" className="size-17 pt-3" alt="AWA logo" />
        AWA
      </div>
      <div className="flex items-center gap-2">
        {isAdmin && (
            <Link to={"/admin"} 
            className={cn(
              buttonVariants({variant:"outline",
              className:"hover:bg-green-900! text-lime-100"
              })
            )}>
                <LayoutDashboardIcon className="size-4 mr-2" /> 
                Admin Dashboard
            </Link>
        )}

        <SignedOut>
            <SignInOAuthButtons />
        </SignedOut>

        <UserButton />
      </div>
    </div>
  )
}

export default TopBar
