"use client"

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {  Pencil, Trash2, Search } from 'lucide-react'
import { toast } from "sonner"
import { Item } from '@/sanity/types'
import { fetchAllMenuItems } from '@/lib/fetchMenuItems'
import { createMenuItem, updateMenuItem, deleteMenuItem } from '@/lib/menuItemMutations'
import { fetchAllCategories } from '@/lib/fetchCategories'
import { MenuItemDialogForm, MenuItemFormData } from './MenuItemDialogForm'
import type { BlockContent, } from '@/sanity/types'


// Helper to add _key to block content (no any, use unknown and type guards, and fix style type)
function ensureBlockContentKeys(body: unknown): BlockContent | undefined {
  if (!Array.isArray(body)) return undefined;
  return body.map((block): BlockContent[number] => {
    if (
      typeof block === 'object' &&
      block !== null &&
      '_type' in block &&
      (block as { _type: string })._type === 'block'
    ) {
      const b = block as {
        _type: 'block';
        _key?: string;
        style?: 'normal' | 'h1' | 'h2' | 'h3' | 'h4' | 'blockquote';
        children?: unknown[];
        [key: string]: unknown;
      };
      return {
        ...b,
        style: (b.style as 'normal' | 'h1' | 'h2' | 'h3' | 'h4' | 'blockquote') ?? 'normal',
        _key: b._key || (typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2)),
        children: Array.isArray(b.children)
          ? b.children
              .filter((child): child is NonNullable<typeof b.children>[number] =>
                typeof child === 'object' && child !== null && '_type' in child && (child as { _type: string })._type === 'span'
              )
              .map((child) => {
                const c = child as {
                  _type: 'span';
                  _key?: string;
                  text?: string;
                  marks?: string[];
                };
                return {
                  ...c,
                  _key:
                    c._key ||
                    (typeof crypto !== 'undefined' && crypto.randomUUID
                      ? crypto.randomUUID()
                      : Math.random().toString(36).slice(2)),
                };
              })
          : [],
      };
    }
    // For image blocks or others
    if (
      typeof block === 'object' &&
      block !== null &&
      '_type' in block &&
      (block as { _type: string })._type === 'image'
    ) {
      const img = block as { _type: 'image'; _key?: string; [key: string]: unknown };
      return {
        ...img,
        _key: img._key || (typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2)),
      };
    }
    // fallback for unknown block types
    return block as BlockContent[number];
  });
}

export function AdminMenuItems() {
  const [menuItems, setMenuItems] = useState<Item[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [editingItem, setEditingItem] = useState<Item | null>(null)
  const [isAddingItem, setIsAddingItem] = useState(false)
  // Remove image-related fields from form state
  const [newItem, setNewItem] = useState<MenuItemFormData & { categoryId?: string }>(
    {
      title: '',
      description: '',
      price: 0,
      categoryId: '',
      isAvailable: true,
      unit: '',
      ingredients: [],
      body: undefined,
      slug: undefined,
    }
  )
  const [editForm, setEditForm] = useState<MenuItemFormData & { categoryId?: string }>(
    {
      title: '',
      description: '',
      price: 0,
      categoryId: '',
      isAvailable: true,
      unit: '',
      ingredients: [],
      body: undefined,
      slug: undefined,
    }
  )

  const [categories, setCategories] = useState<{ _id: string; title: string }[]>([])

  useEffect(() => {
    fetchAllMenuItems().then(data => {
      setMenuItems(
        data.map(item => ({
          _id: item._id,
          _type: item._type,
          _createdAt: item._createdAt,
          _updatedAt: item._updatedAt,
          _rev: item._rev,
          title: item.title ?? '',
          slug: item.slug ?? undefined,
          price: item.price ?? 0,
          unit: item.unit ?? undefined,
          category: item.category
            ? { _ref: item.category._id, _type: 'reference' }
            : undefined,
          description: item.description ?? '',
          ingredients: item.ingredients ?? [],
          isAvailable: item.isAvailable ?? true,

        }) as Item)
      )
    })
    fetchAllCategories().then(cats => setCategories(cats.map(c => ({ _id: c._id, title: c.title || '' }))))
  }, [])

  const filteredItems = menuItems.filter(item =>
    (item.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (item.description || '').toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleAddItem = async (docOverride?: MenuItemFormData & { categoryId?: string }) => {
    const doc = docOverride || newItem;
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
      ...rest
    } = doc;
    const itemToCreate: Omit<Item, '_id' | '_createdAt' | '_updatedAt' | '_rev'> = {
      _type: 'item',
      title,
      slug: { _type: 'slug', current: slug || (title ? title.toLowerCase().replace(/\s+/g, '-') : '') },
      price,
      unit: unit as Item['unit'],
      description,
      ingredients,
      isAvailable,
      body: Array.isArray(body)
        ? ensureBlockContentKeys(body)
        : (body ? ensureBlockContentKeys([{ _type: 'block', style: 'normal', _key: (typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2)), children: [{ _type: 'span', text: body, _key: (typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2)) }] }]) : undefined),
      category: categoryId ? { _type: 'reference', _ref: categoryId } : undefined,
      ...rest
    };
    const created = await createMenuItem(itemToCreate);
    setMenuItems([created, ...menuItems]);
    setNewItem({ title: '', description: '', price: 0, categoryId: '', isAvailable: true, unit: '', ingredients: [], body: undefined, slug: undefined });
    setIsAddingItem(false);
    toast.success('Menu item added successfully');
  };

  const handleEditOpen = (item: Item) => {
    setEditingItem(item)
    setEditForm({
      title: item.title ?? '',
      description: item.description ?? '',
      price: item.price ?? 0,
      unit: item.unit ?? '',
      ingredients: item.ingredients ?? [],
      isAvailable: item.isAvailable ?? true,
      body: item.body ?? undefined,
      slug: item.slug?.current ?? '',
      categoryId: typeof item.category === 'object' && item.category?._ref ? item.category._ref : '',
    })
  }

  const handleUpdateItem = async (docOverride?: MenuItemFormData & { categoryId?: string }) => {
    if (!editingItem || !editForm.title || !editForm.categoryId) return;
    const doc = docOverride || editForm;
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
      ...rest
    } = doc;
    const updates: Partial<Item> = {
      title,
      slug: { _type: 'slug', current: slug || (title ? title.toLowerCase().replace(/\s+/g, '-') : '') },
      price,
      unit: unit as Item['unit'],
      description,
      ingredients,
      isAvailable,
      body: Array.isArray(body)
        ? ensureBlockContentKeys(body)
        : (body ? ensureBlockContentKeys([{ _type: 'block', style: 'normal', _key: (typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2)), children: [{ _type: 'span', text: body, _key: (typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2)) }] }]) : undefined),
      category: categoryId ? { _type: 'reference', _ref: categoryId } : undefined,
      ...rest
    };
    const updated = await updateMenuItem(editingItem._id, updates);
    setMenuItems(menuItems.map(item => item._id === updated._id ? updated : item));
    setEditingItem(null);
    toast.success('Menu item updated successfully');
  };

  const handleDeleteItem = async (_id: string) => {
    await deleteMenuItem(_id)
    setMenuItems(menuItems.filter(item => item._id !== _id))
    toast.success('Menu item deleted successfully')
  }
  console.log('Menu items:', menuItems)
  console.log('Categories:', categories)

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
        <Button className="w-full md:w-auto" onClick={() => setIsAddingItem(true)}>
          Dodaj nową pozycję
        </Button>
        <MenuItemDialogForm
          open={isAddingItem}
          onOpenChange={setIsAddingItem}
          item={newItem}
          setItem={setNewItem}
          categories={categories}
          onSubmit={doc => { void handleAddItem(doc as MenuItemFormData & { categoryId?: string }); }}
          isEdit={false}
        />
      </div>

      <div className="space-y-4">
        {filteredItems.length > 0 ? (
          filteredItems.map((item) => (
            <Card key={item._id} className="p-4">
              <div className="flex flex-col md:flex-row justify-between gap-4">
                <div className="flex-grow">
                  <div className="flex justify-between">
                    <h3 className="font-bold">{item.title}</h3>
                    <span className="font-medium">{item.price ? `${item.price.toFixed(2)} zł` : ''}</span>
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
                  <MenuItemDialogForm
                    open={editingItem?._id === item._id}
                    onOpenChange={(open) => !open && setEditingItem(null)}
                    item={editForm}
                    setItem={setEditForm}
                    categories={categories}
                    onSubmit={doc => { void handleUpdateItem(doc as MenuItemFormData & { categoryId?: string }); }}
                    isEdit={true}
                  />
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={() => handleEditOpen(item)}
                  >
                    <Pencil className="h-4 w-4" />
                    <span className="sr-only">Edytuj</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={() => handleDeleteItem(item._id)}
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Usuń</span>
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