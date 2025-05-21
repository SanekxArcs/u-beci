import {defineQuery} from 'next-sanity'
export const POSTS_QUERY = defineQuery(`*[_type == "post" && defined(slug.current)][0...12]{
 _id, title, slug
}`)
export const POST_QUERY = defineQuery(`*[_type == "post" && slug.current == $slug][0]{
  title, body, mainImage
}`)

export const INFO_QUERY = defineQuery(`*[_type == "info"][0]{
  title,
  description,
  philosophy,
  hours,
  address,
  phone,
  socialMedia,
  category
}`);

export const DAY_MENUS_WITH_ITEMS_QUERY =
  defineQuery(`*[_type == "dayMenu"]|order(date desc){
  _id,
  _type,
  _createdAt,
  _updatedAt,
  _rev,
  date,
  description,
  menu[]->{
    _id,
    _type,
    _createdAt,
    _updatedAt,
    _rev,
    title,
    slug,
    mainImage,
    price,
    unit,
    category->{_id, title, slug, description},
    description,
    ingredients,
    isAvailable,
    body
  }
}`);

export const DAY_MENU_FULL_QUERY = defineQuery(`*[_type == "dayMenu" && date == $date][0]{
  _id,
  _type,
  _createdAt,
  _updatedAt,
  _rev,
  date,
  description,
  menu[]->{
    _id,
    _type,
    _createdAt,
    _updatedAt,
    _rev,
    title,
    slug,
    mainImage,
    price,
    unit,
    category->{_id, title, slug, description},
    description,
    ingredients,
    isAvailable,
    body
  }
}`);

export const CATEGORY_FULL_QUERY = defineQuery(`*[_type == "category" && _id == $id][0]{
  _id,
  _type,
  _createdAt,
  _updatedAt,
  _rev,
  title,
  slug,
  description
}`);

export const ITEM_FULL_QUERY = defineQuery(`*[_type == "item" && _id == $id][0]{
  _id,
  _type,
  _createdAt,
  _updatedAt,
  _rev,
  title,
  slug,
  mainImage,
  price,
  unit,
  category->{_id, title, slug, description},
  description,
  ingredients,
  isAvailable,
  body
}`);

export const ALL_MENU_ITEMS_QUERY =
  defineQuery(`*[_type == "item"]|order(_createdAt desc){
  _id,
  _type,
  _createdAt,
  _updatedAt,
  _rev,
  title,
  slug,
  mainImage,
  price,
  unit,
  category->{_id, title, slug, description},
  description,
  ingredients,
  isAvailable,
  body
}`);