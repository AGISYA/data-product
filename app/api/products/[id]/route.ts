/* eslint-disable @typescript-eslint/no-unused-vars */
import { writeFile, mkdir } from "fs/promises";
import fs from "fs";
import path from "path";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from 'uuid';


const s3 = new S3Client({
    region: process.env.AWS_REGION!,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
    endpoint: process.env.AWS_ENDPOINT
});


// Utility: Simpan Gambar
async function saveImage(file: File) {
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    if (!fs.existsSync(uploadDir)) await mkdir(uploadDir, { recursive: true });

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const filename = `${Date.now()}-${file.name.replace(/\s+/g, "_")}`;
    const filepath = path.join(uploadDir, filename);
    await writeFile(filepath, buffer);
    return `/uploads/${filename}`;
}

// PUT Product
export async function PUT(req: NextRequest) {
    const id = Number(req.nextUrl.pathname.split("/").pop());

    if (!id || isNaN(id)) {
        return NextResponse.json({ error: "ID tidak valid." }, { status: 400 });
    }

    try {
        const formData = await req.formData();
        const name = formData.get("name") as string;
        const price = parseFloat(formData.get("price") as string);
        const description = formData.get("description") as string;
        const stock = parseInt(formData.get("stock") as string);
        const category = formData.get("category") as string;
        const imageUrl = formData.get("image") as string;
        // const file = formData.get("image") as File | null;


        if (!name || isNaN(price) || !description || isNaN(stock) || !category) {
            return NextResponse.json({ error: "Semua field wajib diisi." }, { status: 400 });
        }

        // let imageUrl: string | undefined = undefined;

        // if (file && file.size > 0) {
        //     const buffer = Buffer.from(await file.arrayBuffer());
        //     const fileExt = file.name.split('.').pop();
        //     const fileName = `${Date.now()}-${uuidv4()}.${fileExt}`;
        //     const contentType = file.type;

        //     await s3.send(
        //         new PutObjectCommand({
        //             Bucket: process.env.AWS_BUCKET_NAME!,
        //             Key: fileName,
        //             Body: buffer,
        //             ContentType: contentType,
        //             ACL: 'public-read',
        //         })
        //     );

        //     imageUrl = `${process.env.AWS_ENDPOINT}/${process.env.AWS_BUCKET_NAME}/${fileName}`;

        // }





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

// DELETE Product
export async function DELETE(req: NextRequest) {
    const id = Number(req.nextUrl.pathname.split("/").pop());

    if (!id || isNaN(id)) {
        return NextResponse.json({ error: "ID tidak valid." }, { status: 400 });
    }

    try {
        await prisma.product.delete({ where: { id } });
        return NextResponse.json({ message: "Produk berhasil dihapus." });
    } catch (error) {
        console.error("Gagal hapus produk:", error);
        return NextResponse.json({ error: "Gagal menghapus produk." }, { status: 500 });
    }
}
