import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";

const LoginSchema = z.object({
  email: z
    .string({
      required_error: "Email is required",
      invalid_type_error: "Email must be a string",
    })
    .email("Please provide a valid email address"),
  password: z
    .string({
      required_error: "Password is required",
      invalid_type_error: "Password must be a string",
    })
    .min(1, "Password is required"),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validationResult = LoginSchema.safeParse(body);

    if (!validationResult.success) {
      const formattedErrors = validationResult.error.format();
      return NextResponse.json(
        {
          success: false,
          message: "Validation failed",
          details: formattedErrors,
        },
        { status: 400 }
      );
    }

    const { email, password } = validationResult.data;

    // Find the user by email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "Authentication failed",
          details: "Invalid email or password",
        },
        { status: 401 }
      );
    }

    // Compare provided password with stored hash
    const isPasswordValid = await bcryptjs.compare(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        {
          success: false,
          message: "Authentication failed",
          details: "Invalid email or password",
        },
        { status: 401 }
      );
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: "7d" }
    );

    // Return user info without the password
    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json(
      {
        success: true,
        message: "Login successful",
        user: userWithoutPassword,
        token,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Authentication failed",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 401 }
    );
  }
}
