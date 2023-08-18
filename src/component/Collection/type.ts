import type { SubjectType, SlimBangumi } from 'src/component/Bangumi/type'

interface CollectionRes {
    total: number,
    limit: number,
    offset: number,
    data: Array<UserSubjectCollection>,
}


interface SlimSubject extends SlimBangumi{
    short_summary: string,
    collection_total: number,
}

interface UserSubjectCollection {
    subject_id: number,
    subject_type: SubjectType,
    rate: number,
    type: number, // todo
    comment?: string,
    tags: Array<string>,
    ep_status: number,
    vol_status: number,
    updated_at: number,
    private: boolean,
    subject: SlimSubject,
}

type IGroupRange = number | [number, number]
type IGroup = Map<IGroupRange, CollectionRes['data']>
type Collection = CollectionRes['data'][number]

export type {
    UserSubjectCollection,
    CollectionRes,
    Collection,
    IGroupRange,
    IGroup,
}