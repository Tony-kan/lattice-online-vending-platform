import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { IInventoryItem, INewInventoryItem } from "@/types/type";
import { AxiosError } from "axios";

interface ApiError {
  error: string;
}

interface InventoryItemFormProps {
  item?: IInventoryItem | null;
  onSave: (data: INewInventoryItem) => void;
  isLoading: boolean;
  error: AxiosError<ApiError> | null;
}

const InventoryItemForm = ({
  item,
  onSave,
  isLoading,
  error,
}: InventoryItemFormProps) => {
  const [formData, setFormData] = useState<INewInventoryItem>({
    name: "",
    sku: "",
    price: 0,
    stock: 0,
  });

  useEffect(() => {
    if (item) {
      setFormData({
        name: item.name,
        sku: item.sku,
        price: item.price, // Price is already in cents from backend
        stock: item.stock,
      });
    } else {
      setFormData({ name: "", sku: "", price: 0, stock: 0 });
    }
  }, [item]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === "number" ? parseFloat(value) || 0 : value, // Convert to number for price/stock
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Item Name</Label>
        <Input
          id="name"
          name="name"
          className="rounded-sm focus-visible:ring-3 focus-visible:ring-amber-500 focus-visible:border-transparent"
          value={formData.name}
          onChange={handleChange}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="sku">SKU</Label>
        <Input
          id="sku"
          name="sku"
          className="rounded-sm focus-visible:ring-3 focus-visible:ring-amber-500 focus-visible:border-transparent"
          value={formData.sku}
          onChange={handleChange}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="price">Price </Label>
        <Input
          id="price"
          name="price"
          type="number"
          className="rounded-sm focus-visible:ring-3 focus-visible:ring-amber-500 focus-visible:border-transparent"
          value={formData.price}
          onChange={handleChange}
          required
          min="0"
          step="any" // Prices are in cents, so step by 1
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="stock">Stock Quantity</Label>
        <Input
          id="stock"
          name="stock"
          type="number"
          className="rounded-sm focus-visible:ring-3 focus-visible:ring-amber-500 focus-visible:border-transparent"
          value={formData.stock}
          onChange={handleChange}
          required
          min="0"
          step="any"
        />
      </div>

      {error && (
        <p className="text-sm text-center text-red-500 capitalize">
          {error.response?.data?.error || "An unexpected error occurred."}
        </p>
      )}

      <Button
        type="submit"
        disabled={isLoading}
        className="w-full bg-amber-500 rounded-sm text-white font-extrabold border-2 border-transparent hover:border-amber-500 hover:text-amber-500 hover:bg-transparent active:bg-amber-600 active:text-white"
      >
        {isLoading ? "Saving..." : "Save Item"}
      </Button>
    </form>
  );
};

export default InventoryItemForm;
