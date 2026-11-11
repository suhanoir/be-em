import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { resetPasswordWithCodeSchema } from "@/lib/validators";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

export async function POST(req: Request) {
  try {
    const ip = getClientIp(req);
    // Rate limit: 5 password reset attempts per 15 minutes per IP
    const rateCheck = await checkRateLimit(`ip:${ip}:reset_password`, 5, 900);
    if (!rateCheck.success) {
      return NextResponse.json(
        { error: "Too many reset attempts. Please wait a few minutes." },
        { status: 429 }
      );
    }

    const body = await req.json();
    const result = resetPasswordWithCodeSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid input", details: result.error.flatten() },
        { status: 400 }
      );
    }

    const { email, code, newPassword } = result.data;
    const cleanEmail = email.toLowerCase().trim();

    const user = await db.user.findUnique({
      where: { email: cleanEmail },
    });

    if (!user || !user.passwordResetCodeHash || !user.passwordResetExpires) {
      return NextResponse.json(
        { error: "No active password reset request found for this account. Please request a new code from salon support." },
        { status: 400 }
      );
    }

    if (new Date() > user.passwordResetExpires) {
      return NextResponse.json(
        { error: "Password reset code has expired. Please request a new code from the salon." },
        { status: 400 }
      );
    }

    const isMatch = await bcrypt.compare(code.trim(), user.passwordResetCodeHash);
    if (!isMatch) {
      return NextResponse.json(
        { error: "Invalid reset code. Please check the code provided by salon support." },
        { status: 400 }
      );
    }

    // Hash new password and clear reset code
    const newHash = await bcrypt.hash(newPassword, 10);
    await db.user.update({
      where: { id: user.id },
      data: {
        passwordHash: newHash,
        passwordResetCodeHash: null,
        passwordResetExpires: null,
      },
    });

    // Audit log
    await db.auditLog.create({
      data: {
        action: "PASSWORD_RESET_SUCCESS",
        entityType: "USER",
        entityId: user.id,
        performedBy: cleanEmail,
        ipAddress: ip,
        details: JSON.stringify({ email: cleanEmail, resetAt: new Date().toISOString() }),
      },
    });

    return NextResponse.json({
      success: true,
      message: "Password reset successfully. You can now log in with your new password.",
    });
  } catch (error: any) {
    console.error("Password reset error:", error);
    return NextResponse.json(
      { error: "Failed to reset password", message: error.message },
      { status: 500 }
    );
  }
}
