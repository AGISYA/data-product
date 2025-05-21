import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { v4 as uuidv4 } from "uuid";
import { NextResponse } from "next/server";

const s3 = new S3Client({
    region: process.env.AWS_REGION!,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
    endpoint: process.env.AWS_ENDPOINT
});

export async function GET() {
    const fileName = `${Date.now()}-${uuidv4()}.jpg`; // ubah ke ekstensi dinamis jika perlu

    const command = new PutObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME!,
        Key: fileName,
        ContentType: "image/jpeg", // bisa disesuaikan
    });

    const signedUrl = await getSignedUrl(s3, command, { expiresIn: 60 }); // expired dalam 1 menit

    const publicUrl = `${process.env.AWS_ENDPOINT}/${process.env.AWS_BUCKET_NAME}/${fileName}`;

    return NextResponse.json({
        uploadUrl: signedUrl,
        publicUrl,
    });
}
