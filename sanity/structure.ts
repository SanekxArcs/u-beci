import type {StructureResolver} from 'sanity/structure'

export const structure: StructureResolver = (S) =>
  S.list()
    .title("Blog")
    .items([
      S.documentTypeListItem("category").title("Categories"),
      S.documentTypeListItem("item").title("Items"),
      S.documentTypeListItem("info").title("Informacje"),
      S.divider(),
      ...S.documentTypeListItems().filter(
        (item) =>
          item.getId() &&
          ![ "category", "item", "info"].includes(item.getId()!)
      ),
      S.divider(),
      S.documentTypeListItem("info").title("Informacje"),
    ]);
