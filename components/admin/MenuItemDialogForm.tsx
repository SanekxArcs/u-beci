import React from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'

export function MenuItemDialogForm({
  open,
  onOpenChange,
  item,
  setItem,
  categories,
  onSubmit,
  isEdit = false
}: {
  open: boolean,
  onOpenChange: (open: boolean) => void,
  item: any,
  setItem: (item: any) => void,
  categories: { _id: string; title: string }[],
  onSubmit: (doc: any) => void,
  isEdit?: boolean
}) {
  const handleSubmit = () => {
    // Prepare only schema fields
    const {
      title,
      slug,
      price,
      unit,
      description,
      ingredients,
      isAvailable,
      body,
      categoryId,
    //   mainImageAlt,
    //   mainImageFile,
      ...rest
    } = item;
    const doc: any = {
      title,
      slug: { current: slug || (title ? title.toLowerCase().replace(/\s+/g, '-') : '') },
      price,
      unit,
      description,
      ingredients,
      isAvailable,
      // Convert body string to blockContent array if needed
      body: Array.isArray(body) ? body : (body ? [{ _type: 'block', children: [{ _type: 'span', text: body }] }] : undefined),
      category: categoryId ? { _type: 'reference', _ref: categoryId } : undefined,
      // mainImage: handle upload elsewhere
      ...rest
    };
    onSubmit(doc);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Edytuj pozycję w menu' : 'Dodaj nową pozycję do menu'}</DialogTitle>
          <DialogDescription>
            {isEdit ? 'Wprowadź zmiany w pozycji menu.' : 'Uzupełnij dane nowej pozycji w menu.'}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">Nazwa</Label>
            <Input id="name" value={item.title} onChange={e => setItem({ ...item, title: e.target.value })} className="col-span-3" />
          </div>
          {/* Slug, image, and alt fields hidden */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="price" className="text-right">Cena</Label>
            <Input id="price" type="number" step="0.01" value={isNaN(Number(item.price)) ? '' : String(item.price)} onChange={e => setItem({ ...item, price: parseFloat(e.target.value) })} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="unit" className="text-right">Jednostka</Label>
            <Select value={item.unit || ''} onValueChange={value => setItem({ ...item, unit: value })}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Wybierz jednostkę" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="szt">szt</SelectItem>
                <SelectItem value="gram">gram</SelectItem>
                <SelectItem value="ml">ml</SelectItem>
                <SelectItem value="litr">litr</SelectItem>
                <SelectItem value="kg">kg</SelectItem>
                <SelectItem value="porcja">porcja</SelectItem>
                <SelectItem value="komplet">komplet</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="category" className="text-right">Kategoria</Label>
            <Select value={item.categoryId} onValueChange={value => setItem({ ...item, categoryId: value })}>
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
            <Label htmlFor="description" className="text-right">Opis</Label>
            <Textarea id="description" value={item.description} onChange={e => setItem({ ...item, description: e.target.value })} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="ingredients" className="text-right">Składniki</Label>
            <Textarea id="ingredients" value={Array.isArray(item.ingredients) ? item.ingredients.join(', ') : ''} onChange={e => setItem({ ...item, ingredients: e.target.value.split(',').map((s: string) => s.trim()).filter(Boolean) })} className="col-span-3" placeholder="Oddziel przecinkami..." />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="isSpecial" className="text-right">Dostępność</Label>
            <div className="flex items-center space-x-2 col-span-3">
              <Switch id="isSpecial" checked={item.isAvailable || false} onCheckedChange={checked => setItem({ ...item, isAvailable: checked })} />
              <Label htmlFor="isSpecial">Dostępne?</Label>
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="body" className="text-right">Treść</Label>
            <Textarea id="body" value={item.body || ''} onChange={e => setItem({ ...item, body: e.target.value })} className="col-span-3" placeholder="Treść (opcjonalnie)" />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Anuluj</Button>
          <Button onClick={handleSubmit}>{isEdit ? 'Zapisz zmiany' : 'Dodaj pozycję'}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
