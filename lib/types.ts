export type MenuCategory = 
  | 'breakfast'
  | 'lunch'
  | 'dinner'
  | 'drinks'
  | 'desserts'
  | 'starters'
  | 'mains'
  | 'sides';

export type MenuItem = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: MenuCategory;
  image?: string;
  isSpecial?: boolean;
  availableOn?: string[]; // Array of date strings in ISO format
  createdAt: string;
  updatedAt: string;
};

export type DailyMenu = {
  date: string; // ISO date string
  menuItems: string[]; // Array of MenuItem IDs
};