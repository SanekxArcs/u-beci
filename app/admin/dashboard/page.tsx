"use client"

import React, { useEffect, useState } from 'react'
import { fetchAllMenuItems } from '@/lib/fetchMenuItems'
import { fetchDayMenusWithItems } from '@/lib/fetchDayMenus'
import { ALL_MENU_ITEMS_QUERYResult, DAY_MENUS_WITH_ITEMS_QUERYResult } from '@/sanity/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { AdminMenuItems } from '@/components/admin/AdminMenuItems'
import { AdminDailyMenu } from '@/components/admin/AdminDailyMenu'
import {  PlusCircle, FileText, CalendarDays } from 'lucide-react'

export default function AdminDashboardPage() {
  const [menuItems, setMenuItems] = useState<ALL_MENU_ITEMS_QUERYResult>([]);
  const [dailyMenus, setDailyMenus] = useState<DAY_MENUS_WITH_ITEMS_QUERYResult>([]);
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      const [items, daily] = await Promise.all([
        fetchAllMenuItems(),
        fetchDayMenusWithItems()
      ])
      setMenuItems(items)
      setDailyMenus(daily)
      setLoading(false)
    }
    fetchData()
  }, [])

  const availableCount = menuItems.filter(i => i.isAvailable).length
  const unavailableCount = menuItems.filter(i => i.isAvailable === false).length


  if (loading) {
    return <div className="container px-4 py-8 md:px-6 md:py-12 mx-auto">Ładowanie...</div>
  }

  return (
    <div className="container px-4 py-8 md:px-6 md:py-12 mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Panel administracyjny</h1>
          <p className="text-muted-foreground">
            Zarządzaj menu i codziennymi specjalnościami.
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Wszystkie pozycje w menu
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{menuItems.length}</div>
            <p className="text-xs text-muted-foreground">pozycji w menu</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Zaplanowane menu dnia
            </CardTitle>
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dailyMenus.length}</div>
            <p className="text-xs text-muted-foreground">
              różne menu dnia
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Dostępne pozycje
            </CardTitle>
            <PlusCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{availableCount}</div>
            <p className="text-xs text-muted-foreground">dostępne teraz</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Niedostępne pozycje
            </CardTitle>
            <PlusCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{unavailableCount}</div>
            <p className="text-xs text-muted-foreground">niedostępne</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="menu" className="w-full">
        <TabsList className="grid grid-cols-2 mb-8">
          <TabsTrigger value="menu">Pozycje w menu</TabsTrigger>
          <TabsTrigger value="daily">Menu dnia</TabsTrigger>
        </TabsList>
        <TabsContent value="menu">
          <AdminMenuItems />
        </TabsContent>
        <TabsContent value="daily">
          <AdminDailyMenu />
        </TabsContent>
      </Tabs>
    </div>
  );
}