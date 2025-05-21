"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";
import { Coffee, LogOut, Menu as MenuIcon } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { INFO_QUERYResult } from "@/sanity/types";
import { useRouter } from "next/navigation";

export function Header({ info }: { info?: INFO_QUERYResult }) {
  const router = useRouter();
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");
  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    router.push("/admin");
  };

  return (
    <header className=" border-b sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6 mx-auto">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <Coffee className="h-6 w-6" />
            <span className="font-playfair text-xl font-bold tracking-tight">
              {info?.title || "Bar u Beci"}
            </span>
          </Link>
        </div>

        <div className="hidden md:flex items-center gap-6">
          <nav className="flex gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link
                href="/"
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  pathname === "/" ? "text-foreground" : "text-muted-foreground"
                }`}
              >
                Menu
              </Link>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link
                href="/admin/dashboard"
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  pathname === "/admin/dashboard"
                    ? "text-foreground"
                    : "text-muted-foreground"
                }`}
              >
                Panel
              </Link>
            </Button>
            <div className="flex items-center gap-2">
              {isAdmin && (
                <>
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/studio">Studio</Link>
                  </Button>
                </>
              )}
              {!isAdmin && (
                <>
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/admin">Admin</Link>
                  </Button>
                </>
              )}
              {pathname === "/admin/dashboard" && (
                <Button
                  variant="outline"
                  onClick={handleLogout}
                  className="mt-4 md:mt-0"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Wyloguj
                </Button>
              )}
              <ModeToggle />
            </div>
          </nav>
        </div>

        <div className="md:hidden flex items-center gap-2">
          <ModeToggle />
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <MenuIcon className="h-5 w-5" />
                <span className="sr-only">Przełącz menu nawigacji</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <nav className="flex flex-col gap-4 mt-8">
                <Link
                  href="/"
                  className="text-lg font-medium transition-colors hover:text-primary"
                >
                  Menu
                </Link>
                <Link
                  href="/about"
                  className="text-lg font-medium transition-colors hover:text-primary"
                >
                  O nas
                </Link>
                {isAdmin && (
                  <>
                    <Button variant="outline" size="sm" asChild>
                      <Link href="/studio">Studio</Link>
                    </Button>
                  </>
                )}
                {!isAdmin && (
                  <>
                    <Button variant="outline" size="sm" asChild>
                      <Link href="/admin">Admin</Link>
                    </Button>
                    <Button variant="outline" size="sm" asChild>
                      <Link href="/studio">Studio</Link>
                    </Button>
                  </>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
