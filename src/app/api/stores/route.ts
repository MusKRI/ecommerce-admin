import { NextResponse } from "next/server";

import prisma from "@/lib/prisma";
import { userAuth } from "@/lib/user-auth";

type RequestBody = {
  name: string;
};

export const POST = async (req: Request) => {
  try {
    const user = await userAuth();
    const userId = user?.userId;

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const body: RequestBody = await req.json();
    const { name: ReceivedStoreName } = body;

    if (!ReceivedStoreName) {
      return NextResponse.json(
        { success: false, message: "Store name is required!" },
        { status: 400 }
      );
    }

    const doesExist = await prisma.store.findUnique({
      where: {
        name: ReceivedStoreName,
      },
    });

    if (doesExist) {
      return NextResponse.json(
        { success: false, message: "Store having this name already exist!" },
        { status: 400 }
      );
    }

    const newStore = await prisma.store.create({
      data: {
        name: ReceivedStoreName,
        userId,
      },
    });

    return NextResponse.json(
      { success: true, message: "Store created successfully!", newStore },
      { status: 201 }
    );
  } catch (error) {
    console.log("[STORES_POST]", error);
    return NextResponse.json(
      { success: false, message: "Internal Error" },
      { status: 500 }
    );
  }
};
