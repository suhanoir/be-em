import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import bcrypt from "bcryptjs";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    const userRole = (session?.user as any)?.role;
    const adminEmail = session?.user?.email || "admin@beem.luxury";

    if (userRole !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized. Admin privileges required." }, { status: 403 });
    }

    const customer = await db.user.findUnique({
      where: { id: params.id },
    });

    if (!customer) {
      return NextResponse.json({ error: "Customer not found" }, { status: 404 });
    }

    // Generate random 6-digit code
    const rawCode = Math.floor(100000 + Math.random() * 900000).toString();
    const codeHash = await bcrypt.hash(rawCode, 10);
    const expiresAt = new Date(Date.now() + 2 * 60 * 60 * 1000); // 2 hours

    await db.user.update({
      where: { id: customer.id },
      data: {
        passwordResetCodeHash: codeHash,
        passwordResetExpires: expiresAt,
      },
    });

    // Create Audit Log
    await db.auditLog.create({
      data: {
        action: "PASSWORD_RESET_GENERATE",
        entityType: "USER",
        entityId: customer.id,
        performedBy: adminEmail,
        details: JSON.stringify({
          customerId: customer.id,
          customerEmail: customer.email,
          generatedBy: adminEmail,
        }),
      },
    });

    // Build WhatsApp share link
    const cleanPhone = (customer.phone || "").replace(/[^0-9]/g, "");
    const waText = `Hello ${customer.name}, your BEEM Beauty Empire password reset code is: *${rawCode}*. It is valid for 2 hours. Reset your password at: https://beem.luxury/reset-password`;
    const waLink = cleanPhone ? `https://wa.me/${cleanPhone.startsWith("91") ? cleanPhone : "91" + cleanPhone}?text=${encodeURIComponent(waText)}` : null;

    return NextResponse.json({
      success: true,
      code: rawCode,
      expiresAt,
      waLink,
      customerName: customer.name,
      customerEmail: customer.email,
    });
  } catch (error: any) {
    console.error("Admin generate reset code error:", error);
    return NextResponse.json(
      { error: "Failed to generate password reset code", message: error.message },
      { status: 500 }
    );
  }
}
