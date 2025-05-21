import { DocumentTextIcon } from "@sanity/icons";
import { defineArrayMember, defineField, defineType } from "sanity";

export const itemType = defineType({
  name: "item",
  title: "Potrawa",
  description: "Potrawa, która będzie wyświetlana w menu",
  type: "document",
  icon: DocumentTextIcon,
  fields: [
    defineField({
      name: "title",
      title: "Tytuł",
      type: "string",
    }),
    defineField({
      name: "slug",
      title: "Link",
      type: "slug",
      options: {
        source: "title",
      },
    }),
    defineField({
      name: "mainImage",
      title: "Główne zdjęcie",
      type: "image",
      options: {
        hotspot: true,
      },
      fields: [
        defineField({
          name: "alt",
          type: "string",
          title: "Alternative text",
        }),
      ],
    }),
    defineField({
      name: "price",
      title: "Cena",
      type: "number",
    }),
    // units
    defineField({
      name: "unit",
      title: "Jednostka",
      type: "string",
      options: {
        list: [
          { title: "szt", value: "szt" },
          { title: "gram", value: "gram" },
          { title: "ml", value: "ml" },
          { title: "litr", value: "litr" },
          { title: "kg", value: "kg" },
          { title: "porcja", value: "porcja" },
          { title: "komplet", value: "komplet" },
        ],
      },
    }),
    defineField({
      name: "category",
      title: "Kategoria",
      type: "reference",
      to: [{ type: "category" }],
    }),
    defineField({
      name: "description",
      title: "Opis",
      type: "text",
    }),
    defineField({
      name: "ingredients",
      title: "Składniki",
      type: "array",
      of: [
        defineArrayMember({
          type: "string",
        }),
      ],
    }),
    // available
    defineField({
      name: "isAvailable",
      title: "Dostępny",
      type: "boolean",
      initialValue: true,
    }),
    defineField({
      name: "body",
      title: "Treść",
      type: "blockContent",
    }),
  ],
  // preview title price description
  preview: {
    select: {
      title: "title",
      media: "mainImage",
      price: "price",
      description: "description",
    },
    prepare({ title, media, price, description,  }) {
      return {
        title,
        media,
        subtitle: `${price} zł - ${description || ""}`,
      };
    },
  },
});
