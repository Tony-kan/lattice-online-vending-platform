import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { ISaleReceipt } from "@/types/type";
import { formatDateTime } from "@/lib/utils";

interface ReceiptDialogProps {
  receipt: ISaleReceipt | null | undefined;
  isLoading: boolean;
}

export const ReceiptDialog = ({ receipt, isLoading }: ReceiptDialogProps) => {
  if (isLoading) {
    return (
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Loading Receipt...</DialogTitle>
        </DialogHeader>
        <p>Please wait...</p>
      </DialogContent>
    );
  }

  if (!receipt) {
    return (
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Error</DialogTitle>
        </DialogHeader>
        <p>Could not load receipt details.</p>
      </DialogContent>
    );
  }
  console.log("Receipt :", receipt);
  return (
    <DialogContent className="max-w-lg bg-white border-amber-500 rounded-sm">
      <DialogHeader>
        <DialogTitle>Receipt: {receipt.receipt}</DialogTitle>
        <DialogDescription>
          Sale completed on {formatDateTime(receipt.created_at)}
        </DialogDescription>
      </DialogHeader>
      <div className="mt-4">
        <h3 className="font-semibold mb-2">Items Purchased:</h3>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Item</TableHead>
              <TableHead>Qty</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {receipt.items.map((item) => (
              <TableRow key={item.item_id}>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.quantity}</TableCell>
                <TableCell>{item.price || 0}</TableCell>
                <TableCell>{(item.price || 0) * item.quantity}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className="mt-4 space-y-2 text-right">
          <p>
            Subtotal:{" "}
            {receipt.items.reduce(
              (acc, item) => acc + (item.price || 0) * item.quantity,
              0
            )}
          </p>
          <p>Tax: {receipt.tax}</p>
          <p>Discount: -{receipt.discount}</p>
          <p className="font-bold text-lg">Grand Total: {receipt.total}</p>
        </div>
      </div>
    </DialogContent>
  );
};
