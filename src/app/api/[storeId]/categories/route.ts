import { NextResponse } from "next/server";

import prisma from "@/lib/prisma";
import { userAuth } from "@/lib/user-auth";

type RequestBody = {
  name: string;
  billboardId: string;
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
    const { name: ReceivedCategoryLabel, billboardId } = body;

    if (!ReceivedCategoryLabel) {
      return NextResponse.json(
        { success: false, message: "Label is required!" },
        { status: 400 }
      );
    }

    if (!billboardId) {
      return NextResponse.json(
        { success: false, message: "Billboard id is required!" },
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

    const category = await prisma.category.create({
      data: {
        name: ReceivedCategoryLabel,
        billboardId,
        storeId: params.storeId,
      },
    });

    return NextResponse.json(
      { success: true, message: "Category created successfully!", category },
      { status: 201 }
    );
  } catch (error) {
    console.log("[CATEGORIES_POST]", error);
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
    if (!params.storeId) {
      return NextResponse.json(
        { success: false, message: "Store id is required!" },
        { status: 400 }
      );
    }

    const categories = await prisma.category.findMany({
      where: {
        storeId: params.storeId,
      },
    });

    return NextResponse.json({ success: true, categories }, { status: 200 });
  } catch (error) {
    console.log("[CATEGORIES_GET]", error);
    return NextResponse.json(
      { success: false, message: "Internal Error" },
      { status: 500 }
    );
  }
};
