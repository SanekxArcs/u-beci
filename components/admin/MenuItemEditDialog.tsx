import React from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'

interface MenuItemEditForm {
  title: string;
  description: string;
  price: number;
  categoryId: string;
  isAvailable?: boolean;
}

export function MenuItemEditDialog({
  open,
  onOpenChange,
  editForm,
  setEditForm,
  categories,
  handleUpdateItem,
  handleCancel
}: {
  open: boolean,
  onOpenChange: (open: boolean) => void,
  editForm: MenuItemEditForm,
  setEditForm: (item: MenuItemEditForm) => void,
  categories: { _id: string; title: string }[],
  handleUpdateItem: () => void,
  handleCancel: () => void
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edytuj pozycję w menu</DialogTitle>
          <DialogDescription>Wprowadź zmiany w pozycji menu.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="edit-name" className="text-right">Nazwa</Label>
            <Input id="edit-name" value={editForm.title} onChange={e => setEditForm({ ...editForm, title: e.target.value })} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="edit-description" className="text-right">Opis</Label>
            <Textarea id="edit-description" value={editForm.description} onChange={e => setEditForm({ ...editForm, description: e.target.value })} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="edit-price" className="text-right">Cena</Label>
            <Input id="edit-price" type="number" step="0.01" value={isNaN(Number(editForm.price)) ? '' : String(editForm.price)} onChange={e => setEditForm({ ...editForm, price: parseFloat(e.target.value) })} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="edit-category" className="text-right">Kategoria</Label>
            <Select value={editForm.categoryId} onValueChange={value => setEditForm({ ...editForm, categoryId: value })}>
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
            <Label htmlFor="edit-isSpecial" className="text-right">Dostępność</Label>
            <div className="flex items-center space-x-2 col-span-3">
              <Switch id="edit-isSpecial" checked={editForm.isAvailable || false} onCheckedChange={checked => setEditForm({ ...editForm, isAvailable: checked })} />
              <Label htmlFor="edit-isSpecial">Dostępne dzisiaj</Label>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>Anuluj</Button>
          <Button onClick={handleUpdateItem}>Zapisz zmiany</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
