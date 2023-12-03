import prisma from "@/lib/prisma";
import SizeForm from "./_components/size-form";

type GenerateMetaDataProps = {
  params: {
    sizeId: string;
  };
};

export async function generateMetadata({ params }: GenerateMetaDataProps) {
  const { sizeId } = params;

  return {
    title: sizeId === "new" ? "New Size" : "Edit Size",
  };
}

const SizePage = async ({ params }: { params: { sizeId: string } }) => {
  let size =
    params.sizeId === "new"
      ? null
      : await prisma.size.findUnique({
          where: {
            id: params.sizeId,
          },
        });

  return (
    <div className="flex flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <SizeForm initialData={size} />
      </div>
    </div>
  );
};

export default SizePage;
