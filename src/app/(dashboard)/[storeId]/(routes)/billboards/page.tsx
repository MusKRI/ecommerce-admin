import { Metadata } from "next";
import { format } from "date-fns";

import BillboardClient from "./_components/client";
import prisma from "@/lib/prisma";
import { BillboardColumn } from "./_components/columns";

export const metadata: Metadata = {
  title: "Billboards",
};

const BillboardsPage = async ({ params }: { params: { storeId: string } }) => {
  const billboards = await prisma.billboard.findMany({
    where: {
      storeId: params.storeId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const formattedBillboards: BillboardColumn[] = billboards.map((item) => {
    return {
      id: item.id,
      label: item.label,
      createdAt: format(item.createdAt, "MMMM do, yyyy"),
    };
  });

  return (
    <div className="flex-col flex">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <BillboardClient data={formattedBillboards} />
      </div>
    </div>
  );
};

export default BillboardsPage;
