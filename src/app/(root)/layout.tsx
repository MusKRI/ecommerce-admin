import { userAuth } from "@/lib/user-auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function SetupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await userAuth();

  const userId = user?.userId;

  const store = await prisma.store.findFirst({
    where: {
      userId,
    },
  });

  if (store) {
    redirect(`/${store.id}`);
  }

  return <>{children}</>;
}
