/* eslint-disable @typescript-eslint/no-unused-vars */
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

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


// PUT: Update produk berdasarkan ID
export async function PUT(req: NextRequest) {
    try {
        const url = new URL(req.url);
        const parts = url.pathname.split('/');
        const id = Number(parts[parts.length - 1]);

        const body = await req.json();
        const { name, price, description, stock } = body;

        if (!name || price === undefined || !description || stock === undefined) {
            return NextResponse.json({ error: "Semua field harus diisi." }, { status: 400 });
        }

        const existingProduct = await prisma.product.findUnique({
            where: { id },
        });

        if (!existingProduct) {
            return NextResponse.json({ error: "Produk tidak ditemukan." }, { status: 404 });
        }

        const updated = await prisma.product.update({
            where: { id },
            data: {
                name,
                price: parseFloat(price),
                description,
                stock: parseInt(stock),
            },
        });

        return NextResponse.json(updated);
    } catch (error) {
        console.error("Error updating product:", error);
        return NextResponse.json({ error: "Gagal mengupdate produk." }, { status: 500 });
    }
}
