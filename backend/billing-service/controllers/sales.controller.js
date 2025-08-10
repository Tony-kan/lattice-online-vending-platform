import { v4 as uuidv4 } from "uuid";
import { database } from "../database/connect_db.js";
import { sales } from "../database/models/sales.model.js";
import { saleItems } from "../database/models/sale_items.model.js";
import { items } from "../../inventory-service/database/models/item.model.js";
import { eq, inArray, desc, sql } from "drizzle-orm";

// Get all sales for the sales history table
export const getAllSales = async (req, res) => {
  try {
    const allSales = await database
      .select()
      .from(sales)
      .orderBy(desc(sales.created_at));

    res.json(allSales);
  } catch (err) {
    console.error("Failed to fetch sales history:", err);
    res.status(500).json({ error: "Could not retrieve sales history" });
  }
};

// REFACTORED: Create sale using a Drizzle transaction
export const createSale = async (req, res) => {
  const { items: newSaleItems = [], tax = 0, discount = 0 } = req.body;
  if (!Array.isArray(newSaleItems) || newSaleItems.length === 0) {
    return res
      .status(400)
      .json({ error: "Sale must include at least one item" });
  }

  try {
    const result = await database.transaction(async (tx) => {
      // 1. Fetch all required items from inventory in one query
      const itemIds = newSaleItems.map((it) => it.item_id);
      const fetchedItems = await tx
        .select()
        .from(items)
        .where(inArray(items.id, itemIds));

      // Create a lookup map for easy access
      const itemsMap = new Map(fetchedItems.map((item) => [item.id, item]));

      // 2. Validate stock and calculate subtotal
      let subtotal = 0;
      for (const saleItem of newSaleItems) {
        const dbItem = itemsMap.get(saleItem.item_id);
        if (!dbItem) {
          throw new Error(`Item with ID ${saleItem.item_id} not found.`);
        }
        if (dbItem.stock < saleItem.quantity) {
          throw new Error(
            `Insufficient stock for ${dbItem.name}. Available: ${dbItem.stock}, Requested: ${saleItem.quantity}.`
          );
        }
        subtotal += Number(dbItem.price) * Number(saleItem.quantity);
      }

      // 3. Calculate final total
      const total = subtotal + Number(tax) - Number(discount);

      const receiptId = `RCPT-${uuidv4().slice(0, 8).toUpperCase()}`;

      // 4. Insert the main sale record
      const [newSale] = await tx
        .insert(sales)
        .values({
          receipt: receiptId,
          total: total,
          tax: Number(tax),
          discount: Number(discount),
        })
        .returning();

      // 5. Prepare and insert all sale items
      const saleItemsToInsert = newSaleItems.map((saleItem) => {
        const dbItem = itemsMap.get(saleItem.item_id);
        return {
          sale_id: newSale.id,
          item_id: saleItem.item_id,
          price: dbItem.price, // Record the price at the time of sale
          quantity: saleItem.quantity,
        };
      });
      await tx.insert(saleItems).values(saleItemsToInsert);

      // 6. Update stock for each item
      for (const saleItem of newSaleItems) {
        await tx
          .update(items)
          .set({
            stock: sql`${items.stock} - ${saleItem.quantity}`,
          })
          .where(eq(items.id, saleItem.item_id));
      }

      // 7. Construct and return the full receipt object
      return {
        ...newSale,
        items: saleItemsToInsert.map((si) => ({
          ...si,
          name: itemsMap.get(si.item_id)?.name,
        })),
      };
    });

    // If transaction is successful, send the full receipt back
    res.status(201).json(result);
  } catch (err) {
    console.error("Sale transaction failed:", err);
    res.status(400).json({ error: err.message });
  }
};

// Get a single receipt with item details included
export const getReceipt = async (req, res) => {
  const { receipt } = req.params; // Used receipt:  for clarity

  try {
    const saleResult = await database.query.sales.findFirst({
      where: eq(sales.receipt, receipt),
      with: {
        // "saleItems" is the name of the relation in your sales schema
        saleItems: {
          with: {
            // "item" is the name of the relation in your saleItems schema
            item: {
              columns: {
                name: true, // Only select the item name
              },
            },
          },
        },
      },
    });

    if (!saleResult) {
      return res.status(404).json({ error: "Receipt not found" });
    }

    const response = {
      ...saleResult,
      items: saleResult.saleItems.map((si) => ({
        ...si,
        name: si.item.name,
        item: undefined,
      })),
    };

    res.json(response);
  } catch (err) {
    console.error("Failed to fetch receipt:", err);
    res.status(500).json({ error: "Could not retrieve receipt" });
  }
};
