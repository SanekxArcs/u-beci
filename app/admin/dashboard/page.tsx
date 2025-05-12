"use client"

import React from 'react'
import { useRouter } from 'next/navigation'
import { menuItems, dailyMenus } from '@/lib/data'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { AdminMenuItems } from '@/components/admin/AdminMenuItems'
import { AdminDailyMenu } from '@/components/admin/AdminDailyMenu'
import { LogOut, PlusCircle, FileText, CalendarDays } from 'lucide-react'

export default function AdminDashboardPage() {
  const router = useRouter()
  
  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated')
    router.push('/admin')
  }
  
  return (
    <div className="container px-4 py-8 md:px-6 md:py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Manage your menu and daily specials.
          </p>
        </div>
        <Button
          variant="outline"
          onClick={handleLogout}
          className="mt-4 md:mt-0"
        >
          <LogOut className="h-4 w-4 mr-2" />
          Logout
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Total Menu Items
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{menuItems.length}</div>
            <p className="text-xs text-muted-foreground">items in menu</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Today&apos;s Specials
            </CardTitle>
            <PlusCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {menuItems.filter((item) => item.isSpecial).length}
            </div>
            <p className="text-xs text-muted-foreground">special items today</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Planned Daily Menus
            </CardTitle>
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dailyMenus.length}</div>
            <p className="text-xs text-muted-foreground">
              different daily menus
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="menu" className="w-full">
        <TabsList className="grid grid-cols-2 mb-8">
          <TabsTrigger value="menu">Menu Items</TabsTrigger>
          <TabsTrigger value="daily">Daily Menu</TabsTrigger>
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