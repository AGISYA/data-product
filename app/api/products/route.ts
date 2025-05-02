/* eslint-disable @typescript-eslint/no-unused-vars */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from "@/lib/prisma";
import { Prisma } from '@prisma/client';
import { writeFile } from "fs/promises";
import path from "path";

const ITEM_PER_PAGE = 5;

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const query = searchParams.get("query")?.toLowerCase() || "";
        const page = Number(searchParams.get("page")) || 1;

        const where: Prisma.ProductWhereInput = {
            name: {
                contains: query,
                mode: "insensitive",
            },
        };

        const [products, totalCount] = await Promise.all([
            prisma.product.findMany({
                where,
                orderBy: {
                    createdAt: "desc",
                },
                skip: (page - 1) * ITEM_PER_PAGE,
                take: ITEM_PER_PAGE,
            }),
            prisma.product.count({ where }),
        ]);

        const totalPages = Math.ceil(totalCount / ITEM_PER_PAGE);

        return NextResponse.json({
            products,
            totalPages,
        });
    } catch (error) {
        return NextResponse.json(
            { error: "Gagal mengambil data produk" },
            { status: 500 }
        );
    }
}



export async function POST(req: Request) {
    try {
        const formData = await req.formData();
        const name = formData.get("name") as string;
        const price = parseFloat(formData.get("price") as string);
        const description = formData.get("description") as string;
        const stock = parseInt(formData.get("stock") as string);
        const category = formData.get("category") as string;
        const file = formData.get("image") as File;

        if (!name || isNaN(price) || !description || isNaN(stock) || !category || !file) {
            return NextResponse.json({ error: "Semua field harus diisi." }, { status: 400 });
        }

        // Save image
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const filename = `${Date.now()}-${file.name.replace(/\s+/g, "_")}`;
        const filePath = path.join(process.cwd(), "public", "uploads", filename);
        await writeFile(filePath, buffer);
        const imageUrl = `/uploads/${filename}`;

        const product = await prisma.product.create({
            data: {
                name,
                price,
                description,
                stock,
                category,
                image: imageUrl,
            },
        });

        return NextResponse.json(product);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Gagal menambahkan produk" }, { status: 500 });
    }
}
