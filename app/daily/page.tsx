import React from 'react'
import { getTodaySpecials, getDailyMenuItems } from '@/lib/data'
import { MenuItemCard } from '@/components/MenuItemCard'

export default function DailyPage() {
  const specialItems = getTodaySpecials();
  const dailyItems = getDailyMenuItems();
  
  // Combine items and remove duplicates
  const allItems = [...specialItems];
  dailyItems.forEach(item => {
    if (!allItems.some(i => i.id === item.id)) {
      allItems.push(item);
    }
  });

  return (
    <div className="container px-4 py-8 md:px-6 md:py-12">
      <div className="max-w-2xl mx-auto text-center mb-10">
        <h1 className="font-playfair text-3xl font-bold tracking-tight mb-3">Today's Specials</h1>
        <p className="text-muted-foreground">
          Our chef's carefully selected dishes for today, made with fresh, local ingredients.
        </p>
      </div>
      
      {allItems.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {allItems.map(item => (
            <MenuItemCard key={item.id} item={item} featured />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No special items available for today.</p>
        </div>
      )}
    </div>
  )
}