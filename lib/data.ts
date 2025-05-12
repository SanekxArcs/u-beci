import { MenuItem, DailyMenu, MenuCategory } from '@/lib/types';

// Mock menu items data
export const menuItems: MenuItem[] = [
  {
    id: '1',
    name: 'Breakfast Toast Duo',
    description: 'Toasted sourdough bread with avocado, poached eggs, and a side of crispy bacon.',
    price: 12.99,
    category: 'breakfast',
    image: 'https://images.pexels.com/photos/566566/pexels-photo-566566.jpeg',
    isSpecial: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Classic Beef Goulash',
    description: 'Traditional Czech goulash with tender beef, paprika, and onions, served with bread dumplings.',
    price: 18.50,
    category: 'lunch',
    image: 'https://images.pexels.com/photos/5409009/pexels-photo-5409009.jpeg',
    isSpecial: true,
    availableOn: [new Date().toISOString()],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '3',
    name: 'Grilled Trout',
    description: 'Freshly caught trout grilled to perfection with herbs, lemon, and garlic butter, served with roasted potatoes.',
    price: 22.99,
    category: 'dinner',
    image: 'https://images.pexels.com/photos/262959/pexels-photo-262959.jpeg',
    isSpecial: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '4',
    name: 'Apple Strudel',
    description: 'Traditional Czech apple strudel with cinnamon, raisins, and a scoop of vanilla ice cream.',
    price: 8.50,
    category: 'desserts',
    image: 'https://images.pexels.com/photos/2156698/pexels-photo-2156698.jpeg',
    isSpecial: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '5',
    name: 'Craft House Beer',
    description: 'Our signature locally brewed pilsner with a smooth finish and subtle hop aroma.',
    price: 5.99,
    category: 'drinks',
    image: 'https://images.pexels.com/photos/1269025/pexels-photo-1269025.jpeg',
    isSpecial: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '6',
    name: 'Czech Svíčková',
    description: 'Marinated sirloin with cream sauce, cranberry compote, and bread dumplings.',
    price: 19.99,
    category: 'lunch',
    image: 'https://images.pexels.com/photos/675951/pexels-photo-675951.jpeg',
    isSpecial: true,
    availableOn: [new Date().toISOString()],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '7',
    name: 'Fresh Garden Salad',
    description: 'A mix of seasonal greens, cherry tomatoes, cucumber, and house dressing.',
    price: 8.99,
    category: 'sides',
    image: 'https://images.pexels.com/photos/1213710/pexels-photo-1213710.jpeg',
    isSpecial: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '8',
    name: 'Homemade Lemonade',
    description: 'Freshly squeezed lemons with a hint of mint and honey.',
    price: 4.50,
    category: 'drinks',
    image: 'https://images.pexels.com/photos/96974/pexels-photo-96974.jpeg',
    isSpecial: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// Mock daily menu data
export const dailyMenus: DailyMenu[] = [
  {
    date: new Date().toISOString(),
    menuItems: ['2', '6'],
  }
];

// Function to get menu items by category
export function getMenuItemsByCategory(category: MenuCategory): MenuItem[] {
  return menuItems.filter(item => item.category === category);
}

// Function to get today's specials
export function getTodaySpecials(): MenuItem[] {
  const today = new Date().toISOString().split('T')[0];
  return menuItems.filter(item => 
    item.isSpecial && 
    item.availableOn?.some(date => date.startsWith(today))
  );
}

// Function to get daily menu items
export function getDailyMenuItems(): MenuItem[] {
  const today = new Date().toISOString().split('T')[0];
  const dailyMenu = dailyMenus.find(menu => menu.date.startsWith(today));
  
  if (!dailyMenu) return [];
  
  return menuItems.filter(item => dailyMenu.menuItems.includes(item.id));
}