"use client"

import React, { useState, useEffect } from 'react'
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
import { Item } from '@/sanity/types'
import { fetchAllMenuItems } from '@/lib/fetchMenuItems'
import { createMenuItem, updateMenuItem, deleteMenuItem } from '@/lib/menuItemMutations'
import { fetchAllCategories } from '@/lib/fetchCategories'
import { uploadImageToSanity } from '@/lib/uploadImageToSanity'
import Image from 'next/image'

// Helper for category reference
const getCategoryRef = (id: string) => ({ _type: "reference" as const, _ref: id })

export function AdminMenuItems() {
  const [menuItems, setMenuItems] = useState<Item[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [editingItem, setEditingItem] = useState<Item | null>(null)
  const [isAddingItem, setIsAddingItem] = useState(false)
  // Store category and image as strings in form state
  const [newItem, setNewItem] = useState<Partial<Item> & { categoryId?: string; imageUrl?: string }>({
    title: '',
    description: '',
    price: 0,
    categoryId: '',
    isAvailable: true,
    imageUrl: '',
    unit: undefined,
    ingredients: [],
  })
  const [editForm, setEditForm] = useState<Partial<Item> & { categoryId?: string; imageUrl?: string }>({})
  const [categories, setCategories] = useState<{ _id: string; title: string }[]>([])
  const [newImageFile, setNewImageFile] = useState<File | null>(null)
  const [newImagePreview, setNewImagePreview] = useState<string | null>(null)
  const [editImageFile, setEditImageFile] = useState<File | null>(null)
  const [editImagePreview, setEditImagePreview] = useState<string | null>(null)

  useEffect(() => {
    fetchAllMenuItems().then(setMenuItems)
    fetchAllCategories().then(cats => setCategories(cats.map(c => ({ _id: c._id, title: c.title || '' }))))
  }, [])

  const filteredItems = menuItems.filter(item =>
    (item.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (item.description || '').toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Handle image file selection for add
  const handleNewImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    setNewImageFile(file)
    setNewItem({ ...newItem, imageUrl: '' })
    if (file) {
      setNewImagePreview(URL.createObjectURL(file))
    } else {
      setNewImagePreview(null)
    }
  }

  // Handle image file selection for edit
  const handleEditImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    setEditImageFile(file)
    setEditForm({ ...editForm, imageUrl: '' })
    if (file) {
      setEditImagePreview(URL.createObjectURL(file))
    } else {
      setEditImagePreview(null)
    }
  }

  const handleAddItem = async () => {
    if (!newItem.title || !newItem.categoryId) return
    let imageAssetId = ''
    if (newImageFile) {
      imageAssetId = await uploadImageToSanity(newImageFile)
    } else if (newItem.imageUrl) {
      imageAssetId = newItem.imageUrl
    }
    const itemToCreate: Omit<Item, '_id' | '_createdAt' | '_updatedAt' | '_rev'> = {
      ...newItem,
      _type: 'item',
      category: getCategoryRef(newItem.categoryId),
      mainImage: imageAssetId ? { _type: 'image', asset: { _type: 'reference', _ref: imageAssetId } } : undefined,
    }
    const created = await createMenuItem(itemToCreate)
    setMenuItems([created, ...menuItems])
    setNewItem({ title: '', description: '', price: 0, categoryId: '', isAvailable: true, imageUrl: '', unit: undefined, ingredients: [] })
    setNewImageFile(null)
    setNewImagePreview(null)
    setIsAddingItem(false)
    toast.success('Menu item added successfully')
  }

  const handleEditOpen = (item: Item) => {
    setEditingItem(item)
    setEditForm({
      ...item,
      categoryId: typeof item.category === 'object' && item.category?._ref ? item.category._ref : '',
      imageUrl: item.mainImage && item.mainImage.asset ? item.mainImage.asset._ref : '',
    })
    setEditImageFile(null)
    setEditImagePreview(null)
  }

  const handleUpdateItem = async () => {
    if (!editingItem || !editForm.title || !editForm.categoryId) return
    let imageAssetId = ''
    if (editImageFile) {
      imageAssetId = await uploadImageToSanity(editImageFile)
    } else if (editForm.imageUrl) {
      imageAssetId = editForm.imageUrl
    }
    const updates: Partial<Item> = {
      ...editForm,
      category: getCategoryRef(editForm.categoryId),
      mainImage: imageAssetId ? { _type: 'image', asset: { _type: 'reference', _ref: imageAssetId } } : undefined,
    }
    const updated = await updateMenuItem(editingItem._id, updates)
    setMenuItems(menuItems.map(item => item._id === updated._id ? updated : item))
    setEditingItem(null)
    setEditImageFile(null)
    setEditImagePreview(null)
    toast.success('Menu item updated successfully')
  }

  const handleDeleteItem = async (_id: string) => {
    await deleteMenuItem(_id)
    setMenuItems(menuItems.filter(item => item._id !== _id))
    toast.success('Menu item deleted successfully')
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Szukaj pozycji w menu..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Dialog open={isAddingItem} onOpenChange={setIsAddingItem}>
          <DialogTrigger asChild>
            <Button>
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
                <Label htmlFor="name" className="text-right">
                  Nazwa
                </Label>
                <Input
                  id="name"
                  value={newItem.title}
                  onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">
                  Opis
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
                  Cena
                </Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={isNaN(Number(newItem.price)) ? '' : String(newItem.price)}
                  onChange={(e) => setNewItem({ ...newItem, price: parseFloat(e.target.value) })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="category" className="text-right">
                  Kategoria
                </Label>
                <Select
                  value={newItem.categoryId}
                  onValueChange={(value) => setNewItem({ ...newItem, categoryId: value })}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(category => (
                      <SelectItem key={category._id} value={category._id}>
                        {category.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="image" className="text-right">
                  Zdjęcie
                </Label>
                <div className="col-span-3 flex flex-col gap-2">
                  <Input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={handleNewImageChange}
                  />
                  {newImagePreview && (
                    <Image src={newImagePreview} alt="Podgląd" width={96} height={96} className="h-24 rounded object-cover border" />
                  )}
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="isSpecial" className="text-right">
                  Dostępność
                </Label>
                <div className="flex items-center space-x-2 col-span-3">
                  <Switch
                    id="isSpecial"
                    checked={newItem.isAvailable || false}
                    onCheckedChange={(checked) => setNewItem({ ...newItem, isAvailable: checked })}
                  />
                  <Label htmlFor="isSpecial">
                    Dostępne?
                  </Label>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddingItem(false)}>
                Anuluj
              </Button>
              <Button onClick={handleAddItem}>
                Dodaj pozycję
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-4">
        {filteredItems.length > 0 ? (
          filteredItems.map((item) => (
            <Card key={item._id} className="p-4">
              <div className="flex flex-col md:flex-row justify-between gap-4">
                <div className="flex-grow">
                  <div className="flex justify-between">
                    <h3 className="font-bold">{item.title}</h3>
                    <span className="font-medium">${item.price ? item.price.toFixed(2) : ''}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{item.description}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs px-2 py-1 rounded-full bg-secondary text-secondary-foreground">
                      {typeof item.category === 'object' && 'title' in item.category ? String(item.category.title) : ''}
                    </span>
                    {item.isAvailable && (
                      <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">
                        Dostępne dzisiaj
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 self-end md:self-center">
                  <Dialog open={editingItem?._id === item._id} onOpenChange={(open) => !open && setEditingItem(null)}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="icon" onClick={() => handleEditOpen(item)}>
                        <Pencil className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px]">
                      <DialogHeader>
                        <DialogTitle>Edytuj pozycję w menu</DialogTitle>
                        <DialogDescription>
                          Wprowadź zmiany w pozycji menu.
                        </DialogDescription>
                      </DialogHeader>
                      {editingItem && (
                        <div className="grid gap-4 py-4">
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="edit-name" className="text-right">
                              Nazwa
                            </Label>
                            <Input
                              id="edit-name"
                              value={editForm.title}
                              onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                              className="col-span-3"
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="edit-description" className="text-right">
                              Opis
                            </Label>
                            <Textarea
                              id="edit-description"
                              value={editForm.description}
                              onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                              className="col-span-3"
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="edit-price" className="text-right">
                              Cena
                            </Label>
                            <Input
                              id="edit-price"
                              type="number"
                              step="0.01"
                              value={isNaN(Number(editForm.price)) ? '' : String(editForm.price)}
                              onChange={(e) => setEditForm({ ...editForm, price: parseFloat(e.target.value) })}
                              className="col-span-3"
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="edit-category" className="text-right">
                              Kategoria
                            </Label>
                            <Select
                              value={editForm.categoryId}
                              onValueChange={(value) => setEditForm({ ...editForm, categoryId: value })}
                            >
                              <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Select category" />
                              </SelectTrigger>
                              <SelectContent>
                                {categories.map(category => (
                                  <SelectItem key={category._id} value={category._id}>
                                    {category.title}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="edit-image" className="text-right">
                              Zdjęcie
                            </Label>
                            <div className="col-span-3 flex flex-col gap-2">
                              <Input
                                id="edit-image"
                                type="file"
                                accept="image/*"
                                onChange={handleEditImageChange}
                              />
                              {editImagePreview ? (
                                <Image src={editImagePreview} alt="Podgląd" width={96} height={96} className="h-24 rounded object-cover border" />
                              ) : (editForm.imageUrl && (
                                <span className="text-xs text-muted-foreground">Obecne zdjęcie: {editForm.imageUrl}</span>
                              ))}
                            </div>
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="edit-isSpecial" className="text-right">
                              Dostępność
                            </Label>
                            <div className="flex items-center space-x-2 col-span-3">
                              <Switch
                                id="edit-isSpecial"
                                checked={editForm.isAvailable || false}
                                onCheckedChange={(checked) => setEditForm({ ...editForm, isAvailable: checked })}
                              />
                              <Label htmlFor="edit-isSpecial">
                                Dostępne dzisiaj
                              </Label>
                            </div>
                          </div>
                        </div>
                      )}
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setEditingItem(null)}>
                          Anuluj
                        </Button>
                        <Button onClick={handleUpdateItem}>
                          Zapisz zmiany
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={() => handleDeleteItem(item._id)}
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
            <p className="text-muted-foreground">Nie znaleziono pozycji pasujących do wyszukiwania.</p>
          </div>
        )}
      </div>
    </div>
  )
}