/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import fs from "fs";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from 'uuid';

const ITEM_PER_PAGE = 5;

function logError(prefix: string, error: unknown) {
    console.error(`${prefix}:`, error);
}



const s3 = new S3Client({
    region: process.env.AWS_REGION!,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
    endpoint: process.env.AWS_ENDPOINT
});


// GET Products
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
                orderBy: { createdAt: "desc" },
                skip: (page - 1) * ITEM_PER_PAGE,
                take: ITEM_PER_PAGE,
            }),
            prisma.product.count({ where }),
        ]);

        return NextResponse.json({
            products,
            totalPages: Math.ceil(totalCount / ITEM_PER_PAGE),
        });
    } catch (error) {
        logError("GET /api/products", error);
        return NextResponse.json({ error: "Gagal mengambil data produk" }, { status: 500 });
    }
}

// POST Product
export async function POST(req: Request) {
    try {
        const formData = await req.formData();
        const name = formData.get("name") as string;
        const price = parseFloat(formData.get("price") as string);
        const description = formData.get("description") as string;
        const stock = parseInt(formData.get("stock") as string);
        const category = formData.get("category") as string;
        const imageUrl = formData.get("image") as string;

        const file = formData.get("image") as File;

        if (!name || isNaN(price) || !description || isNaN(stock) || !category || !file) {
            return NextResponse.json({ error: "Semua field harus diisi." }, { status: 400 });
        }

        // const uploadDir = path.join(process.cwd(), "public", "uploads");
        // if (!fs.existsSync(uploadDir)) await mkdir(uploadDir, { recursive: true });

        // const bytes = await file.arrayBuffer();
        // const buffer = Buffer.from(bytes);
        // const filename = `${Date.now()}-${file.name.replace(/\s+/g, "_")}`;
        // const filePath = path.join(uploadDir, filename);
        // await writeFile(filePath, buffer);

        // const imageUrl = `/uploads/${filename}`;


        // Proses upload ke S3
        // const buffer = Buffer.from(await file.arrayBuffer());
        // const fileExt = file.name.split('.').pop();
        // const fileName = `${Date.now()}-${uuidv4()}.${fileExt}`;
        // const contentType = file.type;

        // await s3.send(
        //     new PutObjectCommand({
        //         Bucket: process.env.AWS_BUCKET_NAME!,
        //         Key: fileName,
        //         Body: buffer,
        //         ContentType: contentType,
        //         ACL: 'public-read',
        //     })
        // );

        // const imageUrl = `${process.env.AWS_ENDPOINT}/${process.env.AWS_BUCKET_NAME}/${fileName}`;


        const product = await prisma.product.create({
            data: { name, price, description, stock, category, image: imageUrl },
        });

        return NextResponse.json(product);
    } catch (error) {
        logError("POST /api/products", error);
        return NextResponse.json({ error: "Gagal menambahkan produk" }, { status: 500 });
    }
}
