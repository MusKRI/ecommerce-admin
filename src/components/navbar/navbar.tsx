import { redirect } from "next/navigation";

import prisma from "@/lib/prisma";

import UserButton from "../profile-components/user-button/UserButton";
import StoreSwitcher from "../store-switcher/store-switcher";
import MainNav from "./main-nav";
import { userAuth } from "@/lib/user-auth";

const Navbar = async () => {
  const user = await userAuth();

  const userId = user?.userId;

  if (!userId) {
    return redirect("/login");
  }

  const stores = await prisma.store.findMany({
    where: {
      userId,
    },
  });

  return (
    <div className="border-b">
      <div className="flex h-16 items-center px-4">
        <StoreSwitcher items={stores} />
        <MainNav className="mx-6" />
        <div className="ml-auto flex items-center space-x-4">
          <UserButton afterSignOutUrl="/login" />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
