/* eslint-disable @typescript-eslint/no-unused-vars */
import { prisma } from "@/lib/prisma";

const ITEM_PER_PAGE = 5;

export const getDataProduct = async (page: number) => {
    try {
        // Hitung offset (skip) berdasarkan halaman yang diminta
        const skip = (page - 1) * ITEM_PER_PAGE;

        // Ambil data produk berdasarkan halaman yang diminta
        const dataProduct = await prisma.product.findMany({
            skip, // Offset
            take: ITEM_PER_PAGE, // Batasan 5 item per halaman
        });

        return dataProduct;
    } catch (error) {
        throw new Error("Failed to fetch product data");
    }
};


export const getTotalPages = async () => {
    try {
        // Menghitung total jumlah produk
        const totalProducts = await prisma.product.count();

        // Menghitung total halaman
        const totalPages = Math.ceil(totalProducts / ITEM_PER_PAGE);

        return totalPages;
    } catch (error) {
        throw new Error("Failed to calculate total pages");
    }
};
