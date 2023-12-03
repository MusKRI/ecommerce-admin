import { NextResponse } from "next/server";

import { userAuth } from "@/lib/user-auth";
import prisma from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: { billboardId: string } }
) {
  try {
    if (!params.billboardId) {
      return NextResponse.json(
        { success: false, message: "Billboard id is required!" },
        { status: 400 }
      );
    }

    const billboard = await prisma.billboard.findUnique({
      where: {
        id: params.billboardId,
      },
    });

    return NextResponse.json({
      success: true,
      billboard,
    });
  } catch (error) {
    console.log("[BILLBOARD_GET]", error);
    return NextResponse.json(
      { success: false, message: "Internal Error" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { billboardId: string; storeId: string } }
) {
  try {
    const user = await userAuth();
    const userId = user?.userId;

    const body = (await req.json()) as {
      label: string;
      imageUrl: string;
    };

    const { label, imageUrl } = body;

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Unauthenticated" },
        { status: 401 }
      );
    }

    if (!label) {
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

    if (!params.billboardId) {
      return NextResponse.json(
        { success: false, message: "Billboard id is required!" },
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

    const billboard = await prisma.billboard.updateMany({
      where: {
        id: params.billboardId,
      },
      data: {
        label,
        imageUrl,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Billboard Updated Successfully!",
      updatedBillboard: billboard,
    });
  } catch (error) {
    console.log("[BILLBOARD_PATCH]", error);
    return NextResponse.json(
      { success: false, message: "Internal Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { storeId: string; billboardId: string } }
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

    if (!params.billboardId) {
      return NextResponse.json(
        { success: false, message: "Billboard id is required!" },
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

    const billboard = await prisma.billboard.deleteMany({
      where: {
        id: params.billboardId,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Billboard deleted Successfully!",
      deletedBillboard: billboard,
    });
  } catch (error) {
    console.log("[BILLBOARD_DELETE]", error);
    return NextResponse.json(
      { success: false, message: "Internal Error" },
      { status: 500 }
    );
  }
}
