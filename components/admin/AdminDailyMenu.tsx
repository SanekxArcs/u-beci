"use client"

import React, { useState, useEffect } from 'react'
import { fetchDayMenusWithItems } from '@/lib/fetchDayMenus'
import { DAY_MENUS_WITH_ITEMS_QUERYResult } from '@/sanity/types'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { format } from 'date-fns'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { CalendarIcon, PlusCircle, Pencil, Trash2, Copy } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { fetchAllMenuItems } from '@/lib/fetchMenuItems'
import { ALL_MENU_ITEMS_QUERYResult } from '@/sanity/types'
import { createDayMenu, updateDayMenu, deleteDayMenu } from '@/lib/dayMenuMutations'

export function AdminDailyMenu() {
  const [dailyMenus, setDailyMenus] = useState<DAY_MENUS_WITH_ITEMS_QUERYResult>([])
  const [allMenuItems, setAllMenuItems] = useState<ALL_MENU_ITEMS_QUERYResult>([])
  const [loading, setLoading] = useState(true)
  // Dialog state
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingMenu, setEditingMenu] = useState<any | null>(null)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [description, setDescription] = useState<string>('')
  const [isCopy, setIsCopy] = useState(false)
  const [hidePast, setHidePast] = useState(true)
  const [sortAsc, setSortAsc] = useState(true)

  useEffect(() => {
    async function fetchMenus() {
      setLoading(true)
      const [menus, items] = await Promise.all([
        fetchDayMenusWithItems(),
        fetchAllMenuItems()
      ])
      setDailyMenus(menus)
      setAllMenuItems(items)
      setLoading(false)
    }
    fetchMenus()
  }, [])

  // Add this function to reload menus and items
  const handleRefresh = async () => {
    setLoading(true)
    const [menus, items] = await Promise.all([
      fetchDayMenusWithItems(),
      fetchAllMenuItems()
    ])
    setDailyMenus(menus)
    setAllMenuItems(items)
    setLoading(false)
  }

  // Helper to determine if a menu is in the past
  const isPast = (dateStr: string | null | undefined) => {
    if (!dateStr) return false
    const menuDate = new Date(dateStr)
    const today = new Date()
    today.setHours(0,0,0,0)
    menuDate.setHours(0,0,0,0)
    return menuDate < today
  }

  // Sort and filter menus
  let filteredMenus = dailyMenus.slice()
  if (hidePast) {
    filteredMenus = filteredMenus.filter(menu => !isPast(menu.date))
  }
  filteredMenus.sort((a, b) => {
    if (!a.date) return 1
    if (!b.date) return -1
    return sortAsc
      ? new Date(a.date).getTime() - new Date(b.date).getTime()
      : new Date(b.date).getTime() - new Date(a.date).getTime()
  })

  // Open dialog for add/edit/copy
  const openDialog = (menu?: any, copyMode = false) => {
    setEditingMenu(menu || null)
    setIsCopy(copyMode)
    setDialogOpen(true)
    if (menu) {
      setSelectedDate(copyMode ? undefined : (menu.date ? new Date(menu.date) : undefined))
      setSelectedItems(menu.menu ? menu.menu.map((item: any) => item._id) : [])
      setDescription(menu.description || '')
    } else {
      setSelectedDate(undefined)
      setSelectedItems([])
      setDescription('')
    }
  }
  const closeDialog = () => {
    setDialogOpen(false)
    setEditingMenu(null)
    setSelectedDate(undefined)
    setSelectedItems([])
    setDescription('')
    setIsCopy(false)
  }

  // Local add/edit/delete/copy logic (replace with Sanity mutations in future)
  const handleSave = async () => {
    if (!selectedDate || selectedItems.length === 0) return
    const dateStr = selectedDate.toISOString().split('T')[0]
    if (editingMenu && !isCopy) {
      // Edit existing in Sanity
      await updateDayMenu(editingMenu._id, {
        date: dateStr,
        menu: selectedItems,
        description,
      })
    } else {
      // Add new or copy in Sanity
      await createDayMenu({
        date: dateStr,
        menu: selectedItems,
        description,
      })
    }
    // Always refresh menus from Sanity after add, edit, or copy
    setLoading(true)
    const menus = await fetchDayMenusWithItems()
    setDailyMenus(menus)
    setLoading(false)
    closeDialog()
  }
  const handleDelete = async (menuId: string) => {
    await deleteDayMenu(menuId)
    setLoading(true)
    const [menus, items] = await Promise.all([
      fetchDayMenusWithItems(),
      fetchAllMenuItems()
    ])
    setDailyMenus(menus)
    setAllMenuItems(items)
    setLoading(false)
  }

  if (loading) {
    return <div>Ładowanie menu dziennego...</div>
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Menu dzienne</h2>
        <div className="flex gap-2">
          <Button onClick={handleRefresh} variant="outline">
            Odśwież
          </Button>
          <Button onClick={() => setHidePast(h => !h)} variant="outline">
            {hidePast ? 'Pokaż przeszłe' : 'Ukryj przeszłe'}
          </Button>
          <Button onClick={() => setSortAsc(s => !s)} variant="outline">
            Sortuj wg daty {sortAsc ? '▲' : '▼'}
          </Button>
          <Button onClick={() => openDialog()}>
            <PlusCircle className="h-4 w-4 mr-2" /> Dodaj menu dnia
          </Button>
        </div>
      </div>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{editingMenu ? (isCopy ? 'Kopiuj menu dnia' : 'Edytuj menu dnia') : 'Utwórz nowe menu dnia'}</DialogTitle>
            <DialogDescription>
              {editingMenu ? (isCopy ? 'Wybierz nową datę i skopiuj pozycje menu.' : 'Zaktualizuj datę, pozycje menu i opis dla tego menu dnia.') : 'Wybierz datę, pozycje menu i dodaj opis na ten dzień.'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-6 py-4">
            <div className="space-y-2">
              <Label>Wybierz datę</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant={"outline"} className="w-full justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDate ? format(selectedDate, "PPP") : <span>Wybierz datę</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <input type="date" className="border rounded p-2" value={selectedDate ? selectedDate.toISOString().split('T')[0] : ''} onChange={e => setSelectedDate(e.target.value ? new Date(e.target.value) : undefined)} />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2">
              <Label>Wybierz pozycje menu</Label>
              <div className="border rounded-md p-4 h-[300px] overflow-y-auto space-y-4">
                {allMenuItems.map(item => (
                  <div key={item._id} className="flex items-center space-x-2">
                    <Checkbox id={`item-${item._id}`} checked={selectedItems.includes(item._id)} onCheckedChange={() => setSelectedItems(selectedItems.includes(item._id) ? selectedItems.filter(id => id !== item._id) : [...selectedItems, item._id])} />
                    <Label htmlFor={`item-${item._id}`} className="flex-grow cursor-pointer">
                      <div className="font-medium">{item.title}</div>
                      <div className="text-xs text-muted-foreground">{item.category?.title || ''} - {item.price != null ? `${item.price.toFixed(2)} zł` : ''}</div>
                    </Label>
                  </div>
                ))}
              </div>
              <p className="text-sm text-muted-foreground">{selectedItems.length} pozycj{selectedItems.length === 1 ? 'a' : (selectedItems.length >= 2 && selectedItems.length <= 4 ? 'e' : 'i')} wybrano</p>
            </div>
            <div className="space-y-2">
              <Label>Opis</Label>
              <textarea className="border rounded-md p-2 w-full min-h-[60px]" value={description} onChange={e => setDescription(e.target.value)} placeholder="Opis (opcjonalnie)" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={closeDialog}>Anuluj</Button>
            <Button onClick={handleSave}>{editingMenu && !isCopy ? 'Zaktualizuj menu' : 'Zapisz menu'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <div className="space-y-6">
        {filteredMenus.length > 0 ? (
          filteredMenus.map(menu => {
            const menuDate = menu.date ? new Date(menu.date) : null;
            const menuItems = menu.menu || [];
            return (
              <Card key={menu._id}>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-lg font-medium">
                    {menuDate ? format(menuDate, "PPPP") : 'Brak daty'}
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="icon" onClick={() => openDialog(menu, false)}>
                      <Pencil className="h-4 w-4" />
                      <span className="sr-only">Edytuj</span>
                    </Button>
                    <Button variant="outline" size="icon" onClick={() => openDialog(menu, true)}>
                      <Copy className="h-4 w-4" />
                      <span className="sr-only">Kopiuj</span>
                    </Button>
                    <Button variant="outline" size="icon" onClick={() => handleDelete(menu._id)} className="text-destructive hover:text-destructive hover:bg-destructive/10">
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Usuń</span>
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {menuItems.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Pozycja</TableHead>
                          <TableHead>Kategoria</TableHead>
                          <TableHead className="text-right">Cena</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {menuItems.map((item: any, idx: number) => (
                          <TableRow key={item._id + '-' + idx}>
                            <TableCell className="font-medium">{item.title}</TableCell>
                            <TableCell>{item.category?.title || ''}</TableCell>
                            <TableCell className="text-right">{item.price != null ? `${item.price.toFixed(2)} zł` : ''}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <p className="text-muted-foreground">Brak pozycji wybranych na ten dzień.</p>
                  )}
                </CardContent>
              </Card>
            );
          })
        ) : (
          <div className="text-center py-12 border rounded-lg">
            <p className="text-muted-foreground">Nie utworzono jeszcze żadnego menu dnia.</p>
          </div>
        )}
      </div>
    </div>
  )
}