"use client";

import { useState } from "react";
import { IoPencil, IoTrashOutline, IoImageOutline } from "react-icons/io5";
import { ReactNode } from "react";

interface ButtonProps {
  onClick?: () => void;
  children: ReactNode;
}

export const Button = ({ onClick, children }: ButtonProps) => {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center justify-center px-4 py-2 bg-black text-white text-sm font-medium rounded-lg shadow-sm hover:bg-gray-800 transition-colors duration-200"
    >
      {children}
    </button>
  );
};

export const EditButton = ({ onClick }: { onClick: () => void }) => {
  return (
    <button
      onClick={onClick}
      className="rounded-sm border p-1 hover:bg-gray-100"
    >
      <IoPencil size={20} />
    </button>
  );
};

const DeletButton = ({
  id,
  onDeleteSuccess,
}: {
  id: string;
  onDeleteSuccess?: () => void;
}) => {
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    if (!id) {
      setError("ID tidak valid");
      return;
    }

    const confirmDelete = confirm("Yakin ingin menghapus produk?");
    if (!confirmDelete) return;

    try {
      const response = await fetch(`/api/products/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        onDeleteSuccess?.();
      } else {
        const data = await response.json();
        setError(data.error || "Gagal menghapus produk");
      }
    } catch (error) {
      setError("Terjadi kesalahan saat menghapus produk");
      console.error("Terjadi kesalahan:", error);
    }
  };

  return (
    <div>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <button
        onClick={handleDelete}
        className="rounded-sm border p-1 hover:bg-gray-100"
      >
        <IoTrashOutline size={20} />
      </button>
    </div>
  );
};

// ✅ Tombol untuk hapus gambar saja
const DeleteImageButton = ({
  id,
  onImageDeleted,
}: {
  id: string;
  onImageDeleted?: () => void;
}) => {
  const [error, setError] = useState<string | null>(null);

  const handleDeleteImage = async () => {
    const confirmDelete = confirm("Yakin ingin menghapus gambar produk ini?");
    if (!confirmDelete) return;

    try {
      const response = await fetch(`/api/products/${id}/image`, {
        method: "DELETE",
      });

      if (response.ok) {
        onImageDeleted?.();
      } else {
        const data = await response.json();
        setError(data.error || "Gagal menghapus gambar");
      }
    } catch (error) {
      setError("Terjadi kesalahan saat menghapus gambar");
      console.error("Error:", error);
    }
  };

  return (
    <div>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <button
        onClick={handleDeleteImage}
        className="rounded-sm border p-1 hover:bg-red-100 text-red-500"
        title="Hapus Gambar"
      >
        <IoImageOutline size={20} />
      </button>
    </div>
  );
};

export { DeletButton, DeleteImageButton };
