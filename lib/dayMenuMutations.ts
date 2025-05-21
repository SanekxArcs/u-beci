import { client } from '@/sanity/lib/client'
import { v4 as uuidv4 } from 'uuid'

// Create a new daily menu in Sanity
type CreateDayMenuInput = {
  date: string; // ISO date string (YYYY-MM-DD)
  menu: string[]; // Array of item _id references
  description?: string;
}

export async function createDayMenu({ date, menu, description }: CreateDayMenuInput) {
  const doc = {
    _type: 'dayMenu',
    date,
    menu: menu.map(_id => ({ _type: 'reference', _ref: _id, _key: uuidv4() })),
    description: description || '',
  }
  return await client.create(doc)
}

// Update an existing daily menu in Sanity
export async function updateDayMenu(_id: string, { date, menu, description }: CreateDayMenuInput) {
  return await client.patch(_id)
    .set({
      date,
      menu: menu.map(_id => ({ _type: 'reference', _ref: _id, _key: uuidv4() })),
      description: description || '',
    })
    .commit()
}

// Delete a daily menu from Sanity
export async function deleteDayMenu(_id: string) {
  return await client.delete(_id)
}
