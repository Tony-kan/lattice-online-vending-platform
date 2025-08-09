import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";

import {
  getAllItems,
  addItem,
  updateItem,
  deleteItem,
} from "@/api/InventoryApi";

import ModuleLayout from "@/components/layout/ModuleLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import type {
  BreadcrumbItem,
  IInventoryItem,
  INewInventoryItem,
} from "@/types/type";

import { formatDateTime } from "@/lib/utils";

import InventoryItemForm from "@/components/forms/InventoryForm";

const breadcrumbItems: BreadcrumbItem[] = [
  { label: "Modules", href: "/modules" },
  { label: "Inventory", href: "/inventory" },
];

interface ApiError {
  error: string;
}

const LOW_STOCK_THRESHOLD = 10;

const InventoryPage = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<IInventoryItem | null>(null);

  // 1. Fetching Inventory Items
  const {
    data: items,
    isLoading,
    isError,
    error,
  } = useQuery<IInventoryItem[], Error>({
    queryKey: ["inventoryItems"],
    queryFn: getAllItems,
  });
  console.log("data", items);

  // 2. Mutation for Adding Item
  const addItemMutation = useMutation<
    IInventoryItem,
    AxiosError<ApiError>,
    INewInventoryItem
  >({
    mutationFn: addItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventoryItems"] }); // Refetch list
      setIsFormOpen(false); // Close dialog
    },
    onError: (err) =>
      console.error(
        "Error adding item:",
        err.response?.data.error || err.message
      ),
  });

  // 3. Mutation for Updating Item
  const updateItemMutation = useMutation<
    IInventoryItem,
    AxiosError<ApiError>,
    { id: string | number; data: Partial<INewInventoryItem> }
  >({
    mutationFn: ({ id, data }) => updateItem(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventoryItems"] }); // Refetch list
      setIsFormOpen(false); // Close dialog
      setSelectedItem(null); // Clear selected item
    },
    onError: (err) =>
      console.error(
        "Error updating item:",
        err.response?.data.error || err.message
      ),
  });

  // 4. Mutation for Deleting Item
  const deleteItemMutation = useMutation<
    void,
    AxiosError<ApiError>,
    string | number
  >({
    mutationFn: deleteItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventoryItems"] }); // Refetch list
    },
    onError: (err) =>
      console.error(
        "Error deleting item:",
        err.response?.data.error || err.message
      ),
  });

  const handleEditClick = (item: IInventoryItem) => {
    setSelectedItem(item);
    setIsFormOpen(true);
  };

  const handleDeleteClick = (itemId: string | number) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      deleteItemMutation.mutate(itemId);
    }
  };

  const filteredItems =
    items?.filter(
      (item: IInventoryItem) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.sku.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

  return (
    <ModuleLayout title="Inventory Management" breadcrumbs={breadcrumbItems}>
      <div className="space-y-4 mt-10">
        {/* Header with Search and Add Item Button */}
        <div className="flex justify-between items-center gap-4">
          <Input
            placeholder="Search by name or SKU..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm rounded-sm focus-visible:ring-3 focus-visible:ring-amber-500 focus-visible:border-transparent"
          />
          <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
            <DialogTrigger asChild>
              <Button
                className="bg-amber-500 rounded-sm text-white font-extrabold border-2 border-transparent hover:border-amber-500 hover:text-amber-500 hover:bg-transparent active:bg-amber-600 active:text-white"
                onClick={() => setSelectedItem(null)} // Clear selected item for add mode
              >
                Add New Item
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-white border-amber-500 rounded-sm">
              <DialogHeader>
                <DialogTitle>
                  {selectedItem ? "Edit Item" : "Add New Item"}
                </DialogTitle>
              </DialogHeader>
              <InventoryItemForm
                item={selectedItem}
                onSave={(data) => {
                  if (selectedItem) {
                    updateItemMutation.mutate({ id: selectedItem.id, data });
                  } else {
                    addItemMutation.mutate(data);
                  }
                }}
                isLoading={
                  addItemMutation.isPending || updateItemMutation.isPending
                }
                error={addItemMutation.error || updateItemMutation.error}
              />
            </DialogContent>
          </Dialog>
        </div>

        {/* Inventory Table */}
        {isLoading && <p>Loading inventory items...</p>}
        {isError && (
          <p className="text-red-500">
            Error fetching inventory items: {error?.message || "Unknown error"}
          </p>
        )}
        {!isLoading && !isError && filteredItems.length === 0 && (
          <p className="text-gray-500 text-center">No items found.</p>
        )}

        {!isLoading && !isError && filteredItems.length > 0 && (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Item Name</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Price (MWK)</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead>Updated At</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredItems.map((item: IInventoryItem) => (
                <TableRow key={item.id}>
                  <TableCell>{item.id}</TableCell>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>{item.sku}</TableCell>
                  <TableCell>MWK{item.price}</TableCell>
                  <TableCell>{item.stock}</TableCell>
                  <TableCell>
                    {item.stock < LOW_STOCK_THRESHOLD ? (
                      <span className="text-red-500 font-bold">Low Stock</span>
                    ) : (
                      <span className="text-green-600">In Stock</span>
                    )}
                  </TableCell>
                  <TableCell>{formatDateTime(item.created_at)}</TableCell>
                  <TableCell>{formatDateTime(item.updated_at)}</TableCell>
                  <TableCell className="space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-green-500 text-white rounded-sm w-16 border-2 border-transparent hover:border-green-500 hover:text-green-500 hover:bg-transparent active:bg-green-600 active:text-white"
                      onClick={() => handleEditClick(item)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      className="bg-red-500 rounded-sm border-2 border-transparent hover:border-red-500 hover:text-red-500 hover:bg-transparent active:bg-red-600 active:text-white"
                      onClick={() => handleDeleteClick(item.id)}
                      disabled={deleteItemMutation.isPending}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </ModuleLayout>
  );
};

export default InventoryPage;
