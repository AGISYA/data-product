// components/edit-modal.tsx
"use client";

import { useState } from "react";
import { Product } from "@prisma/client";

interface EditModalProps {
  product: Product;
  onClose: () => void;
  onSubmit: (updatedProduct: Product) => void;
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...product,
      name,
      price,
      description,
      stock,
    });
  };

  return (
    <div className="fixed inset-0 z-50 text-black  flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md relative z-50">
        <h3 className="text-xl font-semibold mb-4">Edit Produk</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Nama Produk</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 border rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Harga</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              className="w-full p-2 border rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Deskripsi</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2 border rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Stok</label>
            <input
              type="number"
              value={stock}
              onChange={(e) => setStock(Number(e.target.value))}
              className="w-full p-2 border rounded-md"
            />
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm bg-gray-300 rounded-md"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md"
            >
              Simpan
            </button>
          </div>
        </form>
      </div>
      <div
        className="fixed inset-0 bg-black opacity-50 z-40"
        onClick={onClose}
      />
    </div>
  );
}
