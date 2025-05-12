import { DocumentTextIcon } from "@sanity/icons";
import { defineArrayMember, defineField, defineType } from "sanity";

export const infoType = defineType({
  name: "info",
  title: "Informacja",
  type: "document",
  icon: DocumentTextIcon,
  fields: [
    defineField({
      name: "title",
      title: "Tytuł",
      type: "string",
      validation: (Rule) => Rule.required().min(5).max(100),
    }),
    defineField({
      name: "description",
      title: "Opis",
      type: "text",
      validation: (Rule) => Rule.required().min(10).max(500),
    }),
    //Our Philosophy
    defineField({
      name: "philosophy",
      title: "Nasza filozofia",
      type: "text",
      validation: (Rule) => Rule.required().min(10).max(500),
    }),

    defineField({
      name: "hours",
      title: "Godziny otwarcia",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            {
              name: "day",
              title: "Dzień",
              type: "string",
              options: {
                list: [
                  { title: "Poniedziałek", value: "monday" },
                  { title: "Wtorek", value: "tuesday" },
                  { title: "Środa", value: "wednesday" },
                  { title: "Czwartek", value: "thursday" },
                  { title: "Piątek", value: "friday" },
                  { title: "Sobota", value: "saturday" },
                  { title: "Niedziela", value: "sunday" },
                ],
              },
            },
            {
              name: "hours",
              title: "Godziny",
              type: "string",
            },
          ],
        }),
      ],
    }),
    // address with title and url
    defineField({
      name: "address",
      title: "Adres",
      type: "object",
      fields: [
        {
          name: "street",
          title: "Ulica",
          type: "string",
        },
        {
          name: "city",
          title: "Miasto",
          type: "string",
        },
        {
          name: "postalCode",
          title: "Kod pocztowy",
          type: "string",
        },
        {
          name: "url",
          title: "URL",
          type: "string",
          validation: (Rule) => Rule.required().uri(),
        },
      ],
    }),
    // phone number with title
    defineField({
      name: "phone",
      title: "Numer telefonu",
      type: "string",
      validation: (Rule) => Rule.required().min(7).max(15),
    }),
    //social media links facebook and other links array
    defineField({
      name: "socialMedia",
      title: "Linki do mediów społecznościowych",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            {
              name: "platform",
              title: "Platforma",
              type: "string",
              options: {
                list: [
                  { title: "Facebook", value: "facebook" },
                  { title: "Instagram", value: "instagram" },
                  { title: "Pyszne", value: "pyszne" },
                  { title: "Glovo", value: "glovo" },
                  { title: "Uber Eats", value: "uber-eats" },
                  { title: "Inne", value: "other" },
                ],
              },
            },
            {
              name: "url",
              title: "URL",
              type: "string",
              validation: (Rule) => Rule.required().uri(),
            },
          ],
        }),
      ],
    }),
    defineField({
      name: "category",
      title: "Kategoria",
      type: "string",
      validation: (Rule) => Rule.required().min(2).max(50),
    }),
  ],
});
