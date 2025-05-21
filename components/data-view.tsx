/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useEffect, useState, useCallback } from "react";
import { Product } from "@prisma/client";
import { formatDate } from "@/lib/utils";
import { IoPencil } from "react-icons/io5";
import { DeletButton } from "./button";
import EditModal from "./edit-modal";
import { useSearchParams } from "next/navigation";
import Pagination from "./pagination";
import Image from "next/image";

export function DataViewLayout() {
  const [data, setData] = useState<Product[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showModal, setShowModal] = useState(false);

  const searchParams = useSearchParams();
  const query = searchParams.get("query") || "";
  const page = Number(searchParams.get("page")) || 1;

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch(`/api/products?query=${query}&page=${page}`);
      const result = await res.json();
      setData(result.products);
      setTotalPages(result.totalPages);
    } catch (err) {
      setError("Gagal mengambil data produk");
    } finally {
      setLoading(false);
    }
  }, [query, page]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleEditClick = (product: Product) => {
    setSelectedProduct(product);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedProduct(null);
  };

  // Fungsi aman untuk path gambar
  const cleanImagePath = (image?: string | null): string => {
    if (!image) return "/default.jpg"; // fallback image
    return image.startsWith("/uploads/")
      ? image
      : `/uploads/${image.replace(/^\/+/, "")}`;
  };

  if (loading) {
    return <p className="text-sm text-gray-600">Loading data...</p>;
  }

  if (error) {
    return <p className="text-sm text-red-500">{error}</p>;
  }

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">
        Data Produk Tersimpan
      </h2>

      {data.length === 0 ? (
        <p className="text-sm text-gray-600">
          Belum ada data yang ditambahkan.
        </p>
      ) : (
        <>
          <div className="w-full overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-100 text-left text-gray-600 uppercase tracking-wide">
                <tr>
                  <th className="px-6 py-4">No</th>
                  <th className="px-6 py-4">Gambar</th>
                  <th className="px-6 py-4">Nama Produk</th>
                  <th className="px-6 py-4">Harga</th>
                  <th className="px-6 py-4">Deskripsi</th>
                  <th className="px-6 py-4">Stok</th>
                  <th className="px-6 py-4">Kategori</th>
                  <th className="px-6 py-4">Dibuat Pada</th>
                  <th className="px-6 py-4">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {data.map((product, index) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-gray-700 font-medium">
                      {(page - 1) * 5 + index + 1}
                    </td>
                    <td className="px-6 py-4">
                      <Image
                        src={product.image || ""}
                        alt={product.name}
                        width={64}
                        height={64}
                        className="object-cover rounded"
                      />
                    </td>
                    <td className="px-6 py-4 text-gray-800 whitespace-nowrap">
                      {product.name}
                    </td>
                    <td className="px-6 py-4 text-gray-800 whitespace-nowrap">
                      Rp. {product.price.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-gray-800">
                      {product.description}
                    </td>
                    <td className="px-6 py-4 text-gray-800">{product.stock}</td>
                    <td className="px-6 py-4 text-gray-800">
                      {product.category}
                    </td>
                    <td className="px-6 py-4 text-gray-800 whitespace-nowrap">
                      {formatDate(product.createdAt.toString())}
                    </td>
                    <td className="px-6 py-4 text-black flex gap-1">
                      <button
                        className="rounded-sm border p-1 hover:bg-gray-100"
                        onClick={() => handleEditClick(product)}
                      >
                        <IoPencil size={18} />
                      </button>
                      <DeletButton
                        id={String(product.id)}
                        onDeleteSuccess={fetchData}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-center mt-4">
            <Pagination totalPages={totalPages} />
          </div>
        </>
      )}

      {showModal && (
        <>
          <div className="fixed inset-0 z-10" onClick={handleCloseModal} />
          {selectedProduct && (
            <EditModal
              product={selectedProduct}
              onClose={handleCloseModal}
              onSubmit={async (formData) => {
                if (!selectedProduct) return;

                await fetch(`/api/products/${selectedProduct.id}`, {
                  method: "PUT",
                  body: formData,
                });
                fetchData();
                handleCloseModal();
              }}
            />
          )}
        </>
      )}
    </div>
  );
}
