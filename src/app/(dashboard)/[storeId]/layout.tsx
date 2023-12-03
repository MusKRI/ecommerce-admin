import { redirect } from "next/navigation";

import prisma from "@/lib/prisma";
import { userAuth } from "@/lib/user-auth";

import Navbar from "@/components/navbar/navbar";

export default async function DashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { storeId: string };
}) {
  const user = await userAuth();

  const userId = user?.userId;

  const store = await prisma.store.findFirst({
    where: {
      id: params.storeId,
      userId,
    },
  });

  if (!store) {
    redirect("/");
  }

  return (
    <>
      <Navbar />
      {children}
    </>
  );
}
