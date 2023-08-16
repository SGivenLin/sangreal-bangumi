import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { PayloadAction, SliceCaseReducers } from '@reduxjs/toolkit'
import type { AuthorData } from 'src/component/Author/type'
import { weightType, type SortType } from 'src/component/Author/select-form'
import { initialValues } from 'src/component/Author/select-form'
import { jobMap, allRelation } from 'src/lib/const'
import { getRelationList as getRelationListCount } from 'src/electron/ipcMain/const'
import { ipcRenderer } from 'electron'

interface InitialState{
    relationList: string[],
    relationListByDB: string[],
    _authorList: AuthorData[][],
    authorList: AuthorData[][],
}

const initialState: InitialState = {
    relationList: [],
    relationListByDB: [],
    _authorList: [],
    authorList: [],
}

function filterIgnore(authorList: AuthorData[]): AuthorData[] { return authorList.filter(item => !item.isIgnore) }

// 按bangumi_id去重
function getLengthUnique(authorList: AuthorData[]): number{
    let set = new Set()
    filterIgnore(authorList).forEach(item => {
        set.add(item.bangumi_id)
    })
    return set.size
}

function getLength(authorList: AuthorData[]): number {
    return filterIgnore(authorList).length
}

function getAvgRate(authorList: AuthorData[]): number{
    let avg = 0
    let bangumiList: number[] = []
    filterIgnore(authorList).forEach(item => {
        if (bangumiList.includes(item.subject_id)) {
            return
        } else {
            bangumiList.push(item.subject_id)
            avg += item.rate || item.subject.score
        }
    })
    return avg / bangumiList.length
}

type ReducerType = SliceCaseReducers<InitialState>[string]

const _sortBySubject: ReducerType = (state, action: PayloadAction<weightType>) => {
    const authorList = [ ...state.authorList ]
    switch(action.payload) {
    case weightType.subject:
        authorList.sort((a, b) => {
            return getLengthUnique(b) - getLengthUnique(a)
        })
        break
    default:
        authorList.sort((a, b) => {
            return getLength(b) - getLength(a)
        })  
    }
    return {
        ...state,
        authorList,
    }
}

const _filterSubjectCount: ReducerType = (state, action: PayloadAction<number | null>) => {
    const authorList = [ ...state.authorList ]
    return {
        ...state,
        authorList: authorList.filter(item => {
            return getLengthUnique(item) >= (action.payload || 1)
        }),
    }
}

const getRelationList = createAsyncThunk('author/getRelationList', async (data, { dispatch }) => {
    const { relationList }: { relationList: string[]  } = await ipcRenderer.invoke(getRelationListCount)
    dispatch(slice.actions.setRelationListByDB(relationList))
    return relationList
})


export const slice = createSlice({
    name: 'author',
    initialState,
    reducers: {
        setAuthorList: (state, action: PayloadAction<AuthorData[][]>) => {
            const relationList = new Set<string>()
            action.payload.forEach(_ => {
                _.forEach(item => {
                    relationList.add(item.relation)
                })
            })
            state = slice.caseReducers.sortByForm({
                ...state,
                relationList:  [ ...relationList ],
                _authorList: [ ...action.payload ],
                authorList: [ ...action.payload ],
            }, { type: '', payload: { ...initialValues } })
            return state
        },
        setRelationListByDB: (state, action: PayloadAction<string[]>) => {
            state.relationListByDB = [ ...action.payload ]
        },
        sortByForm: (state, action: PayloadAction<SortType>) => {
            const map = {
                weight: slice.caseReducers.sortBySubject,
                subjectCount: slice.caseReducers.filterSubjectCount,
                useRate: slice.caseReducers.sortByRate,
                relation: slice.caseReducers.filterSubjectByRelation,
            }
            let cur = {
                ...state,
                authorList: state._authorList,
            }

            let key: (keyof typeof action.payload)
            for(key in action.payload) {
                const val = action.payload[key]
                // @ts-ignore
                cur = map[key](cur, { payload: val, type: '' })
            }
            return cur
        },
        sortBySubject: _sortBySubject,
        filterSubjectCount: _filterSubjectCount,
        sortByRate: (state, action: PayloadAction<boolean>) => {
            if (action.payload === false) {
                return state
            }
            const authorList = [ ...state.authorList ]
            authorList.sort((a, b) => {
                return getAvgRate(b) - getAvgRate(a)
            })
            return {
                ...state,
                authorList: authorList,
            }
        },
        filterSubjectByRelation(state, action: PayloadAction<Array<keyof typeof jobMap>>) {
            let relation: string[] = []
            const extraRelation = state.relationList.filter(_ => !allRelation.includes(_))
            action.payload.forEach(item => {
                relation = relation.concat(jobMap[item] || extraRelation)
            })
            
            // 某些职位可能存在人，也可能是公司。需要二次判断，如果有其他真人职位则一定是真人
            const needJudgeIsPerson = action.payload.includes('动画公司') && !action.payload.includes('其他')
            const authorList = state.authorList.map(_ => {
                let _relation = relation
                if (needJudgeIsPerson) {
                    const isCompany = _.map(item => item.relation).every(item => jobMap.动画公司.includes(item))
                    if (!isCompany) {
                        _relation = _relation.filter(item => !jobMap.动画公司.includes(item))
                    }
                }
                
                return _.map(item => ({ ...item, isIgnore: !_relation.includes(item.relation) }))
            })
            return {
                ...state,
                authorList,
            }
        },
    },
})

// Action creators are generated for each case reducer function
export const { setAuthorList, sortByForm, setRelationListByDB } = slice.actions
export { getRelationList }
export default slice.reducer