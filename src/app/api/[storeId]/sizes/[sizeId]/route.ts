import { NextResponse } from "next/server";

import { userAuth } from "@/lib/user-auth";
import prisma from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: { sizeId: string } }
) {
  try {
    if (!params.sizeId) {
      return NextResponse.json(
        { success: false, message: "Size id is required!" },
        { status: 400 }
      );
    }

    const size = await prisma.size.findUnique({
      where: {
        id: params.sizeId,
      },
    });

    return NextResponse.json({
      success: true,
      size,
    });
  } catch (error) {
    console.log("[SIZE_GET]", error);
    return NextResponse.json(
      { success: false, message: "Internal Error" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { sizeId: string; storeId: string } }
) {
  try {
    const user = await userAuth();
    const userId = user?.userId;

    const body = (await req.json()) as {
      name: string;
      value: string;
    };

    const { name, value } = body;

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Unauthenticated" },
        { status: 401 }
      );
    }

    if (!name) {
      return NextResponse.json(
        { success: false, message: "Size name is required!" },
        { status: 400 }
      );
    }

    if (!value) {
      return NextResponse.json(
        { success: false, message: "Size value is required!" },
        { status: 400 }
      );
    }

    if (!params.sizeId) {
      return NextResponse.json(
        { success: false, message: "Size id is required!" },
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

    const size = await prisma.size.updateMany({
      where: {
        id: params.sizeId,
      },
      data: {
        name,
        value,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Size Updated Successfully!",
      updatedSize: size,
    });
  } catch (error) {
    console.log("[SIZE_PATCH]", error);
    return NextResponse.json(
      { success: false, message: "Internal Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { storeId: string; sizeId: string } }
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

    if (!params.sizeId) {
      return NextResponse.json(
        { success: false, message: "Size id is required!" },
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

    const size = await prisma.size.deleteMany({
      where: {
        id: params.sizeId,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Size deleted Successfully!",
      deletedSize: size,
    });
  } catch (error) {
    console.log("[SIZE_DELETE]", error);
    return NextResponse.json(
      { success: false, message: "Internal Error" },
      { status: 500 }
    );
  }
}
