import { env } from '@vuepress/shared-utils'
import { AppContext, Page } from './interface/VuePress'
import { ClassifierTypeEnum, DefaultLayoutEnum } from './interface/Classifier'
import { PaginationConfig } from './interface/Pagination'

export type FrontmatterHandler = (key: string, pageKey: string) => void

export interface FrontmatterTempMap {
  scope: string;
  path: string;
  pageKeys: string;
}

export function curryFrontmatterHandler(
  scope: string,
  map: FrontmatterTempMap,
): FrontmatterHandler
export function curryFrontmatterHandler(scope, map) {
  return (key, pageKey) => {
    if (key) {
      if (!map[key]) {
        map[key] = {}
        map[key].scope = scope
        map[key].path = `/${scope}/${key}/`
        map[key].pageKeys = []
      }
      map[key].pageKeys.push(pageKey)
    }
  }
}

export function logPages(title, pages) {
  if (env.isDebug) {
    const table = require('text-table')
    const chalk = require('chalk')
    console.log()
    console.log(chalk.cyan(`[@vuepress/plugin-blog] ====== ${title} ======`))
    const data: any[] = [['permalink', 'meta', 'pid', 'id', 'frontmatter']]
    data.push(
      ...pages.map(({ // @ts-ignore
        path, permalink, meta, pid, id, frontmatter }) => [
        // @ts-ignore // @ts-ignore
        permalink || path || '',
        JSON.stringify(meta) || '',
        pid || '',
        id || '',
        JSON.stringify(frontmatter) || '',
      ]),
    )
    console.log(table(data))
    console.log()
  }
}

export function resolvePaginationConfig(
  classifierType: ClassifierTypeEnum,
  pagination = {} as PaginationConfig,
  indexPath,
  pid, // post / tag
  id, // post / js
  ctx: AppContext,
  keys: string[] = [''], // ['js']
) {
  return Object.assign(
    {},
    {
      lengthPerPage: 10,
      layout: ctx.getLayout(DefaultLayoutEnum.DirectoryPagination),

      getPaginationPageUrl(index) {
        if (index === 0) {
          return indexPath
        }
        return `${indexPath}page/${index + 1}/`
      },

      filter:
        classifierType === ClassifierTypeEnum.Directory
          ? getIdentityFilter(pid, id)
          : getFrontmatterClassifierPageFilter(keys, id),

      sorter: (prev: Page, next: Page) => {
        const prevTime = new Date(prev.frontmatter.date).getTime()
        const nextTime = new Date(next.frontmatter.date).getTime()
        return prevTime - nextTime > 0 ? -1 : 1
      },
    },
    pagination,
  )
}

function getIdentityFilter(pid, id) {
  return new Function(
    // @ts-ignore
    ['page'],
    `return page.pid === ${JSON.stringify(pid)} && page.id === ${JSON.stringify(
      id,
    )}`,
  )
}

function getFrontmatterClassifierPageFilter(keys, value) {
  return new Function(
    // @ts-ignore
    ['page'],
    `
const keys = ${JSON.stringify(keys)};
const value = ${JSON.stringify(value)};
return keys.some(key => {
  const _value = page.frontmatter[key]
  if (Array.isArray(_value)) {
    return _value.some(i => i === value)
  }
  return _value === value
})
    `,
  )
}

export function UpperFirstChar(str) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}
