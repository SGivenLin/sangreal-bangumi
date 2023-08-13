import { getAllRelation } from '../sqlite/bangumi'
import { type Listener } from './const'
import { once } from './utils'


const _getRelationList: Listener = once(async (e: any) => {
    const relationList = await getAllRelation()
    return { relationList }
})

export default _getRelationList
