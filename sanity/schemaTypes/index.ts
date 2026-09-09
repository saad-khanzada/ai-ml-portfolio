import type {SchemaTypeDefinition} from 'sanity'
import {projectCategory} from './projectCategory'
import {skill} from './skill'
import {contentImage} from './contentImage'
import {richText} from './richText'
import {project} from './project'
import {experience} from './experience'
import {certification} from './certification'
import {profile} from './profile'
import {blogPost} from './blogPost'

export const schema: {types: SchemaTypeDefinition[]} = {
  types: [
    contentImage,
    richText,
    projectCategory,
    skill,
    project,
    experience,
    certification,
    profile,
    blogPost,
  ],
}
