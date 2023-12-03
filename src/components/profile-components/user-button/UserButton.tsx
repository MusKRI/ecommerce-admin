"use client";

// **** Library Imports ****
import { useSession, signOut } from "next-auth/react";
import { LogOut } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

// **** Local Imports ****
// ui
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover/popover";

const UserButton = ({ afterSignOutUrl }: { afterSignOutUrl: string }) => {
  const router = useRouter();
  const session = useSession();
  const { data } = session;

  const [isOpen, setIsOpen] = useState(false);

  const handleSignOut = async () => {
    setIsOpen(false);
    const signoutToast = toast.loading("Wait...");

    const data = await signOut({
      callbackUrl: afterSignOutUrl,
      redirect: false,
    });

    router.push(data.url);
    toast.dismiss(signoutToast);
    toast.success("Signed out!");
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <div className="w-10 h-10 border flex items-center justify-center cursor-pointer rounded-full bg-border font-semibold">
          {data?.user?.username.charAt(0)}
        </div>
      </PopoverTrigger>
      <PopoverContent className="mr-2">
        <div className="flex flex-col gap-1">
          <div className="flex flex-row items-center gap-2 py-2">
            <div className="w-12 h-12 border flex items-center justify-center rounded-full bg-border font-semibold">
              {data?.user?.username.charAt(0)}
            </div>
            <div className="flex flex-col">
              <h3 className="text-sm font-bold">{data?.user?.username}</h3>
              <p className="text-sm text-slate-500">{data?.user?.email}</p>
            </div>
          </div>

          <div className="h-[1px] border-t" />

          <div
            className="flex flex-row items-center gap-6 py-2 px-1 cursor-pointer hover:bg-slate-100 rounded-lg transition duration-200"
            onClick={handleSignOut}
          >
            <LogOut className="w-4 h-4" />
            <p className="text-sm">Sign out</p>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default UserButton;
