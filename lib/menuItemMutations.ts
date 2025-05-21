import { client } from "@/sanity/lib/client";
import { Item } from "@/sanity/types";

export async function createMenuItem(
  item: Omit<Item, "_id" | "_createdAt" | "_updatedAt" | "_rev">
): Promise<Item> {
  const doc = await client.create({
    ...item,
    _type: "item",
  });
  return doc as Item;
}

export async function updateMenuItem(
  _id: string,
  updates: Partial<Item>
): Promise<Item> {
  const doc = await client.patch(_id).set(updates).commit();
  return doc as Item;
}



export async function deleteMenuItem(_id: string): Promise<{ _id: string }> {
  try {
    const result = await client.delete(_id);
    console.log("Document deleted:", result);
    return result;
  } catch (error) {
    console.error("Error deleting document:", error);
    throw error;
  }
}