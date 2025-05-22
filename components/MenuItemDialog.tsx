import { Dialog, DialogContent, DialogTitle,  } from '@/components/ui/dialog'
import { urlFor } from '@/sanity/lib/image'

import { Item } from '@/sanity/types'
import Image from 'next/image'
import { Button } from './ui/button'

interface MenuItemDialogProps {
  item: Item | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function MenuItemDialog({ item, open, onOpenChange }: MenuItemDialogProps) {
  if (!item) return null
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md p-0 overflow-hidden">
        <DialogTitle className="sr-only">{item.title}</DialogTitle>
        <div className=" rounded-lg shadow-lg">
          {/* Product Image */}
          {item.mainImage?.asset && item.mainImage.asset._ref && (
            <div className="w-full h-56  flex items-center justify-center">
              <Image
                src={urlFor(item.mainImage).width(400).height(224).url()}
                alt={item.mainImage.alt || item.title || ''}
                width={400}
                height={224}
                className="object-cover w-full h-full"
              />
            </div>
          )}
          <div className="p-6">
            {/* Title and Description */}
            <h2 className="text-2xl font-bold mb-2">{item.title}</h2>
            {item.description && <p className="text-muted-foreground mb-4">{item.description}</p>}
            {/* Price and Availability */}
            <div className="flex items-center justify-between mb-4 ">
              <span className="text-xl font-semibold text-green-700">{item.price != null ? `${item.price} zł` : '—'}</span>
              {item.isAvailable !== undefined && (
                <span className={item.isAvailable ? "text-green-600 font-medium " : "text-red-500 font-medium"}>
                  {item.isAvailable ? 'Dostępny' : 'Niedostępny'}
                </span>
              )}
            </div>
            {/* Unit, Category, Ingredients */}
            <div className="space-y-1 text-sm  mb-4">
              {item.unit && <div><b>Jednostka:</b> {item.unit}</div>}
              {item.category && typeof item.category === 'object' && 'title' in item.category && (item.category as { title?: string }).title && (
                <div><b>Kategoria:</b> {(item.category as { title: string }).title}</div>
              )}
              {item.ingredients && item.ingredients.length > 0 && (
                <div><b>Składniki:</b> {item.ingredients.join(', ')}</div>
              )}
            </div>
            {/* Actions (close button) */}
            <div className="flex justify-end">
              <Button
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="  font-medium"
                type="button"
              >
                Zamknij
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
