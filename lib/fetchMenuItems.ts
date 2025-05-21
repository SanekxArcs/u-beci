import { client } from '@/sanity/lib/client'
import { ALL_MENU_ITEMS_QUERY } from '@/sanity/lib/queries'


export async function fetchAllMenuItems() {
  return await client.fetch(ALL_MENU_ITEMS_QUERY);
}
