import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction, SliceCaseReducers } from '@reduxjs/toolkit'
import type { AuthorData } from 'src/component/Author/type'
import { weightType, type SortType } from 'src/component/Author/select-form'
import { initialValues } from 'src/component/Author/select-form'

interface InitialState{
    _authorList: AuthorData[][],
    authorList: AuthorData[][],
}

const initialState: InitialState = {
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
            state = counterSlice.caseReducers.sortByForm({
                _authorList: [ ...action.payload ],
                authorList: [ ...action.payload ],
            }, { type: '', payload: { ...initialValues, _init: true } })
            return state
        },
        sortByForm: (state, action: PayloadAction<SortTypeReducer>) => {
            const map = {
                weight: _sortBySubject,
                subjectCount: _filterSubjectCount,
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
    },
})

// Action creators are generated for each case reducer function
export const { setAuthorList, sortBySubject, filterSubjectCount, sortByForm } = counterSlice.actions

export default counterSlice.reducer