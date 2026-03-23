import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

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

        if (file.size > 5 * 1024 * 1024) {
            return NextResponse.json(
                { error: "File too large. Max 5MB." },
                { status: 400 }
            );
        }

        const buffer = await file.arrayBuffer();
        const ext = file.name.split(".").pop() || "jpg";
        const filename = `product_${Date.now()}.${ext}`;
        const filePath = `products/${filename}`;

        const { error: uploadError } = await supabaseAdmin.storage
            .from("product-images")
            .upload(filePath, buffer, {
                contentType: file.type,
                upsert: true,
            });

        if (uploadError) {
            console.error("Supabase upload error:", uploadError);
            return NextResponse.json(
                { error: `Upload failed: ${uploadError.message}` },
                { status: 500 }
            );
        }

        const { data: urlData } = supabaseAdmin.storage
            .from("product-images")
            .getPublicUrl(filePath);

        return NextResponse.json({
            success: true,
            url: urlData.publicUrl,
        });
    } catch (error) {
        console.error("Upload failed:", error);
        return NextResponse.json(
            { error: "Upload failed." },
            { status: 500 }
        );
    }
}
