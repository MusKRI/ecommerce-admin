import { Metadata } from "next";
import { redirect } from "next/navigation";

import { userAuth } from "@/lib/user-auth";
import prisma from "@/lib/prisma";
import SettingsForm from "./_components/settings-form";

type SettingsPageProps = {
  params: {
    storeId: string;
  };
};

export const metadata: Metadata = {
  title: "Settings",
};

const SettingsPage = async ({ params }: SettingsPageProps) => {
  const user = await userAuth();

  const userId = user?.userId;

  if (!userId) {
    return redirect("/login");
  }

  const store = await prisma.store.findFirst({
    where: {
      id: params.storeId,
      userId,
    },
  });

  if (!store) {
    return redirect("/");
  }

  return (
    <div className="flex flex-col">
      <div className="flex-1 space-y-4 pt-6 p-8">
        <SettingsForm initialData={store} />
      </div>
    </div>
  );
};

export default SettingsPage;
