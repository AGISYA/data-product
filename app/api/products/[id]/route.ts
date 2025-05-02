/* eslint-disable @typescript-eslint/no-unused-vars */
import { writeFile } from "fs/promises";
import path from "path";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Utility untuk menyimpan gambar
async function saveImage(file: File) {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const filename = Date.now() + "-" + file.name;
    const filepath = path.join(process.cwd(), "public/uploads", filename);
    await writeFile(filepath, buffer);
    return `/uploads/${filename}`;
}

// Update Produk
export async function PUT(req: NextRequest) {
    const url = new URL(req.url);
    const parts = url.pathname.split("/");
    const id = Number(parts[parts.length - 1]);

    const formData = await req.formData();
    const name = formData.get("name") as string;
    const price = parseFloat(formData.get("price") as string);
    const description = formData.get("description") as string;
    const stock = parseInt(formData.get("stock") as string);
    const category = formData.get("category") as string;
    const file = formData.get("image") as File | null;

    try {
        let imageUrl = undefined;
        if (file && file.size > 0) {
            imageUrl = await saveImage(file);
        }

        const updated = await prisma.product.update({
            where: { id },
            data: {
                name,
                price,
                description,
                stock,
                category,
                ...(imageUrl && { image: imageUrl }),
            },
        });

        return NextResponse.json(updated);
    } catch (error) {
        console.error("Gagal update produk:", error);
        return NextResponse.json({ error: "Gagal update produk" }, { status: 500 });
    }
}


// DELETE PRODUK
export async function DELETE(req: NextRequest) {
    try {
        const url = new URL(req.url);
        const parts = url.pathname.split('/');
        const id = Number(parts[parts.length - 1]);

        if (!id) {
            return NextResponse.json({ error: "ID tidak valid." }, { status: 400 });
        }

        await prisma.product.delete({
            where: { id },
        });

        return NextResponse.json({ message: "Produk berhasil dihapus." });
    } catch (error) {
        return NextResponse.json({ error: "Gagal menghapus produk." }, { status: 500 });
    }
}
