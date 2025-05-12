import React from "react";
// import { MenuDisplay } from "@/components/MenuDisplay";
import { MenuCategory } from "@/lib/types";

export default function Home() {
  const categories: MenuCategory[] = [
    "breakfast",
    "starters",
    "mains",
    "lunch",
    "dinner",
    "sides",
    "desserts",
    "drinks",
  ];
  console.log("categories", categories);

  return (
    <section className="container px-4 py-8 md:px-6 md:py-12">
      {/* <MenuDisplay menuByCategory={menuByCategory} /> */}
    </section>
  );
}
