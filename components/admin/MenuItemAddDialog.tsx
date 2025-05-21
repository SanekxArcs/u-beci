import React from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { PlusCircle } from 'lucide-react'

export function MenuItemAddDialog({
  open,
  onOpenChange,
  newItem,
  setNewItem,
  categories,
  handleAddItem
}: {
  open: boolean,
  onOpenChange: (open: boolean) => void,
  newItem: any,
  setNewItem: (item: any) => void,
  categories: { _id: string; title: string }[],
  handleAddItem: () => void
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button className='w-full md:w-auto'>
          <PlusCircle className="h-4 w-4 mr-2" />
          Dodaj nową pozycję
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Dodaj nową pozycję do menu</DialogTitle>
          <DialogDescription>
            Uzupełnij dane nowej pozycji w menu.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">Nazwa</Label>
            <Input id="name" value={newItem.title} onChange={e => setNewItem({ ...newItem, title: e.target.value })} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">Opis</Label>
            <Textarea id="description" value={newItem.description} onChange={e => setNewItem({ ...newItem, description: e.target.value })} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="price" className="text-right">Cena</Label>
            <Input id="price" type="number" step="0.01" value={isNaN(Number(newItem.price)) ? '' : String(newItem.price)} onChange={e => setNewItem({ ...newItem, price: parseFloat(e.target.value) })} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="category" className="text-right">Kategoria</Label>
            <Select value={newItem.categoryId} onValueChange={value => setNewItem({ ...newItem, categoryId: value })}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(category => (
                  <SelectItem key={category._id} value={category._id}>{category.title}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="isSpecial" className="text-right">Dostępność</Label>
            <div className="flex items-center space-x-2 col-span-3">
              <Switch id="isSpecial" checked={newItem.isAvailable || false} onCheckedChange={checked => setNewItem({ ...newItem, isAvailable: checked })} />
              <Label htmlFor="isSpecial">Dostępne?</Label>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Anuluj</Button>
          <Button onClick={handleAddItem}>Dodaj pozycję</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
