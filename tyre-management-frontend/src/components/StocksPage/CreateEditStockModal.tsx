import React, { useState, useEffect } from "react";
import { Stock } from "@/types/stock";
import { useCreateStock, useUpdateStock } from "@/hooks/useStock";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { uploadFile } from "@/lib/firebaseService";
import { Textarea } from "../ui/textarea";

interface CreateEditStockModalProps {
  isOpen: boolean;
  onClose: () => void;
  stock?: Stock | null;
}

const CreateEditStockModal = ({
  isOpen,
  onClose,
  stock,
}: CreateEditStockModalProps) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    inStock: 0,
    price: 0,
    type: "tyres",
    lifespan: 0,
    imageUrl: "",
  });
  const [file, setFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Initialize form data if editing
  useEffect(() => {
    if (stock) {
      setFormData({
        name: stock.name,
        description: stock.description,
        inStock: stock.inStock,
        price: stock.price,
        type: stock.type,
        lifespan: stock.lifespan || 0,
        imageUrl: stock.imageUrl,
      });
    } else {
      setFormData({
        name: "",
        description: "",
        inStock: 0,
        price: 0,
        type: "tyres",
        lifespan: 0,
        imageUrl: "",
      });
    }
    setErrors({});
  }, [stock]);

  const createStockMutation = useCreateStock();
  const updateStockMutation = useUpdateStock();

  // Validate form fields
  const validateForm = () => {
    const tempErrors: Record<string, string> = {};

    if (!formData.name.trim()) tempErrors.name = "Name is required.";
    if (!formData.description.trim())
      tempErrors.description = "Description is required.";
    if (formData.inStock < 0)
      tempErrors.inStock = "Stock amount cannot be negative.";
    if (formData.price <= 0)
      tempErrors.price = "Price must be greater than zero.";
    if (formData.lifespan < 0)
      tempErrors.lifespan = "Lifespan must be a positive number.";
    if (!file && !formData.imageUrl) tempErrors.image = "Image is required.";

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      let imageUrl = formData.imageUrl;
      if (file) {
        imageUrl = await uploadFile(file, `stocks/${file.name}`);
      }

      const stockData = { ...formData, imageUrl };

      if (stock) {
        await updateStockMutation.mutateAsync({ id: stock.id, stockData });
        toast.success("Stock updated successfully!");
      } else {
        await createStockMutation.mutateAsync(stockData);
        toast.success("Stock created successfully!");
      }
      onClose();
    } catch (error) {
      console.error(error);
      toast.error("Failed to save stock.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-96">
        <h2 className="text-xl font-semibold mb-4">
          {stock ? "Edit Stock" : "Create Stock"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <label>Name</label>
          <Input
            placeholder="Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}

          <label>Description</label>
          <Textarea
            placeholder="Description"
            className="h-32"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
          />
          {errors.description && (
            <p className="text-red-500 text-sm">{errors.description}</p>
          )}

          <label>In Stock Amount</label>
          <Input
            type="number"
            placeholder="In Stock"
            value={formData.inStock}
            onChange={(e) =>
              setFormData({ ...formData, inStock: parseInt(e.target.value) })
            }
          />
          {errors.inStock && (
            <p className="text-red-500 text-sm">{errors.inStock}</p>
          )}

          <label>Price</label>
          <Input
            type="number"
            placeholder="Price"
            value={formData.price}
            onChange={(e) =>
              setFormData({ ...formData, price: parseFloat(e.target.value) })
            }
          />
          {errors.price && (
            <p className="text-red-500 text-sm">{errors.price}</p>
          )}

          <label>Type</label>
          <select
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            className="w-full p-2 border rounded-lg"
          >
            <option value="tyres">Tyres</option>
            <option value="wheels">Wheels</option>
            <option value="accessories">Accessories</option>
            <option value="other">Other</option>
          </select>

          <label>Life Span (in Days)</label>
          <Input
            type="number"
            placeholder="Lifespan (in days)"
            value={formData.lifespan}
            onChange={(e) =>
              setFormData({ ...formData, lifespan: parseInt(e.target.value) })
            }
          />
          {errors.lifespan && (
            <p className="text-red-500 text-sm">{errors.lifespan}</p>
          )}

          <label>Upload Image</label>
          <Input
            type="file"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
          />
          {errors.image && (
            <p className="text-red-500 text-sm">{errors.image}</p>
          )}

          <div className="flex justify-end space-x-2">
            <Button
              style={{ color: "white" }}
              type="button"
              variant="outline"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button type="submit">{stock ? "Update" : "Create"}</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateEditStockModal;
