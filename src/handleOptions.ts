import { BlogPluginOptions } from './interface/Options'
import { ExtraPage } from './interface/ExtraPages'
import { PageEnhancer } from './interface/PageEnhancer'
import { AppContext } from './interface/VuePress'
import { InternalPagination, PaginationConfig } from './interface/Pagination'
import { FrontmatterClassificationPage } from './interface/Frontmatter'
import {
  curryFrontmatterHandler,
  FrontmatterTempMap,
  resolvePaginationConfig,
  UpperFirstChar,
} from './util'
import { ClassifierTypeEnum } from './interface/Classifier'

/**
 * Handle options from users.
 * @param options
 * @param ctx
 * @returns {*}
 */

export function handleOptions(options: BlogPluginOptions, ctx: AppContext) {
  const { directories = [], frontmatters = [] } = options

  const pageEnhancers: PageEnhancer[] = []
  const frontmatterClassificationPages: FrontmatterClassificationPage[] = []
  const extraPages: ExtraPage[] = []
  const paginations: InternalPagination[] = []

  /**
   * 1. Directory-based classification
   */
  for (const directory of directories) {
    const {
      id,
      dirname,
      path: indexPath = `/${directory.id}/`,
      layout: indexLayout = 'IndexPost',
      frontmatter,
      itemLayout = 'Post',
      itemPermalink = '/:year/:month/:day/:slug',
      pagination = {
        lengthPerPage: 10,
      } as PaginationConfig,
    } = directory

    /**
     * 1.1 Required index path.
     */
    if (!indexPath) {
      continue
    }

    /**
     * 1.2 Inject index page.
     */
    extraPages.push({
      permalink: indexPath,
      frontmatter: {
        // Set layout for index page.
        layout: ctx.getLayout(indexLayout),
        title: `${UpperFirstChar(id)}`,
        ...frontmatter,
      },
      meta: {
        pid: id,
        id,
      },
    })

    /**
     * 1.3 Set layout for pages that match current directory classifier.
     */
    pageEnhancers.push({
      when: ({ regularPath }) =>
        Boolean(regularPath) &&
        regularPath !== indexPath &&
        regularPath.startsWith(`/${dirname}/`),
      frontmatter: {
        layout: ctx.getLayout(itemLayout, 'Post'),
        permalink: itemPermalink,
      },
      data: { id, pid: id },
    })

    /**
     * 1.5 Set pagination.
     */
    paginations.push({
      classifierType: ClassifierTypeEnum.Directory,
      getPaginationPageTitle(index) {
        return `Page ${index + 1} | ${id}`
      },
      ...resolvePaginationConfig(
        ClassifierTypeEnum.Directory,
        pagination,
        indexPath,
        id,
        id,
        ctx,
      ),
      pid: id,
      id,
    })
  }

  /**
   * 2. Frontmatter-based classification
   */
  for (const frontmatterPage of frontmatters) {
    const {
      id,
      keys,
      path: indexPath,
      layout: indexLayout,
      frontmatter,
      pagination = {
        lengthPerPage: 10,
      } as PaginationConfig,
    } = frontmatterPage

    if (!indexPath) {
      continue
    }

    extraPages.push({
      permalink: indexPath,
      frontmatter: {
        // Set layout for index page.
        layout: ctx.getLayout(indexLayout),
        title: `${UpperFirstChar(id)}`,
        ...frontmatter,
      },
    })

    const map = {} as FrontmatterTempMap

    frontmatterClassificationPages.push({
      id,
      pagination,
      keys,
      map,
      _handler: curryFrontmatterHandler(id, map),
    })
  }

  return {
    pageEnhancers,
    frontmatterClassificationPages,
    extraPages,
    paginations,
  }
}
