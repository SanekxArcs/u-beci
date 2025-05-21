import { client } from '@/sanity/lib/client'
import { defineQuery } from 'next-sanity'
import { Item } from '@/sanity/types'

const ALL_MENU_ITEMS_QUERY = defineQuery(`*[_type == "item"]|order(_createdAt desc){
  _id,
  _type,
  _createdAt,
  _updatedAt,
  _rev,
  title,
  slug,
  mainImage,
  price,
  unit,
  category->{_id, title, slug, description},
  description,
  ingredients,
  isAvailable,
  body
}`)

export async function fetchAllMenuItems(): Promise<Item[]> {
  return await client.fetch(ALL_MENU_ITEMS_QUERY)
}
