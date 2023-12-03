import { Metadata } from "next";
import { format } from "date-fns";

import ColorClient from "./_components/client";
import prisma from "@/lib/prisma";
import { ColorColumn } from "./_components/columns";

export const metadata: Metadata = {
  title: "Colors",
};

const ColorsPage = async ({ params }: { params: { storeId: string } }) => {
  const colors = await prisma.color.findMany({
    where: {
      storeId: params.storeId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const formattedColors: ColorColumn[] = colors.map((item) => {
    return {
      id: item.id,
      name: item.name,
      value: item.value,
      createdAt: format(item.createdAt, "MMMM do, yyyy"),
    };
  });

  return (
    <div className="flex-col flex">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ColorClient data={formattedColors} />
      </div>
    </div>
  );
};

export default ColorsPage;
