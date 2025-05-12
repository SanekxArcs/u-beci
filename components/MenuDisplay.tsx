"use client"

import React, { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { MenuItemCard } from '@/components/MenuItemCard'
import { MenuCategory, MenuItem } from '@/lib/types'
import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'

interface MenuDisplayProps {
  menuByCategory: Record<MenuCategory, MenuItem[]>;
}

// Helper function to get a readable title for the category
function getCategoryTitle(category: MenuCategory) {
  const titles: Record<MenuCategory, string> = {
    breakfast: 'Breakfast',
    lunch: 'Lunch',
    dinner: 'Dinner',
    drinks: 'Drinks',
    desserts: 'Desserts',
    starters: 'Starters',
    mains: 'Main Courses',
    sides: 'Side Dishes'
  };
  
  return titles[category] || category.charAt(0).toUpperCase() + category.slice(1);
}

export function MenuDisplay({ menuByCategory }: MenuDisplayProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const categories = Object.keys(menuByCategory) as MenuCategory[];
  
  // Filter items based on search query
  const filteredMenuByCategory = Object.entries(menuByCategory).reduce((acc, [category, items]) => {
    const filteredItems = items.filter(item => 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    if (filteredItems.length > 0) {
      acc[category as MenuCategory] = filteredItems;
    }
    
    return acc;
  }, {} as Record<MenuCategory, MenuItem[]>);
  
  const filteredCategories = Object.keys(filteredMenuByCategory) as MenuCategory[];
  
  return (
    <div id="menu-categories">
      <div className="max-w-md mx-auto mb-8 relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search menu..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {filteredCategories.length > 0 ? (
        <Tabs defaultValue={filteredCategories[0]} className="w-full">
          <TabsList className="mb-8 flex flex-wrap justify-center h-auto">
            {filteredCategories.map(category => (
              <TabsTrigger key={category} value={category} className="text-sm px-4 py-2 m-1">
                {getCategoryTitle(category)}
              </TabsTrigger>
            ))}
          </TabsList>
          
          {filteredCategories.map(category => (
            <TabsContent key={category} value={category} className="mt-0">
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredMenuByCategory[category].map(item => (
                  <MenuItemCard key={item.id} item={item} />
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No menu items found matching your search.</p>
        </div>
      )}
    </div>
  )
}