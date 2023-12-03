import type { Metadata } from "next";

import prisma from "@/lib/prisma";
import BillboardForm from "./_components/billboard-form";

type GenerateMetaDataProps = {
  params: {
    billboardId: string;
  };
};

export async function generateMetadata({ params }: GenerateMetaDataProps) {
  const { billboardId } = params;

  return {
    title: billboardId === "new" ? "New Billboard" : "Edit Billboard",
  };
}

const BillboardPage = async ({
  params,
}: {
  params: { billboardId: string };
}) => {
  let billboard =
    params.billboardId === "new"
      ? null
      : await prisma.billboard.findUnique({
          where: {
            id: params.billboardId,
          },
        });

  return (
    <div className="flex flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <BillboardForm initialData={billboard} />
      </div>
    </div>
  );
};

export default BillboardPage;
