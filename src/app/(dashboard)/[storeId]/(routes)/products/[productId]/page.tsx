import prisma from "@/lib/prisma";
import ProductForm from "./_components/product-form";

type GenerateMetaDataProps = {
  params: {
    productId: string;
  };
};

export async function generateMetadata({ params }: GenerateMetaDataProps) {
  const { productId } = params;

  return {
    title: productId === "new" ? "New Product" : "Edit Product",
  };
}

const ProductPage = async ({
  params,
}: {
  params: { productId: string; storeId: string };
}) => {
  let product =
    params.productId === "new"
      ? null
      : await prisma.product.findUnique({
          where: {
            id: params.productId,
          },
          include: {
            images: true,
          },
        });

  const categories = await prisma.category.findMany({
    where: {
      storeId: params.storeId,
    },
  });

  const sizes = await prisma.size.findMany({
    where: {
      storeId: params.storeId,
    },
  });

  const colors = await prisma.color.findMany({
    where: {
      storeId: params.storeId,
    },
  });

  return (
    <div className="flex flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ProductForm initialData={product}
          categories={categories}
          colors={colors}
          sizes={sizes}
        />
      </div>
    </div>
  );
};

export default ProductPage;
