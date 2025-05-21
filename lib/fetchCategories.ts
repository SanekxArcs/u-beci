import { client } from '@/sanity/lib/client'
import { defineQuery } from 'next-sanity'
import { Category } from '@/sanity/types'

const ALL_CATEGORIES_QUERY = defineQuery(`*[_type == "category"]|order(title asc){
  _id,
  title
}`)

export async function fetchAllCategories(): Promise<Category[]> {
  return await client.fetch(ALL_CATEGORIES_QUERY)
}
