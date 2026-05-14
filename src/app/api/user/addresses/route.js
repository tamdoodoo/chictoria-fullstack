import { adminDb, adminAuth } from "@/lib/firebase-admin";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

async function getUid() {
  const cookieStore = await cookies();
  const session = cookieStore.get("__user_session")?.value;
  if (!session) return null;
  try {
    const decoded = await adminAuth.verifySessionCookie(session, true);
    return decoded.uid;
  } catch {
    return null;
  }
}

export async function PUT(request) {
  const uid = await getUid();
  if (!uid) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  try {
    const { addresses } = await request.json();
    await adminDb.collection("users").doc(uid).update({ addresses, updatedAt: new Date() });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
