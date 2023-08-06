import type { Author } from 'src/component/Author/type'
import type { Images } from 'src/lib/const'

enum SubjectType {
    book = 1,
    anime = 2,
    music = 3,
    game = 4,
    none = 5,
    real = 6,
}

interface Bangumi {
    id: number,
    type: SubjectType,
    name: string,
    name_cn: string,
    summary: string,
    date: string,
    images?: Images,
    volumes: number,
    eps: number,
    score: number,
    tags: Array<string>
    rating?: {
        rank: number,
        total: number,
        count: {[props: number]: number },
        score: number,
    }
    infobox: Array<{
        key: string,
        value: string,
    }>
}

enum DiffType {
    person_same = 1,
    all_same
}

interface BangumiContent extends Bangumi {
    staffList: Array<{
        relation: string,
        authorList: Array<Author & { diffType?: DiffType }>
    }>,
}

interface BangumiBySearch extends Omit<SlimBangumi, 'infobox' | 'date' | 'tags' | 'rating'> {
    air_date: string,
    url: string,
    rating?: Omit<Bangumi['rating'] & {}, 'rank'>,
    rank: number
}

interface BangumiSearchResult {
    results: number,
    list: BangumiBySearch[]
}

type SlimBangumi = Omit<Bangumi, 'infobox'>
type AuthorList = BangumiContent["staffList"][number]["authorList"]

export { DiffType, SubjectType }
export type { Images, Bangumi, BangumiContent, AuthorList, SlimBangumi, BangumiSearchResult, BangumiBySearch }