import { NextResponse } from "next/server";

import { userAuth } from "@/lib/user-auth";
import prisma from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: { productId: string } }
) {
  try {
    if (!params.productId) {
      return NextResponse.json(
        { success: false, message: "Product id is required!" },
        { status: 400 }
      );
    }

    const product = await prisma.product.findUnique({
      where: {
        id: params.productId,
      },
      include: {
        images: true,
        category: true,
        color: true,
        size: true,
      },
    });

    return NextResponse.json({
      success: true,
      product,
    });
  } catch (error) {
    console.log("[PRODUCT_GET]", error);
    return NextResponse.json(
      { success: false, message: "Internal Error" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { productId: string; storeId: string } }
) {
  try {
    const user = await userAuth();
    const userId = user?.userId;

    const body = (await req.json()) as {
      name: string;
      price: number;
      categoryId: string;
      colorId: string;
      sizeId: string;
      images: { url: string }[];
      isFeatured: boolean;
      isArchived: boolean;
    };

    const {
      name,
      price,
      categoryId,
      colorId,
      sizeId,
      images,
      isArchived,
      isFeatured,
    } = body;

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Unauthenticated" },
        { status: 401 }
      );
    }

    if (!name) {
      return NextResponse.json(
        { success: false, message: "Name is required!" },
        { status: 400 }
      );
    }

    if (!images || !images.length) {
      return NextResponse.json(
        { success: false, message: "Images are required" },
        { status: 400 }
      );
    }

    if (!price) {
      return NextResponse.json(
        { success: false, message: "Price is required!" },
        { status: 400 }
      );
    }
    if (!categoryId) {
      return NextResponse.json(
        { success: false, message: "Category id is required!" },
        { status: 400 }
      );
    }

    if (!colorId) {
      return NextResponse.json(
        { success: false, message: "Color id is required!" },
        { status: 400 }
      );
    }

    if (!sizeId) {
      return NextResponse.json(
        { success: false, message: "Size id is required!" },
        { status: 400 }
      );
    }

    if (!params.productId) {
      return NextResponse.json(
        { success: false, message: "Product id is required!" },
        { status: 400 }
      );
    }

    const storeByUserId = await prisma.store.findFirst({
      where: {
        id: params.storeId,
        userId,
      },
    });

    if (!storeByUserId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 403 }
      );
    }

    await prisma.product.update({
      where: {
        id: params.productId,
      },
      data: {
        name,
        price,
        isArchived,
        isFeatured,
        categoryId,
        colorId,
        sizeId,
        images: {
          deleteMany: {},
        },
      },
    });

    const product = await prisma.product.update({
      where: {
        id: params.productId,
      },
      data: {
        images: {
          createMany: {
            data: [...images.map((image) => image)],
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: "Product Updated Successfully!",
      updatedProduct: product,
    });
  } catch (error) {
    console.log("[PRODUCT_PATCH]", error);
    return NextResponse.json(
      { success: false, message: "Internal Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { storeId: string; productId: string } }
) {
  try {
    const user = await userAuth();
    const userId = user?.userId;

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Unauthenticated" },
        { status: 401 }
      );
    }

    if (!params.productId) {
      return NextResponse.json(
        { success: false, message: "Product id is required!" },
        { status: 400 }
      );
    }

    const storeByUserId = await prisma.store.findFirst({
      where: {
        id: params.storeId,
        userId,
      },
    });

    if (!storeByUserId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 403 }
      );
    }

    const product = await prisma.product.deleteMany({
      where: {
        id: params.productId,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Product deleted Successfully!",
      deletedProduct: product,
    });
  } catch (error) {
    console.log("[PRODUCT_DELETE]", error);
    return NextResponse.json(
      { success: false, message: "Internal Error" },
      { status: 500 }
    );
  }
}
