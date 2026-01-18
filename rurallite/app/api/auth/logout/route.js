import { NextResponse } from "next/server";

export async function POST() {
    const res = NextResponse.json(
        {
            success: true,
            message: "Logged out successfully",
            data: null,
            timestamp: new Date().toISOString(),
        },
        { status: 200 }
    );

    const isProd = process.env.NODE_ENV === "production";

    // Clear access token cookie
    res.cookies.set("token", "", {
        httpOnly: true,
        secure: isProd,
        sameSite: "strict",
        path: "/",
        maxAge: 0,
    });

    // Clear refresh token cookie
    res.cookies.set("refreshToken", "", {
        httpOnly: true,
        secure: isProd,
        sameSite: "strict",
        path: "/",
        maxAge: 0,
    });

    return res;
} 