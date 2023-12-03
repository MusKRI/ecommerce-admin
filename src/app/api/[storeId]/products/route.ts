import { NextResponse } from "next/server";

import prisma from "@/lib/prisma";
import { userAuth } from "@/lib/user-auth";

type RequestBody = {
  name: string;
  price: number;
  categoryId: string;
  colorId: string;
  sizeId: string;
  images: {url: string}[];
  isFeatured: boolean;
  isArchived: boolean;
};

export const POST = async (
  req: Request,
  { params }: { params: { storeId: string } }
) => {
  try {
    const user = await userAuth();
    const userId = user?.userId;

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Unauthenticated" },
        { status: 401 }
      );
    }

    const body: RequestBody = await req.json();
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

    if (!params.storeId) {
      return NextResponse.json(
        { success: false, message: "Store id is required!" },
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

    const product = await prisma.product.create({
      data: {
        name,
        price,
        isArchived,
        isFeatured,
        categoryId,
        colorId,
        sizeId,
        storeId: params.storeId,
        images: {
          createMany: {
            data: [...images.map((image) => image)],
          },
        },
      },
    });

    return NextResponse.json(
      { success: true, message: "Product created successfully!", product },
      { status: 201 }
    );
  } catch (error) {
    console.log("[PRODUCTS_POST]", error);
    return NextResponse.json(
      { success: false, message: "Internal Error" },
      { status: 500 }
    );
  }
};

export const GET = async (
  req: Request,
  { params }: { params: { storeId: string } }
) => {
  try {
    const { searchParams } = new URL(req.url);
    const categoryId = searchParams.get("categoryId") || undefined;
    const colorId = searchParams.get("colorId") || undefined;
    const sizeId = searchParams.get("sizeId") || undefined;
    const isFeatured = searchParams.get("isFeatured");

    if (!params.storeId) {
      return NextResponse.json(
        { success: false, message: "Store id is required!" },
        { status: 400 }
      );
    }

    const products = await prisma.product.findMany({
      where: {
        storeId: params.storeId,
        categoryId,
        colorId,
        sizeId,
        isFeatured: isFeatured ? true : undefined,
        isArchived: false,
      },
      include: {
        images: true,
        category: true,
        color: true,
        size: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ success: true, products }, { status: 200 });
  } catch (error) {
    console.log("[PRODUCTS_GET]", error);
    return NextResponse.json(
      { success: false, message: "Internal Error" },
      { status: 500 }
    );
  }
};
