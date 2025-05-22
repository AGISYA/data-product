"use client";

import type React from "react";
import { useState, useRef } from "react";
import type { Product } from "@prisma/client";
import Image from "next/image";

interface EditModalProps {
  product: Product;
  onClose: () => void;
  onSubmit: (formData: FormData) => void;
}

export default function EditModal({
  product,
  onClose,
  onSubmit,
}: EditModalProps) {
  const [name, setName] = useState(product.name);
  const [price, setPrice] = useState(product.price);
  const [description, setDescription] = useState(product.description);
  const [stock, setStock] = useState(product.stock);
  const [category, setCategory] = useState(product.category || "Makanan");
  const [imagePreview, setImagePreview] = useState(product.image || "");
  const [imageError, setImageError] = useState<string | null>(null);
  const imageRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 1024 * 1024) {
        setImageError("Ukuran gambar tidak boleh lebih dari 1MB.");
        return;
      }
      setImageError(null);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      imageRef.current?.files?.[0]?.size &&
      imageRef.current.files[0].size > 1024 * 1024
    ) {
      setImageError("Ukuran gambar tidak boleh lebih dari 1MB.");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("price", String(price));
    formData.append("description", description);
    formData.append("stock", String(stock));
    formData.append("category", category);
    if (imageRef.current?.files?.[0]) {
      formData.append("image", imageRef.current.files[0]);
    }

    const response = await fetch(`/api/products/${product.id}`, {
      method: "PUT",
      body: formData,
    });

    if (response.ok) {
      onSubmit(formData);
      onClose();
    } else {
      alert("Terjadi kesalahan saat mengupdate produk.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 text-black flex items-center justify-center px-4 pt-10">
      <div
        className="fixed inset-0 bg-black opacity-40 backdrop-blur-sm z-40"
        onClick={onClose}
      />
      <form
        className="bg-white rounded-lg p-6 z-50 w-full max-w-3xl shadow-xl"
        onSubmit={handleSubmit}
      >
        <h2 className="text-xl font-semibold mb-6">Edit Produk</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-2">
                Nama Produk
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-600"
              />
            </div>

            <div>
              <label htmlFor="price" className="block text-sm font-medium mb-2">
                Harga
              </label>
              <input
                id="price"
                type="number"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                required
                className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-600"
              />
            </div>
          </div>{" "}
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium mb-2"
            >
              Deskripsi
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows={3}
              className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-600"
            />
          </div>
          <div className="space-y-4">
            <div>
              <label htmlFor="stock" className="block text-sm font-medium mb-2">
                Stok
              </label>
              <input
                id="stock"
                type="number"
                value={stock}
                onChange={(e) => setStock(Number(e.target.value))}
                required
                className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-600"
              />
            </div>

            <div>
              <label
                htmlFor="category"
                className="block text-sm font-medium mb-2"
              >
                Kategori
              </label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
                className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-600"
              >
                <option value="Makanan">Makanan</option>
                <option value="Minuman">Minuman</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              Gambar Saat Ini
            </label>
            {imagePreview && (
              <div className="flex flex-col items-center gap-2 mt-2">
                <Image
                  src={imagePreview}
                  alt="Preview"
                  width={150}
                  height={150}
                  className="rounded-md object-cover"
                />
                <button
                  type="button"
                  onClick={() => imageRef.current?.click()}
                  className="px-4 py-2 bg-yellow-500 text-white rounded-md shadow-sm hover:bg-yellow-600 transition"
                >
                  Ubah Gambar
                </button>
                {imageError && (
                  <p className="text-red-600 text-sm mt-1">{imageError}</p>
                )}
              </div>
            )}
          </div>
        </div>

        <input
          ref={imageRef}
          id="image"
          type="file"
          onChange={handleImageChange}
          accept="image/*"
          className="hidden"
        />

        <div className="flex justify-end mt-6 gap-4">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 bg-gray-200 text-gray-800 rounded-md shadow-sm hover:bg-gray-300 focus:outline-none focus:ring-1 focus:ring-gray-500 transition"
          >
            Batal
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-1 focus:ring-blue-500 transition"
          >
            Simpan
          </button>
        </div>
      </form>
    </div>
  );
}
