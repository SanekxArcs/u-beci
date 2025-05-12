"use client"

import React from 'react'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Star } from 'lucide-react'
import { MenuItem } from '@/lib/types'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface MenuItemCardProps {
  item: MenuItem;
  featured?: boolean;
}

export function MenuItemCard({ item, featured = false }: MenuItemCardProps) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <Card className={cn(
        "overflow-hidden h-full flex flex-col",
        featured && "shadow-lg border-primary/20"
      )}>
        <div className="relative aspect-[4/3] overflow-hidden">
          {item.image && (
            <img 
              src={item.image} 
              alt={item.name}
              className="object-cover w-full h-full transition-transform duration-300 hover:scale-105"
            />
          )}
          {item.isSpecial && (
            <div className="absolute top-3 right-3">
              <Badge className="bg-primary text-primary-foreground font-medium flex items-center gap-1">
                <Star className="h-3 w-3" />
                Today's Special
              </Badge>
            </div>
          )}
        </div>
        <CardContent className="flex-grow pt-5">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-playfair font-bold text-lg leading-tight">{item.name}</h3>
            <span className="font-medium text-lg">${item.price.toFixed(2)}</span>
          </div>
          <p className="text-muted-foreground text-sm mt-2">{item.description}</p>
        </CardContent>
        <CardFooter className="border-t pt-3 text-xs text-muted-foreground">
          <span>{getCategoryLabel(item.category)}</span>
        </CardFooter>
      </Card>
    </motion.div>
  )
}

function getCategoryLabel(category: string): string {
  const labels: Record<string, string> = {
    'breakfast': 'Breakfast',
    'lunch': 'Lunch',
    'dinner': 'Dinner',
    'drinks': 'Drinks',
    'desserts': 'Dessert',
    'starters': 'Starter',
    'mains': 'Main Course',
    'sides': 'Side Dish'
  };
  
  return labels[category] || category;
}