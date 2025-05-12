"use client"

import React, { useState } from 'react'
import { dailyMenus as initialDailyMenus, menuItems } from '@/lib/data'
import { DailyMenu, MenuItem } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Calendar } from '@/components/ui/calendar'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { format } from 'date-fns'
import { CalendarIcon, PlusCircle, Pencil, Trash2 } from 'lucide-react'
import { toast } from "sonner"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export function AdminDailyMenu() {
  const [dailyMenus, setDailyMenus] = useState<DailyMenu[]>(initialDailyMenus)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [editing, setEditing] = useState<boolean>(false)
  const [editingMenuIndex, setEditingMenuIndex] = useState<number | null>(null)
  
  const handleDailyMenuSave = () => {
    if (!selectedDate) return
    
    const dateStr = selectedDate.toISOString().split('T')[0] + 'T00:00:00.000Z'
    
    if (editing && editingMenuIndex !== null) {
      // Update existing menu
      const updatedMenus = [...dailyMenus]
      updatedMenus[editingMenuIndex] = {
        date: dateStr,
        menuItems: selectedItems
      }
      setDailyMenus(updatedMenus)
      toast.success("Daily menu updated successfully")
    } else {
      // Add new menu
      const newMenu: DailyMenu = {
        date: dateStr,
        menuItems: selectedItems
      }
      setDailyMenus([...dailyMenus, newMenu])
      toast.success("Daily menu created successfully")
    }
    
    resetForm()
  }
  
  const handleEditMenu = (index: number) => {
    const menu = dailyMenus[index]
    setSelectedDate(new Date(menu.date))
    setSelectedItems(menu.menuItems)
    setEditing(true)
    setEditingMenuIndex(index)
  }
  
  const handleDeleteMenu = (index: number) => {
    const updatedMenus = dailyMenus.filter((_, i) => i !== index)
    setDailyMenus(updatedMenus)
    toast.success("Daily menu deleted successfully")
  }
  
  const handleItemToggle = (itemId: string) => {
    if (selectedItems.includes(itemId)) {
      setSelectedItems(selectedItems.filter(id => id !== itemId))
    } else {
      setSelectedItems([...selectedItems, itemId])
    }
  }
  
  const resetForm = () => {
    setSelectedDate(new Date())
    setSelectedItems([])
    setEditing(false)
    setEditingMenuIndex(null)
  }
  
  const getMenuItemsForDate = (date: string): MenuItem[] => {
    const menu = dailyMenus.find(menu => menu.date.startsWith(date.split('T')[0]))
    if (!menu) return []
    
    return menuItems.filter(item => menu.menuItems.includes(item.id))
  }
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Daily Menus</h2>
        <Dialog onOpenChange={(open) => !open && resetForm()}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="h-4 w-4 mr-2" />
              Create Daily Menu
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>{editing ? "Edit Daily Menu" : "Create New Daily Menu"}</DialogTitle>
              <DialogDescription>
                {editing 
                  ? "Update the date and menu items for this daily menu." 
                  : "Select a date and choose menu items to feature that day."}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-6 py-4">
              <div className="space-y-2">
                <Label>Select Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              <div className="space-y-2">
                <Label>Select Menu Items</Label>
                <div className="border rounded-md p-4 h-[300px] overflow-y-auto space-y-4">
                  {menuItems.map(item => (
                    <div key={item.id} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`item-${item.id}`} 
                        checked={selectedItems.includes(item.id)}
                        onCheckedChange={() => handleItemToggle(item.id)}
                      />
                      <Label htmlFor={`item-${item.id}`} className="flex-grow cursor-pointer">
                        <div className="font-medium">{item.name}</div>
                        <div className="text-xs text-muted-foreground">{item.category} - ${item.price.toFixed(2)}</div>
                      </Label>
                    </div>
                  ))}
                </div>
                <p className="text-sm text-muted-foreground">
                  {selectedItems.length} item{selectedItems.length !== 1 && 's'} selected
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={resetForm}>
                Cancel
              </Button>
              <Button onClick={handleDailyMenuSave}>
                {editing ? "Update Menu" : "Create Menu"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="space-y-6">
        {dailyMenus.length > 0 ? (
          dailyMenus.map((menu, index) => {
            const menuDate = new Date(menu.date);
            const menuItems = getMenuItemsForDate(menu.date);
            
            return (
              <Card key={index}>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-lg font-medium">
                    {format(menuDate, "PPPP")}
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="icon" onClick={() => handleEditMenu(index)}>
                      <Pencil className="h-4 w-4" />
                      <span className="sr-only">Edit</span>
                    </Button>
                    <Button 
                      variant="outline" 
                      size="icon" 
                      onClick={() => handleDeleteMenu(index)}
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Delete</span>
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {menuItems.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Item</TableHead>
                          <TableHead>Category</TableHead>
                          <TableHead className="text-right">Price</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {menuItems.map(item => (
                          <TableRow key={item.id}>
                            <TableCell className="font-medium">{item.name}</TableCell>
                            <TableCell>{item.category}</TableCell>
                            <TableCell className="text-right">${item.price.toFixed(2)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <p className="text-muted-foreground">No items selected for this day.</p>
                  )}
                </CardContent>
              </Card>
            );
          })
        ) : (
          <div className="text-center py-12 border rounded-lg">
            <p className="text-muted-foreground">No daily menus created yet.</p>
          </div>
        )}
      </div>
    </div>
  )
}