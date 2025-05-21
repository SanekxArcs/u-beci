import type {StructureResolver} from 'sanity/structure'

export const structure: StructureResolver = (S) =>
  S.list()
    .title("Parametry")
    .items([
      S.documentTypeListItem("category").title("Kategorie"),
      S.documentTypeListItem("item").title("Potrawy"),
      S.documentTypeListItem("info").title("Informacje"),
      S.documentTypeListItem("dayMenu").title("Menu Na Dzień"),
      S.divider(),
      ...S.documentTypeListItems().filter(
        (item) =>
          item.getId() &&
          !["category", "item", "info", "dayMenu"].includes(item.getId()!)
      ),
    ]);
