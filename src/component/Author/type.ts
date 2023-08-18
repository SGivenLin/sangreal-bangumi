import type { Collection } from 'src/component/Collection/type'
import type { Images } from 'src/lib/const'
import type { BangumiAuthor } from 'src/electron/sqlite/bangumi'

interface Author {
    name: string,
    relation: string,
    type: number,
    id: number,
    images: Images,
}

interface AuthorData extends BangumiAuthor, Collection{
    isIgnore: Boolean
}

export type { AuthorData, Author }