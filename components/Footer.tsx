import React from 'react'
import Link from 'next/link'
import { Coffee, MapPin, Phone, Clock, Facebook } from 'lucide-react'
import { INFO_QUERYResult } from '@/sanity/types';

export  function Footer({ info }: { info?: INFO_QUERYResult }) {
  return (
    <footer className="border-t bg-muted/40">
      <div className="container px-4 py-8 md:px-6 md:py-12 mx-auto">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Coffee className="h-6 w-6" />
              <span className="font-playfair text-xl font-bold tracking-tight">
                {info?.title || "Bar u Beci"}
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              {info?.description ||
                "Przytulna domowa kawiarnia oferująca pyszne, autentyczne dania w ciepłej, przyjaznej atmosferze."}
            </p>
          </div>
          <div className="space-y-3">
            <h3 className="font-medium">Godziny otwarcia</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {info?.hours?.map((h) => (
                <li key={h._key} className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>
                    {h.day}: {h.hours}
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <div className="space-y-3">
            <h3 className="font-medium">Kontakt</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {info?.address && (
                <li className="flex items-center gap-2">
                  <a
                    href={`${info.address.url}`}
                    className="flex items-center gap-2 hover:text-foreground transition-colors"
                  >
                    <MapPin className="h-4 w-4" />
                    <span>
                      {info.address.street}, {info.address.city},{" "}
                      {info.address.postalCode}
                    </span>
                  </a>
                </li>
              )}
              {info?.phone && (
                <li className="flex items-center gap-2">
                  <a
                    href={`tel:${info.phone}`}
                    className="flex items-center gap-2 hover:text-foreground transition-colors"
                  >
                    <Phone className="h-4 w-4" />
                    <span>{info.phone}</span>
                  </a>
                </li>
              )}
            </ul>
          </div>
          <div className="space-y-3">
            <h3 className="font-medium">Znajdź nas</h3>
            <div className="flex gap-4">
              {info?.socialMedia?.map((sm) => (
                <Link
                  key={sm._key}
                  href={sm.url || "#"}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  {sm.platform === "facebook" && (
                    <Facebook className="h-5 w-5" />
                  )}
                  {/* Dodaj więcej ikon dla innych platform jeśli potrzeba */}
                  <span className="sr-only">{sm.platform}</span>
                </Link>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-4">
              © 2025 {info?.title || "Bar u Beci"}. Wszelkie prawa zastrzeżone.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}