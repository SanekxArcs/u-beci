import { client } from '@/sanity/lib/client'
import { defineQuery } from 'next-sanity'

const ALL_CATEGORIES_QUERY = defineQuery(`*[_type == "category"]|order(title asc){
  _id,
  title
}`)

export async function fetchAllCategories() {
  return await client.fetch(ALL_CATEGORIES_QUERY)
}
