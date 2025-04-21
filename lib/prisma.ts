/* eslint-disable no-var */
// lib/prisma.ts
import { PrismaClient } from "@prisma/client";

// Mendeklarasikan variabel global untuk Prisma Client di lingkungan pengembangan
declare global {
    var prisma: PrismaClient | undefined;
}

// Membuat instance Prisma Client yang akan digunakan di seluruh aplikasi
const prisma = globalThis.prisma || new PrismaClient();

// Hanya di lingkungan pengembangan, kita akan menyimpan instance Prisma di variabel global
if (process.env.NODE_ENV !== "production") {
    globalThis.prisma = prisma;
}

export { prisma };
