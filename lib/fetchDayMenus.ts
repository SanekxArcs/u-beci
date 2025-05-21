import { client } from '@/sanity/lib/client'
import { DAY_MENUS_WITH_ITEMS_QUERY } from '@/sanity/lib/queries'

export async function fetchDayMenusWithItems() {
  return await client.fetch(DAY_MENUS_WITH_ITEMS_QUERY)
}
