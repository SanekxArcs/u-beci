"use client"
import { useEffect, useState } from 'react'
import { fetchDayMenusWithItems } from '@/lib/fetchDayMenus'
import {  DAY_MENUS_WITH_ITEMS_QUERYResult } from '@/sanity/types';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover'
import { MoreHorizontal } from 'lucide-react'
import { MenuDay } from './MenuDay'
import { Item } from '@/sanity/types'

export function MenuDisplay() {
  const [menus, setMenus] = useState<DAY_MENUS_WITH_ITEMS_QUERYResult | null>(null);
  const [selectedTab, setSelectedTab] = useState<string>('today');
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Helper to parse and compare dates
  function isToday(dateStr: string) {
    const today = new Date();
    const d = new Date(dateStr);
    return d.getFullYear() === today.getFullYear() && d.getMonth() === today.getMonth() && d.getDate() === today.getDate();
  }

  useEffect(() => {
    async function fetchData() {
      const data = await fetchDayMenusWithItems()
      setMenus(data)
      console.log('Fetched menus from sanity:', data)
    }
    fetchData()
  }, [])

  // Prepare all menus sorted by date ascending
  const allMenus = (menus ? [...menus] : []).sort((a, b) => {
    if (!a.date) return 1;
    if (!b.date) return -1;
    return new Date(a.date).getTime() - new Date(b.date).getTime();
  });

  // Find today's menu id if exists
  const todayMenuObj = allMenus.find(m => m.date && isToday(m.date));
  const todayMenuId = todayMenuObj?._id;

  // Prepare tabs: label is 'Dzisiaj' for today, otherwise date
  const allTabs = allMenus.map(m => ({
    key: m._id,
    date: m.date,
    label: m.date && isToday(m.date)
      ? 'Dzisiaj'
      : (m.date ? new Date(m.date).toLocaleDateString('pl-PL', { weekday: 'short', day: '2-digit', month: '2-digit' }) : 'Brak daty'),
  }));

  // Set default selected tab to today if exists, else first menu
  useEffect(() => {
    if (allTabs.length > 0) {
      if (todayMenuId) setSelectedTab(todayMenuId);
      else setSelectedTab(allTabs[0].key);
    }
  }, [allTabs, todayMenuId]);

  return (
    <Tabs value={selectedTab} onValueChange={setSelectedTab}>
      <TabsList>
        {allTabs.map(tab => (
          <TabsTrigger
            key={tab.key}
            value={tab.key}
            onClick={() => setSelectedTab(tab.key)}
          >
            {tab.label}
          </TabsTrigger>
        ))}
        <Popover open={showDatePicker} onOpenChange={setShowDatePicker}>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" aria-label="Wszystkie daty"><MoreHorizontal /></Button>
          </PopoverTrigger>
          <PopoverContent align="end">
            <div className="flex flex-col gap-2">
              {allTabs.map(tab => (
                <Button
                  key={tab.key}
                  variant="ghost"
                  onClick={() => {
                    setSelectedTab(tab.key);
                    setShowDatePicker(false);
                  }}
                  aria-pressed={selectedTab === tab.key}
                >
                  {tab.label}
                </Button>
              ))}
            </div>
          </PopoverContent>
        </Popover>
      </TabsList>
      {allTabs.map(tab => {
        const menuObj = allMenus.find(m => m._id === tab.key);
        return (
          <TabsContent key={tab.key} value={tab.key}>
            {menuObj ? (
              <MenuDay
                date={menuObj.date || ''}
                description={menuObj.description || ''}
                menu={(menuObj.menu || []) as Array<Item & { category: { title: string | null } | null }>}
              />
            ) : <div>Brak menu.</div>}
          </TabsContent>
        )
      })}
    </Tabs>
  )
}