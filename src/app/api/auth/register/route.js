import { adminDb, adminAuth } from "@/lib/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(request) {
  try {
    const { idToken, name, phone } = await request.json();

    if (!idToken || !name || !phone) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Verify the ID token
    const decoded = await adminAuth.verifyIdToken(idToken);
    const uid = decoded.uid;

    // Create user profile in Firestore
    await adminDb.collection("users").doc(uid).set({
      name,
      email: decoded.email || "",
      phone,
      addresses: [],
      wishlist: [],
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });

    // Link to existing customer record if phone matches, or create one
    const customerRef = adminDb.collection("customers").doc(phone);
    const customerDoc = await customerRef.get();
    if (customerDoc.exists) {
      await customerRef.update({
        name,
        userId: uid,
        updatedAt: FieldValue.serverTimestamp(),
      });
    } else {
      await customerRef.set({
        name,
        notes: "",
        totalOrders: 0,
        riskLevel: "normal",
        userId: uid,
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      });
    }

    // Create session cookie
    const expiresIn = 60 * 60 * 24 * 14 * 1000; // 14 days
    const sessionCookie = await adminAuth.createSessionCookie(idToken, { expiresIn });

    const cookieStore = await cookies();
    cookieStore.set("__user_session", sessionCookie, {
      maxAge: expiresIn / 1000,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      sameSite: "lax",
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Registration failed:", error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
