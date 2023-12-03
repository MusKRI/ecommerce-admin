import { NextResponse } from "next/server";

import prisma from "@/lib/prisma";
import { userAuth } from "@/lib/user-auth";

type RequestBody = {
  name: string;
  value: string;
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
    const { name: ReceivedName, value: ReceivedValue } = body;

    if (!ReceivedName) {
      return NextResponse.json(
        { success: false, message: "Size name is required!" },
        { status: 400 }
      );
    }

    if (!ReceivedValue) {
      return NextResponse.json(
        { success: false, message: "Size value is required!" },
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

    const size = await prisma.size.create({
      data: {
        name: ReceivedName,
        value: ReceivedValue,
        storeId: params.storeId,
      },
    });

    return NextResponse.json(
      { success: true, message: "Size created successfully!", size },
      { status: 201 }
    );
  } catch (error) {
    console.log("[SIZES_POST]", error);
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

    const sizes = await prisma.size.findMany({
      where: {
        storeId: params.storeId,
      },
    });

    return NextResponse.json({ success: true, sizes }, { status: 200 });
  } catch (error) {
    console.log("[SIZES_GET]", error);
    return NextResponse.json(
      { success: false, message: "Internal Error" },
      { status: 500 }
    );
  }
};
