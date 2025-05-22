/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState } from "react";

export function FormInputLayout() {
  const categories = ["Makanan", "Minuman"];

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
    stock: "",
    category: "",
  });

  const [imageFile, setImageFile] = useState<File | null>(null);

  const [errors, setErrors] = useState({
    name: "",
    price: "",
    description: "",
    stock: "",
    category: "",
    image: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const formatToRupiah = (value: string) => {
    const number = parseInt(value.replace(/[^\d]/g, ""));
    if (isNaN(number)) return "";
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(number);
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setErrors((prev) => ({ ...prev, [name]: "" })); // reset error

    if (name === "price") {
      const cleanValue = value.replace(/[^\d]/g, "");
      setFormData((prev) => ({ ...prev, [name]: cleanValue }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;

    if (file && file.size > 1024 * 1024) {
      setImageFile(null);
      setErrors((prev) => ({ ...prev, image: "Ukuran gambar maksimal 1MB." }));
    } else {
      setImageFile(file);
      setErrors((prev) => ({ ...prev, image: "" }));
    }
  };

  const validateFields = () => {
    const newErrors: typeof errors = {
      name: "",
      price: "",
      description: "",
      stock: "",
      category: "",
      image: "",
    };

    if (!formData.name) newErrors.name = "Nama produk wajib diisi.";
    if (!formData.price) newErrors.price = "Harga produk wajib diisi.";
    if (!formData.description) newErrors.description = "Deskripsi wajib diisi.";
    if (!formData.stock) newErrors.stock = "Stok wajib diisi.";
    if (!formData.category) newErrors.category = "Kategori wajib dipilih.";
    if (!imageFile) newErrors.image = "Gambar produk wajib diunggah.";

    setErrors(newErrors);

    return Object.values(newErrors).every((err) => !err);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setMessage("");

    if (!validateFields()) {
      setLoading(false);
      return;
    }

    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("price", formData.price.replace(/[^\d]/g, ""));
      data.append("description", formData.description);
      data.append("stock", formData.stock);
      data.append("category", formData.category);
      if (imageFile) data.append("image", imageFile);

      const res = await fetch("/api/products", {
        method: "POST",
        body: data,
      });

      if (!res.ok) throw new Error("Gagal menyimpan produk");

      setMessage("Produk berhasil disimpan!");
      setFormData({
        name: "",
        price: "",
        description: "",
        stock: "",
        category: "",
      });
      setImageFile(null);
      setErrors({
        name: "",
        price: "",
        description: "",
        stock: "",
        category: "",
        image: "",
      });
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
        {/* Nama */}
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
          {errors.name && (
            <p className="text-sm text-red-600 mt-1">{errors.name}</p>
          )}
        </div>

        {/* Harga */}
        <div className="mb-4">
          <label htmlFor="price" className="block mb-2 font-medium">
            Harga
          </label>
          <input
            type="text"
            id="price"
            name="price"
            value={formatToRupiah(formData.price)}
            onChange={handleChange}
            placeholder="Masukkan harga produk"
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
          {errors.price && (
            <p className="text-sm text-red-600 mt-1">{errors.price}</p>
          )}
        </div>

        {/* Deskripsi */}
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
          {errors.description && (
            <p className="text-sm text-red-600 mt-1">{errors.description}</p>
          )}
        </div>

        {/* Stok */}
        <div className="mb-4">
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
          {errors.stock && (
            <p className="text-sm text-red-600 mt-1">{errors.stock}</p>
          )}
        </div>

        {/* Kategori */}
        <div className="mb-4">
          <label htmlFor="category" className="block mb-2 font-medium">
            Kategori
          </label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="">Pilih kategori</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          {errors.category && (
            <p className="text-sm text-red-600 mt-1">{errors.category}</p>
          )}
        </div>

        {/* Gambar */}
        <div className="mb-6">
          <label htmlFor="image" className="block mb-2 font-medium">
            Gambar Produk
          </label>
          <input
            type="file"
            id="image"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />

          {errors.image && (
            <p className="text-sm text-red-600 mt-1">{errors.image}</p>
          )}
        </div>

        {/* Pesan sukses / gagal */}
        {message && (
          <p
            className={`text-sm mb-4 ${
              message.includes("berhasil") ? "text-green-600" : "text-red-600"
            }`}
          >
            {message}
          </p>
        )}

        {/* Tombol */}
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
