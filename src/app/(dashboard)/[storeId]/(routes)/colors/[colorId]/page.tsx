import prisma from "@/lib/prisma";
import ColorForm from "./_components/color-form";

type GenerateMetaDataProps = {
  params: {
    colorId: string;
  };
};

export async function generateMetadata({ params }: GenerateMetaDataProps) {
  const { colorId } = params;

  return {
    title: colorId === "new" ? "New Color" : "Edit Color",
  };
}

const ColorPage = async ({ params }: { params: { colorId: string } }) => {
  let color =
    params.colorId === "new"
      ? null
      : await prisma.color.findUnique({
          where: {
            id: params.colorId,
          },
        });

  return (
    <div className="flex flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ColorForm initialData={color} />
      </div>
    </div>
  );
};

export default ColorPage;
