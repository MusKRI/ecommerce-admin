import { NextResponse } from "next/server";

import { userAuth } from "@/lib/user-auth";
import prisma from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: { colorId: string } }
) {
  try {
    if (!params.colorId) {
      return NextResponse.json(
        { success: false, message: "Color id is required!" },
        { status: 400 }
      );
    }

    const color = await prisma.color.findUnique({
      where: {
        id: params.colorId,
      },
    });

    return NextResponse.json({
      success: true,
      color,
    });
  } catch (error) {
    console.log("[COLOR_GET]", error);
    return NextResponse.json(
      { success: false, message: "Internal Error" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { colorId: string; storeId: string } }
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
        { success: false, message: "Color name is required!" },
        { status: 400 }
      );
    }

    if (!value) {
      return NextResponse.json(
        { success: false, message: "Color value is required!" },
        { status: 400 }
      );
    }

    if (!params.colorId) {
      return NextResponse.json(
        { success: false, message: "Color id is required!" },
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

    const color = await prisma.color.updateMany({
      where: {
        id: params.colorId,
      },
      data: {
        name,
        value,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Color Updated Successfully!",
      updatedColor: color,
    });
  } catch (error) {
    console.log("[COLOR_PATCH]", error);
    return NextResponse.json(
      { success: false, message: "Internal Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { storeId: string; colorId: string } }
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

    if (!params.colorId) {
      return NextResponse.json(
        { success: false, message: "Color id is required!" },
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

    const color = await prisma.color.deleteMany({
      where: {
        id: params.colorId,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Color deleted Successfully!",
      deletedColor: color,
    });
  } catch (error) {
    console.log("[COLOR_DELETE]", error);
    return NextResponse.json(
      { success: false, message: "Internal Error" },
      { status: 500 }
    );
  }
}
