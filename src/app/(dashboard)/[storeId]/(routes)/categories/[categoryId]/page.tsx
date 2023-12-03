import prisma from "@/lib/prisma";
import CategoryForm from "./_components/category-form";

type GenerateMetaDataProps = {
  params: {
    categoryId: string;
  };
};

export async function generateMetadata({ params }: GenerateMetaDataProps) {
  const { categoryId } = params;

  return {
    title: categoryId === "new" ? "New Category" : "Edit Category",
  };
}

const BillboardPage = async ({
  params,
}: {
  params: { categoryId: string; storeId: string };
}) => {
  let category =
    params.categoryId === "new"
      ? null
      : await prisma.category.findUnique({
          where: {
            id: params.categoryId,
          },
        });

  const billboards = await prisma.billboard.findMany({
    where: {
      storeId: params.storeId,
    },
  });

  return (
    <div className="flex flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <CategoryForm billboards={billboards} initialData={category} />
      </div>
    </div>
  );
};

export default BillboardPage;
