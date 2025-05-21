"use client";

import type React from "react";

import { useState, useRef } from "react";
import type { Product } from "@prisma/client";
import Image from "next/image";
import { uploadImageToS3 } from "@/lib/utilities";

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
  const imageRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const file = imageRef.current!.files![0];
    let imageUrl = "";

    if (file) {
      imageUrl = await uploadImageToS3(file);
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("price", String(price));
    formData.append("description", description);
    formData.append("stock", String(stock));
    formData.append("category", category);
    formData.append("image", imageUrl);

    // if (imageRef.current?.files?.[0]) {
    //   formData.append("image", imageRef.current.files[0]);
    // }

    const response = await fetch(`/api/products/${product.id}`, {
      method: "PUT",
      body: formData,
    });

    if (response.ok) {
      onSubmit(formData);
      onClose(); // Close modal after success
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
        className="bg-white rounded-lg p-6 z-50 w-full max-w-2xl shadow-xl"
        onSubmit={handleSubmit}
      >
        <h2 className="text-xl font-semibold mb-6">Edit Produk</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column - Form Fields */}
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
          </div>

          {/* Right Column - More Fields and Image */}
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

            <div>
              <label className="block text-sm font-medium mb-2">
                Gambar Saat Ini
              </label>
              {imagePreview && (
                <div className="flex justify-center">
                  <Image
                    src={imagePreview || "/placeholder.svg"}
                    alt="Preview"
                    width={150}
                    height={150}
                    className="rounded-md"
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Upload Section */}
        <div className="mt-4">
          <label htmlFor="image" className="block text-sm font-medium mb-2">
            Upload Gambar Baru
          </label>
          <input
            ref={imageRef}
            id="image"
            type="file"
            onChange={handleImageChange}
            accept="image/*"
            className="w-full p-2 border border-gray-300 rounded-md shadow-sm"
          />
        </div>

        {/* Action Buttons */}
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
