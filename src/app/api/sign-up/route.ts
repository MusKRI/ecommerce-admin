import { NextResponse } from "next/server";
import { hash } from "bcrypt";

import prisma from "@/lib/prisma";

type RequestBody = {
  username: string;
  email: string;
  password: string;
};

export const POST = async (req: Request) => {
  try {
    const body: RequestBody = await req.json();

    const { username, email: ReceivedEmail, password: ReceivedPassword } = body;

    // check if email already exists
    const doesExist = await prisma.user.findUnique({
      where: {
        email: ReceivedEmail,
      },
    });

    if (doesExist) {
      return NextResponse.json(
        {
          user: null,
          message: "Email already exist!",
        },
        { status: 409 }
      );
    }

    const hashedPassword = await hash(ReceivedPassword, 10);

    const newUser = await prisma.user.create({
      data: {
        username,
        email: ReceivedEmail,
        password: hashedPassword,
      },
    });

    const { password, ...rest } = newUser;

    return NextResponse.json(
      {
        user: rest,
        message: "User Created successfully!",
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Something went wrong!" },
      { status: 500 }
    );
  }
};
