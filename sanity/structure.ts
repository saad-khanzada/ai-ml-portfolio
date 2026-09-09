import type {StructureResolver} from 'sanity/structure'
import {PROFILE_DOCUMENT_ID, PROFILE_SCHEMA_TYPE} from './constants'

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      S.listItem()
        .id(PROFILE_DOCUMENT_ID)
        .title('Profile / Site Settings')
        .child(
          S.document()
            .schemaType(PROFILE_SCHEMA_TYPE)
            .documentId(PROFILE_DOCUMENT_ID)
        ),
      S.divider(),
      ...S.documentTypeListItems().filter(
        (item) => item.getId() !== PROFILE_SCHEMA_TYPE
      ),
    ])
