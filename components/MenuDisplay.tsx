"use client"
import { useEffect, useState } from 'react'
import { fetchDayMenusWithItems } from '@/lib/fetchDayMenus'
import {  DAY_MENUS_WITH_ITEMS_QUERYResult } from '@/sanity/types';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Dialog, DialogTrigger, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { MoreHorizontal } from 'lucide-react'
import { MenuDay } from './MenuDay'
import { Item } from '@/sanity/types'

export function MenuDisplay() {
  const [menus, setMenus] = useState<DAY_MENUS_WITH_ITEMS_QUERYResult | null>(null);
  const [selectedTab, setSelectedTab] = useState<string>('today');
  const [showDateDialog, setShowDateDialog] = useState(false);
  const [customTab, setCustomTab] = useState<string | null>(null);

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
      // Set default tab only after menus are loaded, and only if not already set
      if (data && data.length > 0) {
        const allMenusSorted = [...data].sort((a, b) => {
          if (!a.date) return 1;
          if (!b.date) return -1;
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        });
        const todayMenuObj = allMenusSorted.find(m => m.date && isToday(m.date));
        if (todayMenuObj) setSelectedTab(todayMenuObj._id);
        else setSelectedTab(allMenusSorted[0]._id);
      }
      console.log('Fetched menus from sanity:', data)
    }
    fetchData()
  }, [])

  // Set default selectedTab only once after menus are loaded
  useEffect(() => {
    if (menus && menus.length > 0) {
      const allMenusSorted = [...menus].sort((a, b) => {
        if (!a.date) return 1;
        if (!b.date) return -1;
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      });
      const todayMenuObj = allMenusSorted.find(m => m.date && isToday(m.date));
      const defaultTab = todayMenuObj ? todayMenuObj._id : allMenusSorted[0]._id;
      // Only set if not already a valid tab
      if (!selectedTab || !allMenusSorted.find(m => m._id === selectedTab)) {
        setSelectedTab(defaultTab);
      }
    }
  }, [menus, selectedTab]);

  // Find today's menu
  const allMenus = (menus ? [...menus] : []).sort((a, b) => {
    if (!a.date) return 1;
    if (!b.date) return -1;
    return new Date(a.date).getTime() - new Date(b.date).getTime();
  });
  const todayMenuObj = allMenus.find(m => m.date && isToday(m.date));
  const todayMenuId = todayMenuObj?._id;

  // Tabs to show: always today, custom if set
  const visibleTabs = [
    todayMenuObj && { key: todayMenuObj._id, label: 'Dzisiaj' },
    customTab && customTab !== todayMenuObj?._id && (() => {
      const m = allMenus.find(m => m._id === customTab);
      return m ? { key: m._id, label: m.date ? new Date(m.date).toLocaleDateString('pl-PL', { weekday: 'short', day: '2-digit', month: '2-digit' }) : 'Brak daty' } : null;
    })()
  ].filter((tab): tab is { key: string; label: string } => Boolean(tab));

  // All other dates for dialog (not today, not custom)
  const popoverTabs = allMenus.filter(m => m._id !== todayMenuObj?._id && m._id !== customTab);

  // On dialog select
  function handlePopoverSelect(tabId: string) {
    setCustomTab(tabId);
    setSelectedTab(tabId);
    setShowDateDialog(false);
  }

  // On today click
  function handleTodayClick() {
    setCustomTab(null);
    setSelectedTab(todayMenuObj?._id || '');
  }

  // Set initial tab to today
  useEffect(() => {
    if (todayMenuObj && (!selectedTab || selectedTab !== todayMenuObj._id)) {
      setSelectedTab(todayMenuObj._id);
      setCustomTab(null);
    }
  }, [todayMenuObj, selectedTab]);

  console.log('selectedTab', selectedTab, 'visibleTabs', visibleTabs);

  return (
    <Tabs value={selectedTab} onValueChange={setSelectedTab}>
      <TabsList>
        {visibleTabs.map(tab => (
          <TabsTrigger
            key={tab.key}
            value={tab.key}
            onClick={tab.key === todayMenuId ? handleTodayClick : undefined}
          >
            {tab.label}
          </TabsTrigger>
        ))}
        <Dialog open={showDateDialog} onOpenChange={setShowDateDialog}>
          <DialogTrigger asChild>
            <Button variant="ghost" size="icon" aria-label="Wszystkie daty"><MoreHorizontal /></Button>
          </DialogTrigger>
          <DialogContent>
            <DialogTitle>Wybierz datę</DialogTitle>
            <div className="flex flex-col gap-2 mt-4">
              {popoverTabs.map(m => (
                <Button
                  key={m._id}
                  variant="ghost"
                  onClick={() => handlePopoverSelect(m._id)}
                  aria-pressed={selectedTab === m._id}
                >
                  {m.date ? new Date(m.date).toLocaleDateString('pl-PL', { weekday: 'short', day: '2-digit', month: '2-digit' }) : 'Brak daty'}
                </Button>
              ))}
            </div>
          </DialogContent>
        </Dialog>
      </TabsList>
      {visibleTabs.map(tab => {
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