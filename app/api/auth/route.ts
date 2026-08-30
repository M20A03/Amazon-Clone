import { NextRequest, NextResponse } from "next/server";
import { generateUUID } from "@/lib/utils";

export async function POST(request: NextRequest) {
  try {
    const { email, name, action } = await request.json();

    if (!email) {
      return NextResponse.json(
        { success: false, error: "Email is required." },
        { status: 400 }
      );
    }

    const sessionToken = `jwt_sess_${generateUUID()}`;
    const user = {
      id: generateUUID(),
      email,
      name: name || email.split("@")[0],
      token: sessionToken,
    };

    const response = NextResponse.json(
      {
        success: true,
        action: action || "login",
        user,
      },
      { status: 200 }
    );

    // Set HTTP-only secure cookie
    response.cookies.set({
      name: "amazon_session",
      value: sessionToken,
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      sameSite: "lax",
    });

    return response;
  } catch (err) {
    return NextResponse.json(
      { success: false, error: "Authentication failed." },
      { status: 500 }
    );
  }
}
