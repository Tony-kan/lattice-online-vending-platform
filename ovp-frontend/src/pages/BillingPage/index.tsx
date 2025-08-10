import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";

import { createSale, getSalesHistory, getReceiptById } from "@/api/BillingApi";
import { getAllItems } from "@/api/InventoryApi";

import ModuleLayout from "@/components/layout/ModuleLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Combobox } from "@/components/ui/combobox";
import { Label } from "@/components/ui/label";
import { Dialog } from "@/components/ui/dialog";
import { ReceiptDialog } from "@/components/billing/ReceiptDialog"; // Import the new component

import type {
  BreadcrumbItem,
  IInventoryItem,
  INewSalePayload,
  ISaleItem,
  ISaleReceipt,
} from "@/types/type";
import { formatDateTime, formatPrice } from "@/lib/utils";

const breadcrumbItems: BreadcrumbItem[] = [
  { label: "Modules", href: "/modules" },
  { label: "Billing", href: "/billing" },
];

interface ApiError {
  error: string;
}

const BillingPage = () => {
  const queryClient = useQueryClient();

  // State for building a sale
  const [cart, setCart] = useState<ISaleItem[]>([]);
  const [tax, setTax] = useState("0");
  const [discount, setDiscount] = useState("0");

  // State for viewing a receipt
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);
  const [viewingReceiptId, setViewingReceiptId] = useState<
    string | number | null
  >(null);

  // --- QUERIES ---
  const { data: inventoryItems = [] } = useQuery<IInventoryItem[]>({
    queryKey: ["inventoryItems"],
    queryFn: getAllItems,
  });
  const { data: salesHistory = [] } = useQuery<ISaleReceipt[]>({
    queryKey: ["salesHistory"],
    queryFn: getSalesHistory,
  });

  // Query to fetch a SINGLE receipt, only runs when a receiptId is set
  const { data: selectedReceipt, isLoading: isLoadingReceipt } = useQuery<
    ISaleReceipt,
    Error
  >({
    queryKey: ["receipt", viewingReceiptId],
    queryFn: () => getReceiptById(viewingReceiptId!), // The '!' asserts that it won't be null here
    enabled: !!viewingReceiptId && isReceiptOpen, // VERY IMPORTANT: Only runs when the dialog is open and an ID is selected
  });

  // --- MUTATIONS ---
  const createSaleMutation = useMutation<
    ISaleReceipt,
    AxiosError<ApiError>,
    INewSalePayload
  >({
    mutationFn: createSale,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["salesHistory"] });
      queryClient.invalidateQueries({ queryKey: ["inventoryItems"] });
      setCart([]);
      setTax("0");
      setDiscount("0");
      toast.success("Sale Created Successfully!", {
        description: `Receipt ID: ${data.receipt}`,
      });
    },
    onError: (err) =>
      toast.error("Sale Creation Failed", {
        description: err.response?.data?.error || err.message,
      }),
  });
  //  alert(`Error: ${err.response?.data?.error || err.message}`),
  // --- HANDLERS ---
  const handleViewReceiptClick = (receiptId: string | number) => {
    setViewingReceiptId(receiptId);
    setIsReceiptOpen(true);
  };

  // (All other handlers like handleAddItem, handleRemoveItem, etc. remain the same)
  const handleAddItem = (itemId: string | number) => {
    const itemToAdd = inventoryItems.find((item) => item.id === Number(itemId));
    if (!itemToAdd) return;
    const existingCartItem = cart.find((item) => item.item_id === itemToAdd.id);
    if (existingCartItem) {
      setCart(
        cart.map((item) =>
          item.item_id === itemToAdd.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setCart([
        ...cart,
        {
          item_id: itemToAdd.id,
          quantity: 1,
          name: itemToAdd.name,
          price: itemToAdd.price,
        },
      ]);
    }
  };
  const handleRemoveItem = (itemId: string | number) => {
    setCart(cart.filter((item) => item.item_id !== itemId));
  };

  const handleUpdateQuantity = (
    itemId: string | number,
    newQuantity: number
  ) => {
    const inventoryItem = inventoryItems.find((item) => item.id === itemId);
    if (!inventoryItem) return;

    // Clamp the quantity between 1 and the available stock
    const validatedQuantity = Math.max(
      1,
      Math.min(newQuantity, inventoryItem.stock)
    );

    setCart(
      cart.map((item) =>
        item.item_id === itemId
          ? { ...item, quantity: validatedQuantity }
          : item
      )
    );
  };

  // 4. Calculate totals using useMemo for efficiency
  const { subtotal, totalTax, totalDiscount, grandTotal } = useMemo(() => {
    const sub = cart.reduce(
      (acc, item) => acc + (item.price || 0) * item.quantity,
      0
    );
    const taxVal = Math.abs(parseFloat(tax)) || 0;
    const discountVal = Math.abs(parseFloat(discount)) || 0;
    // This formula correctly adds tax and subtracts discount.
    const total = sub + taxVal - discountVal;
    return {
      subtotal: sub,
      totalTax: taxVal,
      totalDiscount: discountVal,
      grandTotal: total,
    };
  }, [cart, tax, discount]);

  // const { subtotal, grandTotal } = useMemo(() => {
  //   const sub = cart.reduce(
  //     (acc, item) => acc + (item.price || 0) * item.quantity,
  //     0
  //   );
  //   const total = sub + (parseFloat(tax) || 0) - (parseFloat(discount) || 0);
  //   return { subtotal: sub, grandTotal: total };
  // }, [cart, tax, discount]);

  const handleSubmitSale = () => {
    if (cart.length === 0)
      // return alert("Cannot create a sale with an empty cart.");
      return toast.info("Your cart is empty.", {
        description: "Please add at least one item to create a sale.",
      });

    const sanitizedTax = Math.abs(parseFloat(tax)) || 0;
    const sanitizedDiscount = Math.abs(parseFloat(discount)) || 0;

    const payload = {
      items: cart.map(({ item_id, quantity }) => ({ item_id, quantity })),
      tax: sanitizedTax,
      discount: sanitizedDiscount,
    };
    createSaleMutation.mutate(payload);
  };

  return (
    <ModuleLayout title="Billing & Point of Sale" breadcrumbs={breadcrumbItems}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10">
        <div className="md:col-span-2">
          <Card className="rounded-sm">
            <CardHeader>
              <CardTitle>New Sale</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="mb-4">Add Item to Sale</Label>
                <Combobox
                  items={inventoryItems.map((item) => ({
                    value: item.id.toString(),
                    label: `${item.name} (Stock: ${item.stock})`,
                  }))}
                  onSelect={(value) => handleAddItem(value)}
                  placeholder="Search for an item..."
                />
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Unit Price</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {cart.map((item) => (
                    <TableRow key={item.item_id}>
                      <TableCell>{item.name}</TableCell>
                      {/* <TableCell>{item.quantity}</TableCell> */}
                      <TableCell>
                        <Input
                          type="number"
                          className="h-8 text-center focus-visible:ring-3 focus-visible:ring-amber-500 focus-visible:border-transparent"
                          value={item.quantity}
                          onChange={(e) =>
                            handleUpdateQuantity(
                              item.item_id,
                              parseInt(e.target.value, 10)
                            )
                          }
                          min="1"
                          // Set max to the item's stock from inventory
                          max={
                            inventoryItems.find(
                              (invItem) => invItem.id === item.item_id
                            )?.stock
                          }
                        />
                      </TableCell>
                      <TableCell>{formatPrice(item.price || 0)}</TableCell>
                      <TableCell>
                        {formatPrice((item.price || 0) * item.quantity)}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="destructive"
                          size="sm"
                          className="bg-red-500 rounded-sm"
                          onClick={() => handleRemoveItem(item.item_id)}
                        >
                          Remove
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
        <div>
          <Card className="rounded-sm border-2 ">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="space-y-2">
                <Label htmlFor="tax">Tax</Label>
                <Input
                  id="tax"
                  type="number"
                  value={tax}
                  onChange={(e) => setTax(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="discount">Discount</Label>
                <Input
                  id="discount"
                  type="number"
                  value={discount}
                  onChange={(e) => setDiscount(e.target.value)}
                />
              </div>
              <hr />
              <div className="flex justify-between text-muted-foreground">
                <span>Tax to be Added</span>
                <span>{formatPrice(totalTax)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Discount to be Applied</span>
                <span>-{formatPrice(totalDiscount)}</span>
              </div>
              <hr />
              <div className="flex justify-between font-bold text-lg">
                <span>Grand Total</span>
                <span>{formatPrice(grandTotal)}</span>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full bg-amber-500 border-2 rounded-sm border-transparent font-extrabold text-white hover:text-amber-500 hover:border-amber-500 hover:bg-transparent active:bg-amber-600 active:text-white"
                onClick={handleSubmitSale}
                disabled={createSaleMutation.isPending || cart.length === 0}
              >
                {createSaleMutation.isPending
                  ? "Processing..."
                  : "Complete Sale"}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>

      {/* --- SALES HISTORY TABLE (Now with functional button) --- */}
      <div className="mt-12 pb-6">
        <h2 className="text-2xl font-bold mb-4">Recent Sales</h2>
        <Card className="rounded-sm ">
          <CardContent className="pt-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Receipt ID</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {salesHistory.map((sale) => (
                  <TableRow key={sale.id}>
                    <TableCell>{sale.receipt}</TableCell>
                    <TableCell>{sale.total}</TableCell>
                    <TableCell>{formatDateTime(sale.created_at)}</TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        className="rounded-sm"
                        onClick={() => handleViewReceiptClick(sale.receipt)}
                      >
                        View Receipt
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* --- THE DIALOG FOR VIEWING A RECEIPT --- */}
      <Dialog open={isReceiptOpen} onOpenChange={setIsReceiptOpen}>
        <ReceiptDialog receipt={selectedReceipt} isLoading={isLoadingReceipt} />
      </Dialog>
    </ModuleLayout>
  );
};

export default BillingPage;
