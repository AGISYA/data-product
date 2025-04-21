/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState } from "react";

export function FormInputLayout() {
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
    stock: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setMessage("");

    const { name, price, description, stock } = formData;

    if (!name || !price || !description || !stock) {
      setMessage("Semua field harus diisi.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          price: parseFloat(price),
          description,
          stock: parseInt(stock),
        }),
      });

      if (!res.ok) throw new Error("Gagal menyimpan produk");

      setMessage("Produk berhasil disimpan!");
      setFormData({ name: "", price: "", description: "", stock: "" }); // reset form
    } catch (error) {
      setMessage("Terjadi kesalahan saat menyimpan.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 text-black rounded-md border border-gray-200">
      <h2 className="text-lg font-semibold mb-1">Form Input Produk</h2>
      <p className="text-sm text-gray-600 mb-6">
        Masukkan data produk pada form berikut.
      </p>

      <form autoComplete="off" onSubmit={(e) => e.preventDefault()}>
        <div className="mb-4">
          <label htmlFor="name" className="block mb-2 font-medium">
            Nama Produk
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Masukkan nama produk"
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="price" className="block mb-2 font-medium">
            Harga
          </label>
          <input
            type="number"
            id="price"
            name="price"
            value={formData.price}
            onChange={handleChange}
            placeholder="Masukkan harga produk"
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="description" className="block mb-2 font-medium">
            Deskripsi
          </label>
          <textarea
            id="description"
            name="description"
            rows={4}
            value={formData.description}
            onChange={handleChange}
            placeholder="Masukkan deskripsi produk"
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          ></textarea>
        </div>

        <div className="mb-6">
          <label htmlFor="stock" className="block mb-2 font-medium">
            Stok
          </label>
          <input
            type="number"
            id="stock"
            name="stock"
            value={formData.stock}
            onChange={handleChange}
            placeholder="Masukkan jumlah stok"
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>

        {message && (
          <p
            className={`text-sm mb-4 ${
              message.includes("berhasil") ? "text-green-600" : "text-red-600"
            }`}
          >
            {message}
          </p>
        )}

        <button
          type="button"
          disabled={loading}
          onClick={handleSubmit}
          className="w-full py-3 bg-black text-white font-medium rounded-md hover:bg-gray-800 disabled:opacity-60"
        >
          {loading ? "Menyimpan..." : "Simpan Produk"}
        </button>
      </form>
    </div>
  );
}
