interface CollectionRes {
    total: number,
    limit: number,
    offset: number,
    data: Array<UserSubjectCollection>,
  }
  

enum subject_type {
    book = 1,
    anime = 2,
    music = 3,
    game = 4,
    none = 5,
    real = 6,
}

interface Images {
    large: string,
    common: string,
    medium: string,
    small: string,
    grid: string,
}

interface SlimSubject{
    id: number,
    type: subject_type,
    name: string,
    name_cn: string,
    short_summary: string,
    date: string,
    images: Images,
    volumes: number,
    eps: number,
    collection_total: number,
    score: number,
    tags: Array<string>
}

interface UserSubjectCollection {
    subject_id: number,
    subject_type: subject_type,
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

type IGroupRate = number | [number, number]
type IGroup = Map<IGroupRate, CollectionRes['data']>

export type {
    UserSubjectCollection,
    CollectionRes,
    IGroupRate,
    IGroup
}