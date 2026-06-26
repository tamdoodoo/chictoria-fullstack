import { NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import path from "path";

export async function POST(request) {
  try {
    const formData = await request.formData();
    const files = formData.getAll("files");

    if (!files || files.length === 0) {
      return NextResponse.json({ error: "No files provided" }, { status: 400 });
    }

    const uploadedUrls = [];

    for (const file of files) {
      if (!file || typeof file === "string") continue;

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Sanitize filename
      const originalName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-");
      const timestamp = Date.now();
      const filename = `${timestamp}-${originalName}`;

      const uploadPath = path.join(process.cwd(), "public", "images", filename);
      await writeFile(uploadPath, buffer);

      uploadedUrls.push(`/images/${filename}`);
    }

    return NextResponse.json({ urls: uploadedUrls });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
