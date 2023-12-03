import { NextResponse } from "next/server";

import prisma from "@/lib/prisma";
import { userAuth } from "@/lib/user-auth";

type RequestBody = {
  label: string;
  imageUrl: string;
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
    const { label: ReceivedBillboardLabel, imageUrl } = body;

    if (!ReceivedBillboardLabel) {
      return NextResponse.json(
        { success: false, message: "Label is required!" },
        { status: 400 }
      );
    }

    if (!imageUrl) {
      return NextResponse.json(
        { success: false, message: "Image is required!" },
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

    const billboard = await prisma.billboard.create({
      data: {
        label: ReceivedBillboardLabel,
        imageUrl,
        storeId: params.storeId,
      },
    });

    return NextResponse.json(
      { success: true, message: "Billboard created successfully!", billboard },
      { status: 201 }
    );
  } catch (error) {
    console.log("[BILLBOARDS_POST]", error);
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

    const billboards = await prisma.billboard.findMany({
      where: {
        storeId: params.storeId,
      },
    });

    return NextResponse.json({ success: true, billboards }, { status: 200 });
  } catch (error) {
    console.log("[BILLBOARDS_GET]", error);
    return NextResponse.json(
      { success: false, message: "Internal Error" },
      { status: 500 }
    );
  }
};
