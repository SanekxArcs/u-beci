import React from 'react'
import Link from 'next/link'
import { Coffee, MapPin, Phone, Clock, Instagram, Facebook } from 'lucide-react'

export function Footer() {
  return (
    <footer className="border-t bg-muted/40">
      <div className="container px-4 py-8 md:px-6 md:py-12 mx-auto">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Coffee className="h-6 w-6" />
              <span className="font-playfair text-xl font-bold tracking-tight">Bar u Beci</span>
            </div>
            <p className="text-sm text-muted-foreground">
              A cozy home food cafe offering delicious, authentic dishes in a warm, inviting atmosphere.
            </p>
          </div>
          <div className="space-y-3">
            <h3 className="font-medium">Hours</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>Mon-Fri: 8:00 AM - 10:00 PM</span>
              </li>
              <li className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>Sat-Sun: 9:00 AM - 11:00 PM</span>
              </li>
            </ul>
          </div>
          <div className="space-y-3">
            <h3 className="font-medium">Contact</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>123 Cafe Street, Prague, Czech Republic</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <span>+420 123 456 789</span>
              </li>
            </ul>
          </div>
          <div className="space-y-3">
            <h3 className="font-medium">Follow Us</h3>
            <div className="flex gap-4">
              <Link href="https://instagram.com" className="text-muted-foreground hover:text-foreground transition-colors">
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </Link>
              <Link href="https://facebook.com" className="text-muted-foreground hover:text-foreground transition-colors">
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </Link>
            </div>
            <p className="text-xs text-muted-foreground mt-4">
              © 2025 Bar u Beci. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}