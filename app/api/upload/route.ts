import { NextResponse } from "next/server";
import path from "path";
import { writeFile } from "fs/promises";

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return NextResponse.json(
                { error: "No file received." },
                { status: 400 }
            );
        }

        const buffer = Buffer.from(await file.arrayBuffer());
        const filename = file.name.replaceAll(" ", "_"); // Simple sanitization

        // Save to public/uploads
        // Note: In production (Vercel), this won't persist. This is for local dev only.
        const filePath = path.join(process.cwd(), "public/uploads", filename);

        await writeFile(filePath, buffer);

        return NextResponse.json({
            success: true,
            url: `/uploads/${filename}`
        });

    } catch (error) {
        console.error("Upload failed:", error);
        return NextResponse.json(
            { error: "Upload failed." },
            { status: 500 }
        );
    }
}
