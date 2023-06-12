import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction, SliceCaseReducers } from '@reduxjs/toolkit'
import type { AuthorData } from 'src/component/Author/type'
import { weightType, type SortType } from 'src/component/Author/select-form'

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


export const counterSlice = createSlice({
    name: 'author',
    initialState,
    reducers: {
        setAuthorList: (state, action: PayloadAction<AuthorData[][]>) => {
            return {
                _authorList: action.payload,
                authorList: action.payload,
            }
        },
        sortByForm: (state, action: PayloadAction<SortType>) => {
            const map = {
                weight: _sortBySubject,
                subjectCount: _filterSubjectCount,
            }
            let cur = {
                ...state,
                authorList: state._authorList
            }
            for(const key in action.payload) {
                // @ts-ignore
                cur = map[key](cur, { payload: action.payload[key], type: '' })
            }
            return cur
        },
        sortBySubject: _sortBySubject,
        filterSubjectCount: _filterSubjectCount,
    },
})

// Action creators are generated for each case reducer function
export const { setAuthorList, sortBySubject, filterSubjectCount, sortByForm } = counterSlice.actions

export default counterSlice.reducer