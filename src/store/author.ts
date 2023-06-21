import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction, SliceCaseReducers } from '@reduxjs/toolkit'
import type { AuthorData } from 'src/component/Author/type'
import { weightType, type SortType } from 'src/component/Author/select-form'
import { initialValues } from 'src/component/Author/select-form'
import { jobMap } from 'src/lib/const'

interface InitialState{
    relationList: string[],
    _authorList: AuthorData[][],
    authorList: AuthorData[][],
}

const initialState: InitialState = {
    relationList: [],
    _authorList: [],
    authorList: [],
}

// 按bangumi_id去重
function getLength(authorList: AuthorData[]): number{
    let set = new Set()
    authorList.forEach(item => {
        set.add(item.bangumi_id)
    })
    return set.size
}

function getAvgRate(authorList: AuthorData[]): number{
    let avg = 0
    let bangumiList: number[] = []
    authorList.forEach(item => {
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
                return getLength(b) - getLength(a)
            })
            break;
        default:
            authorList.sort((a, b) => {
                return b.length - a.length
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
            return getLength(item) >= (action.payload || 1)
        })
    }
}

interface SortTypeReducer extends SortType{ 
    _init?: boolean
}

export const counterSlice = createSlice({
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
            state = counterSlice.caseReducers.sortByForm({
                ...state,
                relationList:  [ ...relationList ],
                _authorList: [ ...action.payload ],
                authorList: [ ...action.payload ],
            }, { type: '', payload: { ...initialValues, _init: true } })
            return state
        },
        sortByForm: (state, action: PayloadAction<SortTypeReducer>) => {
            const map = {
                weight: counterSlice.caseReducers.sortBySubject,
                subjectCount: counterSlice.caseReducers.filterSubjectCount,
                useRate: counterSlice.caseReducers.sortByRate,
                relation: counterSlice.caseReducers.filterSubjectByRelation
            }
            let cur = {
                ...state,
                authorList: state._authorList
            }
            const isInit = !!action.payload['_init']

            let key: (keyof typeof action.payload)
            for(key in action.payload) {
                const val = action.payload[key]
                if (
                    (key === '_init') ||
                    (!isInit && initialValues[key] === val)
                ) {
                    continue
                }
                // @ts-ignore
                cur = map[key](cur, { payload: val, type: '' })
            }
            isInit && ( cur._authorList = cur.authorList )

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
                authorList: authorList
            }
        },
        filterSubjectByRelation(state, action: PayloadAction<Array<keyof typeof jobMap>>) {
            let relation: string[] = []
            const extraRelation = state.relationList.filter(_ => Object.values(jobMap).every(item => !item || !item.includes(_)))
            action.payload.forEach(item => {
                relation = relation.concat(jobMap[item] || extraRelation)
            })
            const authorList = [ ...state.authorList ].map(_ => _.filter(item => relation.includes(item.relation))).filter(item => item.length)
            return {
                ...state,
                authorList,
            }
        }
    },
})

// Action creators are generated for each case reducer function
export const { setAuthorList, sortBySubject, filterSubjectCount, sortByForm, sortByRate } = counterSlice.actions
export default counterSlice.reducer