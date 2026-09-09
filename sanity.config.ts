'use client'

import {visionTool} from '@sanity/vision'
import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'

import {apiVersion, dataset, projectId} from './sanity/env'
import {PROFILE_SCHEMA_TYPE} from './sanity/constants'
import {schema} from './sanity/schemaTypes'
import {structure} from './sanity/structure'

const profileActions = new Set(['publish', 'discardChanges', 'restore'])

export default defineConfig({
  name: 'default',
  title: 'AI ML Portfolio',
  basePath: '/studio',
  projectId,
  dataset,
  schema: {
    ...schema,
    templates: (templates) =>
      templates.filter((template) => template.schemaType !== PROFILE_SCHEMA_TYPE),
  },
  document: {
    newDocumentOptions: (options) =>
      options.filter((option) => option.templateId !== PROFILE_SCHEMA_TYPE),
    actions: (actions, context) =>
      context.schemaType === PROFILE_SCHEMA_TYPE
        ? actions.filter(({action}) => action && profileActions.has(action))
        : actions,
  },
  plugins: [
    structureTool({structure}),
    visionTool({defaultApiVersion: apiVersion}),
  ],
})
