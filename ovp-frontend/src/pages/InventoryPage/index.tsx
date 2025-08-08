import ModuleLayout from "@/components/layout/ModuleLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { BreadcrumbItem } from "@/types/type";

// Dummy data
const items = [
  { id: 1, name: "Cola", quantity: 50, price: 150 },
  { id: 2, name: "Chips", quantity: 8, price: 200 },
  { id: 3, name: "Water", quantity: 120, price: 100 },
];

const breadcrumbItems: BreadcrumbItem[] = [
  { label: "Modules", href: "/modules" },
  { label: "Inventory", href: "/inventory" },
];

const InventoryPage = () => {
  return (
    <ModuleLayout title="Inventory Management" breadcrumbs={breadcrumbItems}>
      <Card>
        <CardHeader>
          <CardTitle>Current Stock</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Item Name</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Price (in cents)</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell>{item.price}</TableCell>
                  <TableCell>
                    {item.quantity < 10 ? (
                      <span className="text-red-500 font-bold">Low Stock</span>
                    ) : (
                      <span className="text-green-600">In Stock</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </ModuleLayout>
  );
};

export default InventoryPage;
