"use client"

import React, { useState } from 'react'
import { menuItems as initialMenuItems } from '@/lib/data'
import { MenuItem, MenuCategory } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { PlusCircle, Pencil, Trash2, Search } from 'lucide-react'
import { toast } from "sonner"

export function AdminMenuItems() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>(initialMenuItems)
  const [searchQuery, setSearchQuery] = useState('')
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null)
  const [isAddingItem, setIsAddingItem] = useState(false)
  const [newItem, setNewItem] = useState<Partial<MenuItem>>({
    name: '',
    description: '',
    price: 0,
    category: 'mains',
    isSpecial: false,
    image: ''
  })
  
  // Filter menu items based on search query
  const filteredItems = menuItems.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase())
  )
  
  const handleAddItem = () => {
    const id = Date.now().toString()
    const timestamp = new Date().toISOString()
    
    const item: MenuItem = {
      id,
      name: newItem.name || '',
      description: newItem.description || '',
      price: newItem.price || 0,
      category: newItem.category as MenuCategory || 'mains',
      image: newItem.image,
      isSpecial: newItem.isSpecial || false,
      createdAt: timestamp,
      updatedAt: timestamp
    }
    
    setMenuItems([...menuItems, item])
    setNewItem({
      name: '',
      description: '',
      price: 0,
      category: 'mains',
      isSpecial: false,
      image: ''
    })
    setIsAddingItem(false)
    toast.success("Menu item added successfully")
  }
  
  const handleUpdateItem = () => {
    if (!editingItem) return
    
    const updatedItems = menuItems.map(item => 
      item.id === editingItem.id 
        ? { ...editingItem, updatedAt: new Date().toISOString() } 
        : item
    )
    
    setMenuItems(updatedItems)
    setEditingItem(null)
    toast.success("Menu item updated successfully")
  }
  
  const handleDeleteItem = (id: string) => {
    setMenuItems(menuItems.filter(item => item.id !== id))
    toast.success("Menu item deleted successfully")
  }
  
  const categoryOptions: MenuCategory[] = [
    'breakfast',
    'lunch',
    'dinner',
    'drinks',
    'desserts',
    'starters',
    'mains',
    'sides'
  ]
  
  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search menu items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Dialog open={isAddingItem} onOpenChange={setIsAddingItem}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add New Item
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Add New Menu Item</DialogTitle>
              <DialogDescription>
                Fill in the details for the new menu item.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  value={newItem.name}
                  onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">
                  Description
                </Label>
                <Textarea
                  id="description"
                  value={newItem.description}
                  onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="price" className="text-right">
                  Price
                </Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={newItem.price}
                  onChange={(e) => setNewItem({ ...newItem, price: parseFloat(e.target.value) })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="category" className="text-right">
                  Category
                </Label>
                <Select
                  value={newItem.category as string}
                  onValueChange={(value) => setNewItem({ ...newItem, category: value as MenuCategory })}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categoryOptions.map(category => (
                      <SelectItem key={category} value={category}>
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="image" className="text-right">
                  Image URL
                </Label>
                <Input
                  id="image"
                  value={newItem.image || ''}
                  onChange={(e) => setNewItem({ ...newItem, image: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="isSpecial" className="text-right">
                  Special Item
                </Label>
                <div className="flex items-center space-x-2 col-span-3">
                  <Switch
                    id="isSpecial"
                    checked={newItem.isSpecial || false}
                    onCheckedChange={(checked) => setNewItem({ ...newItem, isSpecial: checked })}
                  />
                  <Label htmlFor="isSpecial">
                    Mark as today's special
                  </Label>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddingItem(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddItem}>
                Add Item
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-4">
        {filteredItems.length > 0 ? (
          filteredItems.map((item) => (
            <Card key={item.id} className="p-4">
              <div className="flex flex-col md:flex-row justify-between gap-4">
                <div className="flex-grow">
                  <div className="flex justify-between">
                    <h3 className="font-bold">{item.name}</h3>
                    <span className="font-medium">${item.price.toFixed(2)}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{item.description}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs px-2 py-1 rounded-full bg-secondary text-secondary-foreground">
                      {item.category}
                    </span>
                    {item.isSpecial && (
                      <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">
                        Today's Special
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 self-end md:self-center">
                  <Dialog open={editingItem?.id === item.id} onOpenChange={(open) => !open && setEditingItem(null)}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="icon" onClick={() => setEditingItem(item)}>
                        <Pencil className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px]">
                      <DialogHeader>
                        <DialogTitle>Edit Menu Item</DialogTitle>
                        <DialogDescription>
                          Make changes to the menu item.
                        </DialogDescription>
                      </DialogHeader>
                      {editingItem && (
                        <div className="grid gap-4 py-4">
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="edit-name" className="text-right">
                              Name
                            </Label>
                            <Input
                              id="edit-name"
                              value={editingItem.name}
                              onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                              className="col-span-3"
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="edit-description" className="text-right">
                              Description
                            </Label>
                            <Textarea
                              id="edit-description"
                              value={editingItem.description}
                              onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                              className="col-span-3"
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="edit-price" className="text-right">
                              Price
                            </Label>
                            <Input
                              id="edit-price"
                              type="number"
                              step="0.01"
                              value={editingItem.price}
                              onChange={(e) => setEditingItem({ ...editingItem, price: parseFloat(e.target.value) })}
                              className="col-span-3"
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="edit-category" className="text-right">
                              Category
                            </Label>
                            <Select
                              value={editingItem.category}
                              onValueChange={(value) => setEditingItem({ ...editingItem, category: value as MenuCategory })}
                            >
                              <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Select category" />
                              </SelectTrigger>
                              <SelectContent>
                                {categoryOptions.map(category => (
                                  <SelectItem key={category} value={category}>
                                    {category.charAt(0).toUpperCase() + category.slice(1)}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="edit-image" className="text-right">
                              Image URL
                            </Label>
                            <Input
                              id="edit-image"
                              value={editingItem.image || ''}
                              onChange={(e) => setEditingItem({ ...editingItem, image: e.target.value })}
                              className="col-span-3"
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="edit-isSpecial" className="text-right">
                              Special Item
                            </Label>
                            <div className="flex items-center space-x-2 col-span-3">
                              <Switch
                                id="edit-isSpecial"
                                checked={editingItem.isSpecial || false}
                                onCheckedChange={(checked) => setEditingItem({ ...editingItem, isSpecial: checked })}
                              />
                              <Label htmlFor="edit-isSpecial">
                                Mark as today's special
                              </Label>
                            </div>
                          </div>
                        </div>
                      )}
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setEditingItem(null)}>
                          Cancel
                        </Button>
                        <Button onClick={handleUpdateItem}>
                          Save Changes
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={() => handleDeleteItem(item.id)}
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Delete</span>
                  </Button>
                </div>
              </div>
            </Card>
          ))
        ) : (
          <div className="text-center py-12 border rounded-lg">
            <p className="text-muted-foreground">No menu items found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  )
}