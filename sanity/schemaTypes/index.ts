import { type SchemaTypeDefinition } from 'sanity'

import {blockContentType} from './blockContentType'
import {categoryType} from './categoryType'
import { infoType } from './infoType'
import { itemType } from './itemType'
import { dayMenuType } from './dayMenuType'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [blockContentType, categoryType, infoType, itemType, dayMenuType],
}
