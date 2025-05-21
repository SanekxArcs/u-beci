import React, { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { MenuItem } from '@/lib/types'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import Image from 'next/image';

interface CompactMenuItemCardProps {
  item: MenuItem & { ingredients?: string[] };
}

export function CompactMenuItemCard({ item }: CompactMenuItemCardProps) {
  const [open, setOpen] = useState(false)
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Card
          className="cursor-pointer flex flex-row items-center gap-3 px-3 py-2 hover:bg-accent/40 transition border mb-2"
          onClick={() => setOpen(true)}
        >
          <div className="flex-1 min-w-0">
            <div className="font-medium truncate">{item.name}</div>
            {item.ingredients && item.ingredients.length > 0 && (
              <div className="text-xs text-muted-foreground truncate">
                Składniki: {item.ingredients.join(', ')}
              </div>
            )}
          </div>
          <div className="font-semibold whitespace-nowrap">{item.price.toFixed(2)} zł</div>
        </Card>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <Card className="overflow-hidden">
          {item.image && (
            <Image src={item.image} alt={item.name} className="object-cover w-full h-48" />
          )}
          <CardContent className="pt-4">
            <h3 className="font-bold text-xl mb-2">{item.name}</h3>
            <div className="mb-2 text-muted-foreground text-sm">{item.description}</div>
            {item.ingredients && item.ingredients.length > 0 && (
              <div className="mb-2 text-sm">
                <span className="font-medium">Składniki:</span> {item.ingredients.join(', ')}
              </div>
            )}
            <div className="font-bold text-lg mt-4">{item.price.toFixed(2)} zł</div>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  )
}
