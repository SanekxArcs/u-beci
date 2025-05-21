import { DocumentTextIcon } from "@sanity/icons";
import { defineArrayMember, defineField, defineType } from "sanity";

export const dayMenuType = defineType({
  name: "dayMenu",
  title: "Menu Na dzin",
  description:
    "Menu na dany dzień, które będzie wyświetlane na stronie głównej",
  type: "document",
  icon: DocumentTextIcon,
  fields: [
    defineField({
      name: "date",
      title: "Data",
      type: "date",
      options: {
        dateFormat: "YYYY-MM-DD",
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "menu",
      title: "Menu",
      type: "array",
      of: [
        defineArrayMember({
          type: "reference",
          to: [{ type: "item" }],
        }),
      ],
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "description",
      title: "Opis",
      type: "text",
    }),
  ],
  preview: {
    select: {
      title: "date",
    },
    prepare({ title }) {
      return {
        title: `Menu na ${title}`,
      };
    },
  },
});