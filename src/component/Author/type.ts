import type { Collection } from 'src/component/Collection/type'
import type { BangumiAuthor } from 'src/electron/sqlite/bangumi'

interface AuthorData extends BangumiAuthor, Collection{
    isIgnore: Boolean
}

export type { AuthorData }