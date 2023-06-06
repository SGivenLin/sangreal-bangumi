import type { Collection } from 'src/component/collection/type'
import type { BangumiAuthor } from 'src/electron/sqlite/bangumi'

interface AuthorData extends BangumiAuthor, Collection{}

export type { AuthorData }