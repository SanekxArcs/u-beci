import React, { useState } from "react";
import { MenuItemDialog } from "./MenuItemDialog";
import { Item } from "@/sanity/types";

interface MenuDayProps {
  date: string;
  description: string | null;
  menu: Array<Item & { category: { title: string | null } | null }>;
}

export function MenuDay({ date, description, menu }: MenuDayProps) {
  // Group items by category
  const grouped: Record<string, Item[]> = {};
  menu.forEach((item) => {
    const cat = item.category?.title || "Inne";
    if (!grouped[cat]) grouped[cat] = [];
    grouped[cat].push(item);
  });
  // Sort categories alphabetically
  const categories = Object.keys(grouped).sort((a, b) =>
    a.localeCompare(b, "pl")
  );

  // Dialog state
  const [selected, setSelected] = useState<Item | null>(null);
  const [open, setOpen] = useState(false);

  return (
    <div className="space-y-6 select-none">
      <div className="mb-4">
        <h2 className="text-xl font-bold">
          Menu na:{" "}
          {date
            ? new Date(date).toLocaleDateString("pl-PL", {
                day: "2-digit",
                month: "2-digit",
              })
            : ""}
        </h2>
        {description && (
          <div className="text-muted-foreground text-sm">
            Opis: {description}
          </div>
        )}
      </div>
      <div className="space-y-4 ">
        {categories.map((cat) => (
          <div key={cat}>
            <h3 className="font-semibold text-base mb-2">{cat}</h3>
            <ul className="space-y-1">
              {grouped[cat]
                .sort((a, b) =>
                  (a.title || "").localeCompare(b.title || "", "pl")
                )
                .map((item, idx) => (
                  <li key={item._id + "-" + idx}>
                    <button
                      className="w-full text-left"
                      onClick={() => {
                        setSelected(item);
                        setOpen(true);
                      }}
                    >
                      <div
                        className={`flex items-start gap-3 p-2 border-l-3 rounded hover:bg-accent transition-colors ${item.isAvailable ? "border-l-emerald-500 bg-emerald-50/50 cursor-pointer" : "border-l-red-400 cursor-not-allowed bg-red-50/50"}`}
                      >
                        {/* Title and subtitle */}
                        <div className="flex-1 min-w-0 pl-2">
                          <div className="font-medium truncate flex items-center">
                            {item.title}
                            <span
                              className="flex-1 border-dotted border-b border-gray-400 mx-2 opacity-40"
                              style={{ borderWidth: 0, borderBottomWidth: 1 }}
                            />
                          </div>
                          {item.ingredients && item.ingredients.length > 0 && (
                            <div className="text-xs text-muted-foreground truncate">
                              {item.ingredients.join(", ")}
                            </div>
                          )}
                        </div>
                        {/* Price and unit */}
                        <div className="ml-2 whitespace-nowrap font-semibold">
                          {item.price != null ? `${item.price} zł` : ""}
                          {item.unit ? (
                            <span className="text-xs text-muted-foreground ml-1">
                              /{item.unit}
                            </span>
                          ) : null}
                        </div>
                      </div>
                    </button>
                  </li>
                ))}
            </ul>
          </div>
        ))}
      </div>
      <MenuItemDialog item={selected} open={open} onOpenChange={setOpen} />
    </div>
  );
}
