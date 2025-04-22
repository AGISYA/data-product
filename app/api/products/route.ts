/* eslint-disable @typescript-eslint/no-unused-vars */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from "@/lib/prisma";
import { Prisma } from '@prisma/client';

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


// POST: Tambah produk
export async function POST(req: Request) {
    try {
        const { name, price, description, stock, category } = await req.json();

        // Validasi input
        if (!name || price === undefined || !description || stock === undefined || !category) {
            return NextResponse.json({ error: "Semua field harus diisi." }, { status: 400 });
        }

        const product = await prisma.product.create({
            data: {
                name,
                price: parseFloat(price),
                description,
                stock: parseInt(stock),
                category, // Pastikan kategori juga disertakan di sini
            },
        });

        return NextResponse.json(product);
    } catch (error) {
        return NextResponse.json({ error: "Gagal menambahkan produk" }, { status: 500 });
    }
}
